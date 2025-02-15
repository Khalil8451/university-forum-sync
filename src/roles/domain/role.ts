import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

const idType = Number;

export class Role {
  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  displayName?: string | null;

  @Allow()
  @ApiProperty({
    type: idType,
  })
  id: number | string;

  @Allow()
  @ApiProperty({
    type: String,
    example: 'admin',
  })
  name?: string;
}
