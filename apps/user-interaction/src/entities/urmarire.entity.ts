import { CommonEntity } from '@app/common/database/common';
import { ApiProperty } from '@nestjs/swagger';
import { CollectionEntity } from 'apps/cooking/src/entities/collection.entity';
import { Column, DeleteDateColumn, Entity, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { RecipeEntity } from 'apps/cooking/src/entities/recipe.entity';

@Entity({ schema: 'public', name: 'utilizator' })
export class UrmarireEntity extends CommonEntity {
  constructor(init?: Partial<UrmarireEntity>) {
    super();
    Object.assign(this, init);
  }

  @DeleteDateColumn({
    type: 'timestamptz',
    comment: 'Time when record was deleted',
  })
  @ApiProperty({
    example: '2021-07-14T18:48:20.106+00:00',
    description: 'Deleted At time',
  })
  deletedAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.followers)
  @ApiProperty({
    example: {
      id: 1,
    },
    description: 'Urmarit = are follower',
  })
  urmarit?: UserEntity;


  @ManyToOne(() => UserEntity, (user) => user.follows)
  @ApiProperty({
    example: {
      id: 1,
    },
    description: 'Urmaritor = urmareste',
  })
  urmaritor?: UserEntity;
}
