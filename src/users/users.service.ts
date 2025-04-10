import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { NullableType } from '../utils/types/nullable.type';
import { FilterUserDto, SortUserDto } from './dto/query-user.dto';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { User } from './domain/user';
import bcrypt from 'bcryptjs';
import { AuthProvidersEnum } from '../auth/auth-providers.enum';
import { FilesService } from '../files/files.service';
import { RoleEnum } from '../roles/roles.enum';
import { StatusEnum } from '../statuses/statuses.enum';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { FileType } from '../files/domain/file';
import { Role } from '../roles/domain/role';
import { Status } from '../statuses/domain/status';
import { Group } from '../groups/domain/group';
import { GroupRepository } from '../groups/infrastructure/persistence/group.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRelationOptions } from './types/user.types';

@Injectable()
export class UsersService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly usersRepository: UserRepository,
    private readonly filesService: FilesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Do not remove comment below.
    // <creating-property />
    let password: string | undefined = undefined;

    if (createUserDto.password) {
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(createUserDto.password, salt);
    }

    let email: string | null = null;

    if (createUserDto.email) {
      const userObject = await this.usersRepository.findByEmail(
        createUserDto.email,
      );
      if (userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        });
      }
      email = createUserDto.email;
    }

    let cin: string | null = null;

    if (createUserDto.cin) {
      const userObject = await this.usersRepository.findByCin(
        createUserDto.cin,
      );
      if (userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            cin: 'CinAlreadyExists',
          },
        });
      }
      cin = createUserDto.cin;
    }

    let photo: FileType | null | undefined = undefined;

    if (createUserDto.photo?.id) {
      const fileObject = await this.filesService.findById(
        createUserDto.photo.id,
      );
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            photo: 'imageNotExists',
          },
        });
      }
      photo = fileObject;
    } else if (createUserDto.photo === null) {
      photo = null;
    }

    let role: Role | undefined = undefined;

    if (createUserDto.role?.id) {
      const roleObject = Object.values(RoleEnum)
        .map(String)
        .includes(String(createUserDto.role.id));
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'roleNotExists',
          },
        });
      }

      role = {
        id: createUserDto.role.id,
      };
    }

    let status: Status | undefined = undefined;

    if (createUserDto.status?.id) {
      const statusObject = Object.values(StatusEnum)
        .map(String)
        .includes(String(createUserDto.status.id));
      if (!statusObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: 'statusNotExists',
          },
        });
      }

      status = {
        id: createUserDto.status.id,
      };
    }

    let instructorGroups: Group[] | null | undefined = undefined;

    if (createUserDto.instructorGroups) {
      const instructorGroupsObjects = await this.groupRepository.findByIds(
        createUserDto.instructorGroups.map((entity) => entity.id),
      );
      if (
        instructorGroupsObjects.length !== createUserDto.instructorGroups.length
      ) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            instructorGroups: 'notExists',
          },
        });
      }
      instructorGroups = instructorGroupsObjects;
    } else if (createUserDto.instructorGroups === null) {
      instructorGroups = null;
    }

    let group: Group | null | undefined = undefined;

    if (createUserDto.group) {
      const groupObject = await this.groupRepository.findById(
        createUserDto.group.id,
      );
      if (!groupObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            group: 'notExists',
          },
        });
      }
      group = groupObject;
    } else if (createUserDto.group === null) {
      group = null;
    }

    return this.usersRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: email,
      password: password,
      photo: photo,
      role: role,
      status: status,
      provider: createUserDto.provider ?? AuthProvidersEnum.email,
      socialId: createUserDto.socialId,
      group,
      instructorGroups,
      dateOfBirth: createUserDto.dateOfBirth,
      address: createUserDto.address,
      phoneNumber: createUserDto.phoneNumber,
      cin: cin,
    });
  }

  findManyWithPagination({
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
    return this.usersRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
      relationOptions,
    });
  }

  findById(
    id: User['id'],
    relationOptions?: UserRelationOptions,
  ): Promise<NullableType<User>> {
    return this.usersRepository.findById(id, relationOptions);
  }

  findByIds(
    ids: User['id'][],
    relationOptions?: UserRelationOptions,
  ): Promise<User[]> {
    return this.usersRepository.findByIds(ids, relationOptions);
  }

  findByEmail(
    email: User['email'],
    relationOptions?: UserRelationOptions,
  ): Promise<NullableType<User>> {
    return this.usersRepository.findByEmail(email, relationOptions);
  }

  findBySocialIdAndProvider(
    {
      socialId,
      provider,
    }: {
      socialId: User['socialId'];
      provider: User['provider'];
    },
    relationOptions?: UserRelationOptions,
  ): Promise<NullableType<User>> {
    return this.usersRepository.findBySocialIdAndProvider(
      {
        socialId,
        provider,
      },
      relationOptions,
    );
  }

  async update(
    id: User['id'],
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    // Do not remove comment below.
    // <updating-property />
    let password: string | undefined = undefined;

    if (updateUserDto.password) {
      const userObject = await this.usersRepository.findById(id);

      if (userObject && userObject?.password !== updateUserDto.password) {
        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(updateUserDto.password, salt);
      }
    }

    let email: string | null | undefined = undefined;

    if (updateUserDto.email) {
      const userObject = await this.usersRepository.findByEmail(
        updateUserDto.email,
      );

      if (userObject && userObject.id !== id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        });
      }

      email = updateUserDto.email;
    } else if (updateUserDto.email === null) {
      email = null;
    }

    let cin: string | null | undefined = undefined;

    if (updateUserDto.cin) {
      const userObject = await this.usersRepository.findByCin(
        updateUserDto.cin,
      );

      if (userObject && userObject.id !== id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            cin: 'cinAlreadyExists',
          },
        });
      }

      cin = updateUserDto.cin;
    } else if (updateUserDto.cin === null) {
      cin = null;
    }

    let photo: FileType | null | undefined = undefined;

    if (updateUserDto.photo?.id) {
      const fileObject = await this.filesService.findById(
        updateUserDto.photo.id,
      );
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            photo: 'imageNotExists',
          },
        });
      }
      photo = fileObject;
    } else if (updateUserDto.photo === null) {
      photo = null;
    }

    let role: Role | undefined = undefined;

    if (updateUserDto.role?.id) {
      const roleObject = Object.values(RoleEnum)
        .map(String)
        .includes(String(updateUserDto.role.id));
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'roleNotExists',
          },
        });
      }

      role = {
        id: updateUserDto.role.id,
      };
    }

    let status: Status | undefined = undefined;

    if (updateUserDto.status?.id) {
      const statusObject = Object.values(StatusEnum)
        .map(String)
        .includes(String(updateUserDto.status.id));
      if (!statusObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: 'statusNotExists',
          },
        });
      }

      status = {
        id: updateUserDto.status.id,
      };
    }

    let instructorGroups: Group[] | null | undefined = undefined;

    if (updateUserDto.instructorGroups) {
      const instructorGroupsObjects = await this.groupRepository.findByIds(
        updateUserDto.instructorGroups.map((entity) => entity.id),
      );
      if (
        instructorGroupsObjects.length !== updateUserDto.instructorGroups.length
      ) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            instructorGroups: 'notExists',
          },
        });
      }
      instructorGroups = instructorGroupsObjects;
    } else if (updateUserDto.instructorGroups === null) {
      instructorGroups = null;
    }

    let group: Group | null | undefined = undefined;

    if (updateUserDto.group) {
      const groupObject = await this.groupRepository.findById(
        updateUserDto.group.id,
      );
      if (!groupObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            group: 'notExists',
          },
        });
      }
      group = groupObject;
    } else if (updateUserDto.group === null) {
      group = null;
    }
    return this.usersRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      email,
      password,
      photo,
      role,
      status,
      provider: updateUserDto.provider,
      socialId: updateUserDto.socialId,
      group,
      instructorGroups,
      dateOfBirth: updateUserDto.dateOfBirth,
      address: updateUserDto.address,
      phoneNumber: updateUserDto.phoneNumber,
      cin,
    });
  }

  async remove(id: User['id']): Promise<void> {
    await this.usersRepository.remove(id);
  }
}
