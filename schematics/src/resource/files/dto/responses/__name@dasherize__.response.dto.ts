import { ApiProperty } from '@nestjs/swagger';
import { <%= classify(name) %> } from '../entities/<%= dasherize(name) %>.entity';

export class <%= classify(name) %>ResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(entity: <%= classify(name) %>) {
    this.id = entity.id;
    this.name = entity.name;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
