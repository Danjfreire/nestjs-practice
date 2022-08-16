import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { SchoolController } from './controllers/school.controller';
import { SchoolService } from './services/school.service';

@Module({
  controllers: [SchoolController],
  imports : [DatabaseModule],
  providers: [SchoolService]
})
export class SchoolModule {}
