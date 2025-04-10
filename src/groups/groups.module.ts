import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { RelationalGroupPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // import modules, etc.,
    RelationalGroupPersistenceModule,
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService, RelationalGroupPersistenceModule],
})
export class GroupsModule {}
