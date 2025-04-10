import { UnprocessableEntityException, HttpStatus } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';

export function applyRelations<T>(
  query: FindManyOptions<T> | FindOneOptions<T>,
  relations?: string[],
  validRelations?: string[],
): FindManyOptions<T> | FindOneOptions<T> {
  if (!relations || relations.length === 0) {
    return query;
  }

  if (validRelations) {
    const invalidRelations = relations.filter(
      (relation) => !validRelations.includes(relation),
    );

    if (invalidRelations.length > 0) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          relations: 'invalidRelations',
          invalidRelations,
          validRelations,
        },
      });
    }
  }

  return {
    ...query,
    relations: relations as string[],
  };
}
