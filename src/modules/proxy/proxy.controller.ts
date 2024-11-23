import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';

@Controller('proxy')
export class ProxyController {
  @Get('video-stream')
  async proxyVideoStream(@Res() res: Response) {
    try {
      const response = await axios({
        url: 'http://10.153.15.55:8081',
        method: 'GET',
        responseType: 'stream'
      });
      // 转发响应头
      res.set(response.headers);
      // 转发视频流
      response.data.pipe(res);
    } catch (error) {
      res.status(500).send('Error proxying video stream');
    }
  }
} 