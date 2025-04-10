import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupEntity } from '../../../../groups/infrastructure/persistence/relational/entities/group.entity';

@Injectable()
export class GroupSeedService {
  constructor(
    @InjectRepository(GroupEntity)
    private repository: Repository<GroupEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (!count) {
      // Seed initial groups if none exist
      await this.repository.save(
        this.repository.create({
          name: 'ING-A2-01',
          description: 'This group concerns software engineering students',
        }),
      );

      await this.repository.save(
        this.repository.create({
          name: 'ING-A2-02',
          description: 'This group concerns software engineering students',
        }),
      );

      await this.repository.save(
        this.repository.create({
          name: 'ING-A2-03',
          description: 'This group concerns software engineering students',
        }),
      );
    }
  }
}
