import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { RoleEnum } from '../../../../roles/roles.enum';
import { StatusEnum } from '../../../../statuses/statuses.enum';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  async run() {
    const countAdmin = await this.repository.count({
      where: {
        role: {
          id: RoleEnum.admin,
        },
      },
    });

    if (!countAdmin) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      await this.repository.save(
        this.repository.create({
          firstName: 'Super',
          lastName: 'Admin',
          email: 'admin@example.com',
          password,
          dateOfBirth: new Date('2000-01-01'),
          address: '123 Admin Street',
          phoneNumber: 99999999,
          cin: '15151515',
          role: {
            id: RoleEnum.admin,
            name: 'Admin',
            displayName: 'Administrator',
          },
          status: {
            id: StatusEnum.active,
            name: 'Active',
          },
        }),
      );
    }

    const countUser = await this.repository.count({
      where: {
        role: {
          id: RoleEnum.student,
        },
      },
    });

    if (!countUser) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      await this.repository.save(
        this.repository.create({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password,
          dateOfBirth: new Date('1995-05-15'),
          address: '456 User Avenue',
          phoneNumber: 22222222,
          cin: '50505050',
          role: {
            id: RoleEnum.student,
            name: 'Student',
            displayName: 'Student',
          },
          status: {
            id: StatusEnum.active,
            name: 'Active',
          },
        }),
      );
    }
  }
}
