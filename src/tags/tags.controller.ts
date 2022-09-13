import { Controller, Get } from '@nestjs/common';
import { TagsRO } from './interfaces/tags.dto';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async findAll(): Promise<TagsRO> {
    const tags = await this.tagsService.findAll();

    return {
      tags: tags,
    };
  }
}
