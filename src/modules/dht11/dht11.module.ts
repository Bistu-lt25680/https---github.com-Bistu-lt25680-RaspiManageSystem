import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { DHT11Service } from './dht11.service';
import { DHT11Controller } from './dht11.controller';

const TemperatureSchema = new Schema({
  value: Number,
  timestamp: { type: Number, default: Date.now }
});

const HumiditySchema = new Schema({
  value: Number,
  timestamp: { type: Number, default: Date.now }
});

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'humidity_temperature', schema: TemperatureSchema },
      { name: 'humidity_temperature', schema: HumiditySchema }
    ])
  ],
  controllers: [DHT11Controller],
  providers: [DHT11Service]
})
export class DHT11Module {}