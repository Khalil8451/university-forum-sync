import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Group } from '../../domain/group';
import { GroupRelationOptions } from '../../types/group.type';

export abstract class GroupRepository {
  abstract create(
    data: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Group>;

  abstract findAllWithPagination({
    paginationOptions,
    relationOptions,
  }: {
    paginationOptions: IPaginationOptions;
    relationOptions?: GroupRelationOptions;
  }): Promise<Group[]>;

  abstract findById(
    id: Group['id'],
    relationOptions?: GroupRelationOptions,
  ): Promise<NullableType<Group>>;

  abstract findByIds(
    ids: Group['id'][],
    relationOptions?: GroupRelationOptions,
  ): Promise<Group[]>;

  abstract findByName(
    name: Group['name'],
    relationOptions?: GroupRelationOptions,
  ): Promise<NullableType<Group>>;

  abstract update(
    id: Group['id'],
    payload: DeepPartial<Group>,
  ): Promise<Group | null>;

  abstract remove(id: Group['id']): Promise<void>;
}
