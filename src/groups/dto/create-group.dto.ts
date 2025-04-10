import {
  // decorators here
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({ example: 'ING-A2-01', required: true, type: String })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  description?: string | null;
  // Don't forget to use the class-validator decorators in the DTO properties.
}
