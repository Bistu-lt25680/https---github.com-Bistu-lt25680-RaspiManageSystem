import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DHT11Module } from './modules/dht11/dht11.module';
import { FaceRecognitionModule } from './modules/FaceRecognition/FaceRecognition.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DistanceModule } from './modules/distance/distance.module';
import { ProxyModule } from './modules/proxy/proxy.module';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb://localhost:27017/components'
      }),
    }),
    DHT11Module,
    FaceRecognitionModule,
    DistanceModule,
    ProxyModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
