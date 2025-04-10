import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
  SerializeOptions,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Group } from './domain/group';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllGroupsDto } from './dto/find-all-groups.dto';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';
import { NullableType } from '../utils/types/nullable.type';
import { GroupRelationTypes } from './types/group.type';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Groups')
@Controller({
  path: 'groups',
  version: '1',
})
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiCreatedResponse({
    type: Group,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Roles(RoleEnum.admin)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createGroupDto: CreateGroupDto): Promise<Group> {
    return this.groupsService.create(createGroupDto);
  }

  @ApiOkResponse({
    type: InfinityPaginationResponse(Group),
  })
  @Roles(RoleEnum.admin, RoleEnum.professor, RoleEnum.student)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: FindAllGroupsDto,
  ): Promise<InfinityPaginationResponseDto<Group>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const relations = query?.relations?.split(',') as GroupRelationTypes[];

    return infinityPagination(
      await this.groupsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
        relationOptions: {
          relations,
        },
      }),
      { page, limit },
    );
  }

  @ApiOkResponse({
    type: Group,
  })
  @Roles(RoleEnum.admin, RoleEnum.professor, RoleEnum.student)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findById(
    @Param('id') id: string,
    @Query('relations') relations?: string,
  ): Promise<NullableType<Group>> {
    const relationTypes = relations?.split(',') as GroupRelationTypes[];
    return this.groupsService.findById(id, { relations: relationTypes });
  }

  @ApiOkResponse({
    type: Group,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Roles(RoleEnum.admin)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<Group | null> {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Roles(RoleEnum.admin)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.groupsService.remove(id);
  }
}
