import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import { CreateSchoolDTO, School } from '../models/school.model';

@Injectable()
export class SchoolService {

    constructor(
        @Inject('DATABASE_CONNECTION')
        private db: Db
    ) { }

    async create(data : CreateSchoolDTO) {
        await this.db.collection('schools').insertOne(data);
    }

    async list() {
        const docs = await this.db.collection('schools').find().toArray();
        return docs;
    }

}
