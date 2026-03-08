import { Column, Entity } from 'typeorm';
import { BasicEntity } from 'src/common/entities/base.entity';

@Entity('<%= dasherize(name) %>s')
export class <%= classify(name) %> extends BasicEntity {
  @Column({ length: 100 })
  name: string;
}
