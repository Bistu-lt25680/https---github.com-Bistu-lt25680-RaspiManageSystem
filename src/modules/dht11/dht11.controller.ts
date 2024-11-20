import { Controller, Get, Post, Body } from '@nestjs/common';
import { DHT11Service } from './dht11.service';

@Controller('api/dht11datas')
export class DHT11Controller {
  constructor(private readonly dht11Service: DHT11Service) {}

  @Get()
  async getDHT11Data() {
    return this.dht11Service.getLatestData();
  }

  @Post()
  async updateDHT11Data(@Body() data: any) {
    return this.dht11Service.saveDHT11Data(data);
  }
}