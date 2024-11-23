import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';

interface Distance {
  distance: number;
  timestamp: number;
}

mongoose.connect('mongodb://localhost:27017/components');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB components database');
});

@Injectable()
export class DistanceService {
  private formatDateTime(timestamp: number): string {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  }

  async saveDistance(data: Distance) {
    try {
      const timestamp = Date.now();
      const formattedTime = this.formatDateTime(timestamp);
      
      // 打印日志
      console.log(`[${formattedTime}] distance: ${data.distance}`);

      // 使用 db 直接写入数据
      await db.collection('distance').insertOne({
        distance: data.distance,
        timestamp: timestamp,
        datetime: formattedTime  // 添加格式化的时间字段
      });

      return {
        success: true,
        message: '数据保存成功'
      };
    } catch (error) {
      console.error('保存距离数据失败:', error);
      return {
        success: false,
        message: '数据保存失败'
      };
    }
  }

  async getLatestDistance() {
    try {
      const latestData = await db.collection('distance')
        .find()
        .sort({ timestamp: -1 })
        .limit(1)
        .toArray();

      return latestData[0] ? {
        distance: latestData[0].distance,
        timestamp: latestData[0].timestamp,
        datetime: latestData[0].datetime  // 返回格式化的时间
      } : null;
    } catch (error) {
      console.error('获取距离数据失败:', error);
      return null;
    }
  }
}