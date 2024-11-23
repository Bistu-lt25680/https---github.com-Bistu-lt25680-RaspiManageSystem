import { Controller, Get, Post, Body } from '@nestjs/common';
import { DistanceService } from './distance.service';

@Controller('api/distance')
export class DistanceController {
  constructor(private readonly distanceService: DistanceService) {}

  @Get()
  async getDistanceData() {
    return this.distanceService.getLatestDistance();
  }

  @Post()
  async updateDistanceData(@Body() data: any) {
    return this.distanceService.saveDistance(data);
  }
}