import { Injectable } from '@nestjs/common';
import mongoose, { Schema } from 'mongoose';

// 连接数据库
mongoose.connect('mongodb://localhost:27017/components');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB components database');
});

// 定义 Schema
const RecognizeLogSchema = new Schema({
  image: { type: String },
  timestamp: { type: Number, default: Date.now },
  time: {
    year: { type: String },
    month: { type: String },
    day: { type: String },
    hour: { type: String },
    minute: { type: String },
    second: { type: String }
  },
  recognitionInfo: {
    success: { type: Boolean },
    name: { type: String },
    college: { type: String }
  }
});

// 定义模型
const RecognizeLog = mongoose.model('RecognizeLog', RecognizeLogSchema);

@Injectable()
export class RecognizeLogService {
  async saveLog(data: {
    image: string;
    timestamp: number;
    time: {
      year: string;
      month: string;
      day: string;
      hour: string;
      minute: string;
      second: string;
    };
    recognitionInfo: {
      success: boolean;
      name: string;
      college: string;
    };
  }) {
    const log = new RecognizeLog(data);
    return await log.save();
  }

  async getLatestLogs(limit: number = 10) {
    return await RecognizeLog.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
  }
} 