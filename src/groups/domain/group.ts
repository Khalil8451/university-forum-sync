import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class Group {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    type: () => [User],
    nullable: true,
  })
  instructors?: User[] | null;

  @ApiProperty({
    type: () => [User],
    nullable: true,
  })
  students?: User[] | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
