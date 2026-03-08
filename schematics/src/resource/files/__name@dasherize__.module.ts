import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { <%= classify(name) %> } from './entities/<%= dasherize(name) %>.entity';
import { <%= classify(name) %>Repository } from './repositories/<%= dasherize(name) %>.repository';
import { <%= classify(name) %>Service } from './<%= dasherize(name) %>.service';
import { <%= classify(name) %>Controller } from './<%= dasherize(name) %>.controller';

@Module({
  imports: [TypeOrmModule.forFeature([<%= classify(name) %>])],
  controllers: [<%= classify(name) %>Controller],
  providers: [<%= classify(name) %>Service, <%= classify(name) %>Repository],
  exports: [<%= classify(name) %>Service],
})
export class <%= classify(name) %>Module {}
