import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindOneOptions, FindManyOptions } from 'typeorm';
import { GroupEntity } from '../entities/group.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Group } from '../../../../domain/group';
import { GroupRepository } from '../../group.repository';
import { GroupMapper } from '../mappers/group.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { applyRelations } from '../../../../../utils/apply-relations';
import { GroupRelationOptions } from '../../../../types/group.type';
import { GROUP_VALID_RELATIONS } from '../../../../constants/group.constants';

@Injectable()
export class GroupRelationalRepository implements GroupRepository {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
  ) {}

  async create(data: Group): Promise<Group> {
    const persistenceModel = GroupMapper.toPersistence(data);
    const newEntity = await this.groupRepository.save(
      this.groupRepository.create(persistenceModel),
    );
    return GroupMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
    relationOptions,
  }: {
    paginationOptions: IPaginationOptions;
    relationOptions?: GroupRelationOptions;
  }): Promise<Group[]> {
    const baseQuery: FindManyOptions<GroupEntity> = {
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    };

    const query = applyRelations(
      baseQuery,
      relationOptions?.relations,
      GROUP_VALID_RELATIONS,
    );
    const entities = await this.groupRepository.find(query);

    return entities.map((entity) => GroupMapper.toDomain(entity));
  }

  async findById(
    id: Group['id'],
    relationOptions?: GroupRelationOptions,
  ): Promise<NullableType<Group>> {
    const baseQuery: FindOneOptions<GroupEntity> = {
      where: { id },
    };

    const query = applyRelations(
      baseQuery,
      relationOptions?.relations,
      GROUP_VALID_RELATIONS,
    );
    const entity = await this.groupRepository.findOne(query);

    return entity ? GroupMapper.toDomain(entity) : null;
  }

  async findByIds(
    ids: Group['id'][],
    relationOptions?: GroupRelationOptions,
  ): Promise<Group[]> {
    const baseQuery: FindManyOptions<GroupEntity> = {
      where: { id: In(ids) },
    };

    const query = applyRelations(
      baseQuery,
      relationOptions?.relations,
      GROUP_VALID_RELATIONS,
    );
    const entities = await this.groupRepository.find(query);

    return entities.map((entity) => GroupMapper.toDomain(entity));
  }

  async findByName(
    name: Group['name'],
    relationOptions?: GroupRelationOptions,
  ): Promise<NullableType<Group>> {
    const baseQuery: FindOneOptions<GroupEntity> = {
      where: { name },
    };

    const query = applyRelations(
      baseQuery,
      relationOptions?.relations,
      GROUP_VALID_RELATIONS,
    );
    const entity = await this.groupRepository.findOne(query);

    return entity ? GroupMapper.toDomain(entity) : null;
  }

  async update(id: Group['id'], payload: Partial<Group>): Promise<Group> {
    const entity = await this.groupRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.groupRepository.save(
      this.groupRepository.create(
        GroupMapper.toPersistence({
          ...GroupMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return GroupMapper.toDomain(updatedEntity);
  }

  async remove(id: Group['id']): Promise<void> {
    await this.groupRepository.delete(id);
  }
}
