import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateSchoolDTO } from '../models/school.model';
import { SchoolService } from '../services/school.service';

@Controller('school')
export class SchoolController {

    constructor(
        private schoolService: SchoolService
    ) { }


    @Get()
    async listSchools() {
       return await this.schoolService.list()
    }

    @Post()
    async createSchool(
        @Body() data: CreateSchoolDTO
    ) {
        await this.schoolService.create(data);
    }

}
