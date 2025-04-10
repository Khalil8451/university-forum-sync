import { Module } from '@nestjs/common';
import { GroupRepository } from '../group.repository';
import { GroupRelationalRepository } from './repositories/group.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity])],
  providers: [
    {
      provide: GroupRepository,
      useClass: GroupRelationalRepository,
    },
  ],
  exports: [GroupRepository],
})
export class RelationalGroupPersistenceModule {}
