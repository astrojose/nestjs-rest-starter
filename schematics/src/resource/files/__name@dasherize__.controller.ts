import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Auth,
  ApiCreatedStandardResponse,
  ApiDeletedResponse,
  ApiNotFoundStandardResponse,
  ApiPaginatedResponse,
  ApiPaginationQueries,
  ApiStandardResponse,
  ApiUpdatedResponse,
} from 'src/common/decorators';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { <%= classify(name) %>Service } from './<%= dasherize(name) %>.service';
import { Create<%= classify(name) %>Dto } from './dto/create-<%= dasherize(name) %>.dto';
import { Update<%= classify(name) %>Dto } from './dto/update-<%= dasherize(name) %>.dto';
import { <%= classify(name) %>ResponseDto } from './dto/responses/<%= dasherize(name) %>.response.dto';

@ApiTags('<%= dasherize(name) %>')
@Controller('<%= dasherize(name) %>')
@Auth()
export class <%= classify(name) %>Controller {
  constructor(private readonly <%= camelize(name) %>Service: <%= classify(name) %>Service) {}

  @Post()
  @ApiOperation({ summary: 'Create <%= dasherize(name) %>' })
  @ApiCreatedStandardResponse('<%= classify(name) %>', <%= classify(name) %>ResponseDto)
  async create(@Body() dto: Create<%= classify(name) %>Dto): Promise<<%= classify(name) %>ResponseDto> {
    return new <%= classify(name) %>ResponseDto(await this.<%= camelize(name) %>Service.create(dto));
  }

  @Get()
  @ApiOperation({ summary: 'List <%= dasherize(name) %> resources paginated' })
  @ApiPaginationQueries()
  @ApiPaginatedResponse(<%= classify(name) %>ResponseDto)
  async findAll(@Query() query: PaginationQueryDto) {
    const result = await this.<%= camelize(name) %>Service.findAllPaginated(query);
    return {
      ...result,
      data: result.data.map(item => new <%= classify(name) %>ResponseDto(item)),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get <%= dasherize(name) %> by id' })
  @ApiStandardResponse(<%= classify(name) %>ResponseDto)
  @ApiNotFoundStandardResponse('<%= classify(name) %>')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<<%= classify(name) %>ResponseDto> {
    return new <%= classify(name) %>ResponseDto(await this.<%= camelize(name) %>Service.findOne(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update <%= dasherize(name) %>' })
  @ApiUpdatedResponse('<%= classify(name) %>', <%= classify(name) %>ResponseDto)
  @ApiNotFoundStandardResponse('<%= classify(name) %>')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Update<%= classify(name) %>Dto,
  ): Promise<<%= classify(name) %>ResponseDto> {
    return new <%= classify(name) %>ResponseDto(await this.<%= camelize(name) %>Service.update(id, dto));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete <%= dasherize(name) %>' })
  @ApiDeletedResponse('<%= classify(name) %>')
  @ApiNotFoundStandardResponse('<%= classify(name) %>')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.<%= camelize(name) %>Service.remove(id);
  }
}
