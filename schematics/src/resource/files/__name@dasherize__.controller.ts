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
import { <%= classify(name) %>Service } from './<%= dasherize(name) %>.service';
import { Create<%= classify(name) %>Dto } from './dto/create-<%= dasherize(name) %>.dto';
import { Update<%= classify(name) %>Dto } from './dto/update-<%= dasherize(name) %>.dto';
import { <%= classify(name) %>ResponseDto } from './dto/responses/<%= dasherize(name) %>.response.dto';

@ApiTags('<%= dasherize(name) %>')
@Controller('<%= dasherize(name) %>')
export class <%= classify(name) %>Controller {
  constructor(private readonly <%= camelize(name) %>Service: <%= classify(name) %>Service) {}

  @Post()
  @ApiOperation({ summary: 'Create <%= dasherize(name) %>' })
  @ApiResponse({ status: 201, type: <%= classify(name) %>ResponseDto })
  async create(@Body() dto: Create<%= classify(name) %>Dto): Promise<<%= classify(name) %>ResponseDto> {
    return new <%= classify(name) %>ResponseDto(await this.<%= camelize(name) %>Service.create(dto));
  }

  @Get()
  @ApiOperation({ summary: 'List all <%= dasherize(name) %>s' })
  @ApiResponse({ status: 200, type: [<%= classify(name) %>ResponseDto] })
  async findAll(): Promise<<%= classify(name) %>ResponseDto[]> {
    return (await this.<%= camelize(name) %>Service.findAll()).map(
      (e) => new <%= classify(name) %>ResponseDto(e),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get <%= dasherize(name) %> by id' })
  @ApiResponse({ status: 200, type: <%= classify(name) %>ResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<<%= classify(name) %>ResponseDto> {
    return new <%= classify(name) %>ResponseDto(await this.<%= camelize(name) %>Service.findOne(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update <%= dasherize(name) %>' })
  @ApiResponse({ status: 200, type: <%= classify(name) %>ResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Update<%= classify(name) %>Dto,
  ): Promise<<%= classify(name) %>ResponseDto> {
    return new <%= classify(name) %>ResponseDto(await this.<%= camelize(name) %>Service.update(id, dto));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete <%= dasherize(name) %>' })
  @ApiResponse({ status: 200 })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.<%= camelize(name) %>Service.remove(id);
  }
}
