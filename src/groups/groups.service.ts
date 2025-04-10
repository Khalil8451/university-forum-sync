import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupRepository } from './infrastructure/persistence/group.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Group } from './domain/group';
import { NullableType } from '../utils/types/nullable.type';
import { GroupRelationOptions } from './types/group.type';

@Injectable()
export class GroupsService {
  constructor(
    // Dependencies here
    private readonly groupRepository: GroupRepository,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    // Do not remove comment below.
    // <creating-property />
    if (createGroupDto.name) {
      const groupObject = await this.groupRepository.findByName(
        createGroupDto.name,
      );
      if (groupObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            name: 'nameAlreadyExists',
          },
        });
      }
    }

    return this.groupRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      name: createGroupDto.name,
      description: createGroupDto.description,
    });
  }

  findAllWithPagination({
    paginationOptions,
    relationOptions,
  }: {
    paginationOptions: IPaginationOptions;
    relationOptions?: GroupRelationOptions;
  }): Promise<Group[]> {
    return this.groupRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
      relationOptions,
    });
  }

  findById(
    id: Group['id'],
    relationOptions?: GroupRelationOptions,
  ): Promise<NullableType<Group>> {
    return this.groupRepository.findById(id, relationOptions);
  }

  findByIds(
    ids: Group['id'][],
    relationOptions?: GroupRelationOptions,
  ): Promise<Group[]> {
    return this.groupRepository.findByIds(ids, relationOptions);
  }

  findByName(
    name: Group['name'],
    relationOptions?: GroupRelationOptions,
  ): Promise<NullableType<Group>> {
    return this.groupRepository.findByName(name, relationOptions);
  }

  async update(
    id: Group['id'],

    updateGroupDto: UpdateGroupDto,
  ): Promise<Group | null> {
    // Do not remove comment below.
    // <updating-property />

    return this.groupRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      description: updateGroupDto.description,
      name: updateGroupDto.name,
    });
  }

  remove(id: Group['id']): Promise<void> {
    return this.groupRepository.remove(id);
  }
}
