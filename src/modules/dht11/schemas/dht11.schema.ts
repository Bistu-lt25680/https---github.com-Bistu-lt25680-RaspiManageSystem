import { Schema } from 'mongoose';

export const DHT11Schema = new Schema({
  temperature: Number,
  humidity: Number,
  timestamp: { type: Number, default: Date.now }
}); 