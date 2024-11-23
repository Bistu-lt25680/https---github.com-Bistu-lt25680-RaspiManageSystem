import { Module } from '@nestjs/common';
import { FaceRecognitionController } from './FaceRecognition.controller';
import { RecognizeLogService } from './recognizelog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RecognizeLogSchema } from './schemas/recognizelog.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'RecognizeLog', schema: RecognizeLogSchema }
    ])
  ],
  controllers: [FaceRecognitionController],
  providers: [RecognizeLogService]
})
export class FaceRecognitionModule {}