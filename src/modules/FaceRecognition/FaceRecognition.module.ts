import { Module } from '@nestjs/common';
import { FaceRecognitionController } from './FaceRecognition.controller';
import { FaceRecognitionService } from './FaceRecognition.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';

@Module({
  controllers: [FaceRecognitionController],
  providers: [FaceRecognitionService],
  imports: [
    MongooseModule.forFeature([{ name: 'FaceRecognition', schema: UserSchema }])
  ],
})
export class FaceRecognitionModule {}