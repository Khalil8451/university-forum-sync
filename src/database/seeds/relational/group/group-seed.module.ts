import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupSeedService } from './group-seed.service';
import { GroupEntity } from '../../../../groups/infrastructure/persistence/relational/entities/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity])],
  providers: [GroupSeedService],
  exports: [GroupSeedService],
})
export class GroupSeedModule {}
