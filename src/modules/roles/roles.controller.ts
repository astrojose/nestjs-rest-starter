import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { RolesService } from 'src/modules/roles/roles.service';
import { UpdateRoleDto } from 'src/modules/roles/dto/update-role.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRoleDto } from 'src/modules/roles/dto/create-role.dto';

@ApiTags('Roles')
@ApiBearerAuth('JWT')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'List of roles' })
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @ApiOperation({ summary: 'Get a role by id' })
  @ApiResponse({ status: 200, description: 'Role found' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a role by id' })
  @ApiResponse({ status: 200, description: 'Role updated' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }
}
