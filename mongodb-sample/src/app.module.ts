import { Module } from '@nestjs/common';
import { SchoolModule } from './school/school.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [SchoolModule, DatabaseModule],
})
export class AppModule {}
