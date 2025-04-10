import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { User } from '../../domain/user';

import { FilterUserDto, SortUserDto } from '../../dto/query-user.dto';
import { UserRelationOptions } from '../../types/user.types';

export abstract class UserRepository {
  abstract create(
    data: Omit<User, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<User>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
    relationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
    relationOptions?: UserRelationOptions;
  }): Promise<User[]>;

  abstract findById(
    id: User['id'],
    relationOptions?: UserRelationOptions,
  ): Promise<NullableType<User>>;
  abstract findByIds(
    ids: User['id'][],
    relationOptions?: UserRelationOptions,
  ): Promise<User[]>;
  abstract findByEmail(
    email: User['email'],
    relationOptions?: UserRelationOptions,
  ): Promise<NullableType<User>>;
  abstract findByCin(
    cin: User['cin'],
    relationOptions?: UserRelationOptions,
  ): Promise<NullableType<User>>;
  abstract findBySocialIdAndProvider(
    {
      socialId,
      provider,
    }: {
      socialId: User['socialId'];
      provider: User['provider'];
    },
    relationOptions?: UserRelationOptions,
  ): Promise<NullableType<User>>;

  abstract update(
    id: User['id'],
    payload: DeepPartial<User>,
  ): Promise<User | null>;

  abstract remove(id: User['id']): Promise<void>;
}
