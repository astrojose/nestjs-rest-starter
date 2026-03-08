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
import { RoleResponseDto } from 'src/modules/roles/dto/responses/role.response.dto';

@ApiTags('Roles')
@ApiBearerAuth('JWT')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, type: RoleResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    return this.rolesService.create(createRoleDto);
  }

  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, type: [RoleResponseDto] })
  @Get()
  findAll(): Promise<RoleResponseDto[]> {
    return this.rolesService.findAll();
  }

  @ApiOperation({ summary: 'Get a role by id' })
  @ApiResponse({ status: 200, type: RoleResponseDto })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<RoleResponseDto> {
    return this.rolesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a role by id' })
  @ApiResponse({ status: 200, type: RoleResponseDto })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    return this.rolesService.update(id, updateRoleDto);
  }
}
