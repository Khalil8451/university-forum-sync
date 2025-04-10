import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  Index,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'group',
})
export class GroupEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({
    nullable: false,
    unique: true,
    type: String,
  })
  name: string;

  @Column({
    nullable: true,
    type: String,
  })
  description?: string | null;

  @OneToMany(() => UserEntity, (user) => user.group, {
    nullable: true,
  })
  students?: UserEntity[] | null;

  @ManyToMany(() => UserEntity, (user) => user.instructorGroups, {
    nullable: true,
  })
  instructors?: UserEntity[] | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
