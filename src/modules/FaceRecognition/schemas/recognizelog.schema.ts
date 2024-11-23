import { Schema, Document } from 'mongoose';

export interface RecognizeLog extends Document {
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
}

export const RecognizeLogSchema = new Schema({
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