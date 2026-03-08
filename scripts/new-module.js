#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const moduleName = process.argv[2];

if (!moduleName) {
  console.error('Usage: node scripts/new-module.js <module-name>');
  console.error('Example: node scripts/new-module.js product');
  process.exit(1);
}

if (!/^[a-z][a-z0-9-]*$/.test(moduleName)) {
  console.error('Error: module name must be lowercase kebab-case (e.g. product, blog-post)');
  process.exit(1);
}

const pascal = moduleName.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());
const moduleDir = path.join('src', 'modules', moduleName);

if (fs.existsSync(moduleDir)) {
  console.error(`Error: ${moduleDir} already exists`);
  process.exit(1);
}

['dto/responses', 'entities', 'repositories'].forEach(dir =>
  fs.mkdirSync(path.join(moduleDir, dir), { recursive: true }),
);

const files = {
  [`entities/${moduleName}.entity.ts`]: `\
import { Column, Entity } from 'typeorm';
import { BasicEntity } from 'src/common/entities/base.entity';

@Entity('${moduleName}s')
export class ${pascal} extends BasicEntity {
  @Column({ length: 100 })
  name: string;
}
`,

  [`dto/create-${moduleName}.dto.ts`]: `\
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class Create${pascal}Dto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
`,

  [`dto/update-${moduleName}.dto.ts`]: `\
import { PartialType } from '@nestjs/swagger';
import { Create${pascal}Dto } from './create-${moduleName}.dto';

export class Update${pascal}Dto extends PartialType(Create${pascal}Dto) {}
`,

  [`dto/responses/${moduleName}.response.dto.ts`]: `\
import { ApiProperty } from '@nestjs/swagger';
import { ${pascal} } from '../entities/${moduleName}.entity';

export class ${pascal}ResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(entity: ${pascal}) {
    this.id = entity.id;
    this.name = entity.name;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
`,

  [`repositories/${moduleName}.repository.ts`]: `\
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { ${pascal} } from '../entities/${moduleName}.entity';

@Injectable()
export class ${pascal}Repository extends BaseRepository<${pascal}> {
  constructor(
    @InjectRepository(${pascal})
    private readonly repo: Repository<${pascal}>,
  ) {
    super(repo);
  }
}
`,

  [`${moduleName}.service.ts`]: `\
import { Injectable, NotFoundException } from '@nestjs/common';
import { ${pascal}Repository } from './repositories/${moduleName}.repository';
import { Create${pascal}Dto } from './dto/create-${moduleName}.dto';
import { Update${pascal}Dto } from './dto/update-${moduleName}.dto';
import { ${pascal} } from './entities/${moduleName}.entity';

@Injectable()
export class ${pascal}Service {
  constructor(private readonly ${moduleName}Repository: ${pascal}Repository) {}

  async create(dto: Create${pascal}Dto): Promise<${pascal}> {
    return this.${moduleName}Repository.save(dto);
  }

  async findAll(): Promise<${pascal}[]> {
    return this.${moduleName}Repository.findAll();
  }

  async findOne(id: number): Promise<${pascal}> {
    const entity = await this.${moduleName}Repository.findById(id);
    if (!entity) throw new NotFoundException('${pascal} not found');
    return entity;
  }

  async update(id: number, dto: Update${pascal}Dto): Promise<${pascal}> {
    const entity = await this.findOne(id);
    return this.${moduleName}Repository.save(entity.mergeData(dto));
  }

  async remove(id: number): Promise<void> {
    const deleted = await this.${moduleName}Repository.deleteById(id);
    if (!deleted) throw new NotFoundException('${pascal} not found');
  }
}
`,

  [`${moduleName}.controller.ts`]: `\
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ${pascal}Service } from './${moduleName}.service';
import { Create${pascal}Dto } from './dto/create-${moduleName}.dto';
import { Update${pascal}Dto } from './dto/update-${moduleName}.dto';
import { ${pascal}ResponseDto } from './dto/responses/${moduleName}.response.dto';

@ApiTags('${moduleName}')
@Controller('${moduleName}')
export class ${pascal}Controller {
  constructor(private readonly ${moduleName}Service: ${pascal}Service) {}

  @Post()
  @ApiOperation({ summary: 'Create ${moduleName}' })
  @ApiResponse({ status: 201, type: ${pascal}ResponseDto })
  async create(@Body() dto: Create${pascal}Dto): Promise<${pascal}ResponseDto> {
    return new ${pascal}ResponseDto(await this.${moduleName}Service.create(dto));
  }

  @Get()
  @ApiOperation({ summary: 'List all ${moduleName}s' })
  @ApiResponse({ status: 200, type: [${pascal}ResponseDto] })
  async findAll(): Promise<${pascal}ResponseDto[]> {
    return (await this.${moduleName}Service.findAll()).map(e => new ${pascal}ResponseDto(e));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ${moduleName} by id' })
  @ApiResponse({ status: 200, type: ${pascal}ResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<${pascal}ResponseDto> {
    return new ${pascal}ResponseDto(await this.${moduleName}Service.findOne(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update ${moduleName}' })
  @ApiResponse({ status: 200, type: ${pascal}ResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Update${pascal}Dto,
  ): Promise<${pascal}ResponseDto> {
    return new ${pascal}ResponseDto(await this.${moduleName}Service.update(id, dto));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete ${moduleName}' })
  @ApiResponse({ status: 200 })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.${moduleName}Service.remove(id);
  }
}
`,

  [`${moduleName}.module.ts`]: `\
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${pascal} } from './entities/${moduleName}.entity';
import { ${pascal}Repository } from './repositories/${moduleName}.repository';
import { ${pascal}Service } from './${moduleName}.service';
import { ${pascal}Controller } from './${moduleName}.controller';

@Module({
  imports: [TypeOrmModule.forFeature([${pascal}])],
  controllers: [${pascal}Controller],
  providers: [${pascal}Service, ${pascal}Repository],
  exports: [${pascal}Service],
})
export class ${pascal}Module {}
`,
};

for (const [filePath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(moduleDir, filePath), content, 'utf8');
}

console.log(`\n✓ Module '${moduleName}' generated at ${moduleDir}/\n`);
console.log('Next steps:');
console.log(`  1. Import ${pascal}Module in src/app.module.ts`);
console.log(`  2. Customize entity columns in ${moduleDir}/entities/${moduleName}.entity.ts`);
console.log(`  3. Customize response DTO in ${moduleDir}/dto/responses/${moduleName}.response.dto.ts`);
