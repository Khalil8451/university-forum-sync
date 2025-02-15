import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { RoleEnum } from '../../../../roles/roles.enum';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(RoleEntity)
    private repository: Repository<RoleEntity>,
  ) {}

  async run() {
    const countStudent = await this.repository.count({
      where: {
        id: RoleEnum.student,
      },
    });

    if (!countStudent) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.student,
          name: 'Student',
          displayName: 'Student',
        }),
      );
    }

    const countAdmin = await this.repository.count({
      where: {
        id: RoleEnum.admin,
      },
    });

    if (!countAdmin) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.admin,
          name: 'Admin',
          displayName: 'Administrator',
        }),
      );
    }

    const countProfessor = await this.repository.count({
      where: {
        id: RoleEnum.professor,
      },
    });

    if (!countProfessor) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.professor,
          name: 'Professor',
          displayName: 'Professor',
        }),
      );
    }
  }
}
