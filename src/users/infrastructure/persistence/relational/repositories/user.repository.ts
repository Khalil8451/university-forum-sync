import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  FindOptionsWhere,
  Repository,
  In,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { FilterUserDto, SortUserDto } from '../../../../dto/query-user.dto';
import { User } from '../../../../domain/user';
import { UserRepository } from '../../user.repository';
import { UserMapper } from '../mappers/user.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { applyRelations } from '../../../../../utils/apply-relations';
import { UserRelationOptions } from '../../../../types/user.types';
import { USER_VALID_RELATIONS } from '../../../../constansts/user.constants';

@Injectable()
export class UsersRelationalRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(data: User): Promise<User> {
    const persistenceModel = UserMapper.toPersistence(data);
    const newEntity = await this.usersRepository.save(
      this.usersRepository.create(persistenceModel),
    );
    return UserMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
    relationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
    relationOptions?: UserRelationOptions;
  }): Promise<User[]> {
    const where: FindOptionsWhere<UserEntity> = {};
    if (filterOptions?.roles?.length) {
      where.role = filterOptions.roles.map((role) => ({
        id: Number(role.id),
      }));
    }

    const baseQuery: FindManyOptions<UserEntity> = {
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    };

    const query = applyRelations(
      baseQuery,
      relationOptions?.relations,
      USER_VALID_RELATIONS,
    );
    const entities = await this.usersRepository.find(query);

    return entities.map((user) => UserMapper.toDomain(user));
  }

  async findById(
    id: User['id'],
    relationOptions?: UserRelationOptions,
  ): Promise<NullableType<User>> {
    const baseQuery: FindOneOptions<UserEntity> = {
      where: { id: Number(id) },
    };

    const query = applyRelations(
      baseQuery,
      relationOptions?.relations,
      USER_VALID_RELATIONS,
    );
    const entity = await this.usersRepository.findOne(query);

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByIds(
    ids: User['id'][],
    relationOptions?: UserRelationOptions,
  ): Promise<User[]> {
    const baseQuery: FindManyOptions<UserEntity> = {
      where: { id: In(ids) },
    };

    const query = applyRelations(
      baseQuery,
      relationOptions?.relations,
      USER_VALID_RELATIONS,
    );
    const entities = await this.usersRepository.find(query);

    return entities.map((user) => UserMapper.toDomain(user));
  }

  async findByEmail(
    email: User['email'],
    relationOptions?: UserRelationOptions,
  ): Promise<NullableType<User>> {
    if (!email) return null;

    const baseQuery: FindOneOptions<UserEntity> = {
      where: { email },
    };

    const query = applyRelations(
      baseQuery,
      relationOptions?.relations,
      USER_VALID_RELATIONS,
    );
    const entity = await this.usersRepository.findOne(query);

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByCin(
    cin: User['cin'],
    relationOptions?: UserRelationOptions,
  ): Promise<NullableType<User>> {
    if (!cin) return null;

    const baseQuery: FindOneOptions<UserEntity> = {
      where: { cin },
    };

    const query = applyRelations(
      baseQuery,
      relationOptions?.relations,
      USER_VALID_RELATIONS,
    );
    const entity = await this.usersRepository.findOne(query);

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findBySocialIdAndProvider(
    {
      socialId,
      provider,
    }: {
      socialId: User['socialId'];
      provider: User['provider'];
    },
    relationOptions?: UserRelationOptions,
  ): Promise<NullableType<User>> {
    if (!socialId || !provider) return null;

    const baseQuery: FindOneOptions<UserEntity> = {
      where: { socialId, provider },
    };

    const query = applyRelations(
      baseQuery,
      relationOptions?.relations,
      USER_VALID_RELATIONS,
    );
    const entity = await this.usersRepository.findOne(query);

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async update(id: User['id'], payload: Partial<User>): Promise<User> {
    const entity = await this.usersRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('User not found');
    }

    const updatedEntity = await this.usersRepository.save(
      this.usersRepository.create(
        UserMapper.toPersistence({
          ...UserMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return UserMapper.toDomain(updatedEntity);
  }

  async remove(id: User['id']): Promise<void> {
    await this.usersRepository.softDelete(id);
  }
}
