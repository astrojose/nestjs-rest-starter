import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { <%= classify(name) %> } from '../entities/<%= dasherize(name) %>.entity';

@Injectable()
export class <%= classify(name) %>Repository extends BaseRepository<<%= classify(name) %>> {
  constructor(
    @InjectRepository(<%= classify(name) %>)
    private readonly repo: Repository<<%= classify(name) %>>,
  ) {
    super(repo);
  }
}
