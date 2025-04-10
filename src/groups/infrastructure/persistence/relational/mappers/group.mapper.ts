import { Group } from '../../../../domain/group';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { GroupEntity } from '../entities/group.entity';

export class GroupMapper {
  static toDomain(raw: GroupEntity): Group {
    const domainEntity = new Group();
    if (raw.instructors) {
      domainEntity.instructors = raw.instructors.map((item) =>
        UserMapper.toDomain(item),
      );
    } else if (raw.instructors === null) {
      domainEntity.instructors = null;
    }

    if (raw.students) {
      domainEntity.students = raw.students.map((item) =>
        UserMapper.toDomain(item),
      );
    } else if (raw.students === null) {
      domainEntity.students = null;
    }
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.description = raw.description;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Group): GroupEntity {
    const persistenceEntity = new GroupEntity();
    if (domainEntity.instructors) {
      persistenceEntity.instructors = domainEntity.instructors.map((item) =>
        UserMapper.toPersistence(item),
      );
    } else if (domainEntity.instructors === null) {
      persistenceEntity.instructors = null;
    }

    if (domainEntity.students) {
      persistenceEntity.students = domainEntity.students.map((item) =>
        UserMapper.toPersistence(item),
      );
    } else if (domainEntity.students === null) {
      persistenceEntity.students = null;
    }

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.description = domainEntity.description;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
