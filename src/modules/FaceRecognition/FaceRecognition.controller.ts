import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { RecognizeLogService } from './recognizelog.service';
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/components');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB components database');
});

@Controller('api/face-recognition')
export class FaceRecognitionController {
  constructor(private readonly recognizeLogService: RecognizeLogService) {}

  private formatDateTime(timestamp: number): string {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  }
  @Post()
  async recognizeFace(@Body() data: { image: string }) {
    try {
      // 创建保存图片的目录
      const timestamp = Date.now();
      const formattedTime = this.formatDateTime(timestamp);

      const saveDir = path.join(__dirname, '../../../libs/facepp-python-sdk-master/');
      if (!fs.existsSync(saveDir)) {
        fs.mkdirSync(saveDir, { recursive: true });
      }

      // 生成文件名（使用时间戳）
      const fileName = `detect.jpg`;
      const filePath = path.join(saveDir, fileName);

      // 将 base64 转换为图片并保存
      const imageBuffer = Buffer.from(data.image, 'base64');
      fs.writeFileSync(filePath, imageBuffer);

      // console.log('图片已保存到:', filePath);

      const pythonResult = await new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [
          path.join(__dirname, '../../../libs/facepp-python-sdk-master/call.py'),
          path.join(__dirname, '../../../libs/facepp-python-sdk-master/detect.jpg')
        ]);

        let result = '';

        pythonProcess.stdout.on('data', (data) => {
          result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
          console.error(`Python Error: ${data}`);
        });

        pythonProcess.on('close', (code) => {
          if (code === 0) {
            try {
              resolve(JSON.parse(result));
            } catch (e) {
              reject(new Error(`Failed to parse Python output: ${result}`));
            }
          } else {
            reject(new Error(`Python process exited with code ${code}`));
          }
        });
      });

      // 从 Python 返回结果中获取 token
      const { face_token } = pythonResult as { face_token: string };
      // console.log('Python返回的 face_token:', face_token);

      // 查询数据库
      // console.log('开始查询 components 数据库中的 FaceRecognition 集合');
      const user = await db.collection('FaceRecognition').findOne({ face_token });
      // console.log('查询条件:', { face_token });
      console.log('数据库查询结果:', user);

      await db.collection('RecognizeLog').insertOne({
        face_token: face_token,
        result: user ? 'success' : 'fail',
        name: user?.name || '',
        major: user?.major || '',
        timestamp: Date.now(),
        datetime: formattedTime,
        image: data.image
      });

      if (user) {
        return {
          success: true,
          data: {
            name: user.name,
            college: user.major,
            timestamp: Date.now(),
          },
          message: '识别成功'
        };
      } else {
        return {
          success: false,
          message: '未找到匹配的用户'
        };
      }

    } catch (error) {
      console.error('识别失败:', error);
      return {
        success: false,
        message: '识别失败',
        error: error.message
      };
    }
  }
}