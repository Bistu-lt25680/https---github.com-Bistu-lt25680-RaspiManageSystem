import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { FaceRecognitionService } from './FaceRecognition.service';

@Controller('api/face-recognition')
export class FaceRecognitionController {
  constructor(private readonly faceRecognitionService: FaceRecognitionService) {}

  @Post()
  async recognizeFace(@Body() data: { image: string }) {
    try {
      console.log('收到人脸识别请求');
      console.log('图像数据长度:', data.image?.length || 0);
      
      if (!data.image) {
        throw new HttpException('未收到图像数据', HttpStatus.BAD_REQUEST);
      }

      const result = await this.faceRecognitionService.recognizeFace(data.image);
      return result;
      
    } catch (error) {
      console.error('识别处理错误:', error);
      throw new HttpException(
        error.message || '识别处理失败',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}