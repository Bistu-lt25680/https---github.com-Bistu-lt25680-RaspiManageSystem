import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';

interface DHT11Data {
  temperature: number;
  humidity: number;
  timestamp: number;
}

mongoose.connect('mongodb://localhost:27017/components');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB components database');
});

@Injectable()
export class DHT11Service {
  private formatDateTime(timestamp: number): string {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  }

  async saveDHT11Data(data: DHT11Data) {
    try {
      const timestamp = Date.now();
      const formattedTime = this.formatDateTime(timestamp);
      
      // 打印日志
      console.log(`[${formattedTime}] humidity: ${data.humidity}%, temperature: ${data.temperature}°C`);

      // 使用 db 直接写入数据
      await db.collection('humidity_temperature').insertOne({
        temperature: data.temperature,
        humidity: data.humidity,
        timestamp: timestamp,
        datetime: formattedTime  // 添加格式化的时间字段
      });

      return {
        success: true,
        message: '数据保存成功'
      };
    } catch (error) {
      console.error('保存DHT11数据失败:', error);
      return {
        success: false,
        message: '数据保存失败'
      };
    }
  }

  async getLatestData() {
    try {
      const latestData = await db.collection('humidity_temperature')
        .find()
        .sort({ timestamp: -1 })
        .limit(1)
        .toArray();

      return latestData[0] ? {
        temperature: latestData[0].temperature,
        humidity: latestData[0].humidity,
        timestamp: latestData[0].timestamp,
        datetime: latestData[0].datetime  // 返回格式化的时间
      } : null;
    } catch (error) {
      console.error('获取DHT11数据失败:', error);
      return null;
    }
  }
}