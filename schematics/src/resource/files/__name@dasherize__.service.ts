import { Injectable, NotFoundException } from '@nestjs/common';
import { <%= classify(name) %>Repository } from './repositories/<%= dasherize(name) %>.repository';
import { Create<%= classify(name) %>Dto } from './dto/create-<%= dasherize(name) %>.dto';
import { Update<%= classify(name) %>Dto } from './dto/update-<%= dasherize(name) %>.dto';
import { <%= classify(name) %> } from './entities/<%= dasherize(name) %>.entity';

@Injectable()
export class <%= classify(name) %>Service {
  constructor(private readonly <%= camelize(name) %>Repository: <%= classify(name) %>Repository) {}

  async create(dto: Create<%= classify(name) %>Dto): Promise<<%= classify(name) %>> {
    return this.<%= camelize(name) %>Repository.save(dto);
  }

  async findAll(): Promise<<%= classify(name) %>[]> {
    return this.<%= camelize(name) %>Repository.findAll();
  }

  async findOne(id: number): Promise<<%= classify(name) %>> {
    const entity = await this.<%= camelize(name) %>Repository.findById(id);
    if (!entity) throw new NotFoundException('<%= classify(name) %> not found');
    return entity;
  }

  async update(id: number, dto: Update<%= classify(name) %>Dto): Promise<<%= classify(name) %>> {
    const entity = await this.findOne(id);
    return this.<%= camelize(name) %>Repository.save(entity.mergeData(dto));
  }

  async remove(id: number): Promise<void> {
    const deleted = await this.<%= camelize(name) %>Repository.deleteById(id);
    if (!deleted) throw new NotFoundException('<%= classify(name) %> not found');
  }
}
