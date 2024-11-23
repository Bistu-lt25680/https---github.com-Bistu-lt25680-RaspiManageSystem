import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

@Injectable()
export class FaceRecognitionService {
  constructor(
    @InjectModel('FaceRecognition') private readonly faceModel: Model<any>
  ) {}

  async recognizeFace(imageBase64: string) {
    try {
      // 创建保存图片的目录
      const saveDir = path.join(__dirname, '../../../libs/facepp-python-sdk-master/');
      if (!fs.existsSync(saveDir)) {
        fs.mkdirSync(saveDir, { recursive: true });
      }

      // 生成文件名（使用时间戳）
      const fileName = `detect.jpg`;
      const filePath = path.join(saveDir, fileName);

      // 将 base64 转换为图片并保存
      const imageBuffer = Buffer.from(imageBase64, 'base64');
      fs.writeFileSync(filePath, imageBuffer);

      // console.log('图片已保存到:', filePath);

      const pythonResult = await new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [
          path.join(__dirname, '../../../libs/facepp-python-sdk-master/call.py'),
          filePath
        ]);

        let result = '';

        pythonProcess.stdout.on('data', (data) => {
          result += data.toString();
        });

        pythonProcess.on('close', (code) => {
          if (code === 0) {
            resolve(JSON.parse(result));
          } else {
            reject(new Error('Python 脚本执行失败'));
          }
        });
      });

      // 从 Python 返回结果中获取 token
      const { face_token } = pythonResult as { face_token: string };
      // console.log('Python返回的 face_token:', face_token);

      // 查询数据库
      // console.log('开始查询 components 数据库中的 FaceRecognition 集合');
      const user = await db.collection('FaceRecognition').findOne({ face_token });
      console.log('查询条件:', { face_token });
      // console.log('数据库查询结果:', user);

      // 如果还是 null，尝试直接查看集合中的所有文档
      // const allDocs = await db.collection('FaceRecognition').find({}).toArray();
      // console.log('集合中的所有文档:', allDocs);

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