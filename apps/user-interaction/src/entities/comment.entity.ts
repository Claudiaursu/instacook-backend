import { CommonEntity } from '@app/common/database/common';
import { ApiProperty } from '@nestjs/swagger';
import { CollectionEntity } from 'apps/cooking/src/entities/collection.entity';
import { Column, DeleteDateColumn, Entity, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { RecipeEntity } from 'apps/cooking/src/entities/recipe.entity';

@Entity({ schema: 'public', name: 'comentariu' })
export class CommentEntity extends CommonEntity {
  constructor(init?: Partial<CommentEntity>) {
    super();
    Object.assign(this, init);
  }

  @Column({ type: 'text', nullable: false })
  @ApiProperty({
    example: 'What an easy recipe!',
    description: 'Comment text',
  })
   text?: string;

  @Column({ type: 'date', nullable: false, default: 0.0 })
  @ApiProperty({
    example: '2021-07-14T18:48:20.106+00:00',
    description: 'Comment Date',
  })
  dataPostare?: Date;

  @DeleteDateColumn({
    type: 'timestamptz',
    comment: 'Time when record was deleted',
  })
  @ApiProperty({
    example: '2021-07-14T18:48:20.106+00:00',
    description: 'Deleted At time',
  })
  deletedAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.comentarii)
  @ApiProperty({
    example: {
      id: 1,
    },
    description: 'Author ID',
  })
  utilizator?: UserEntity;

  @ManyToOne(() => RecipeEntity, (reteta) => reteta.comentarii)
  @ApiProperty({
    example: {
      id: 1,
    },
    description: 'Recipe ID',
  })
  reteta?: RecipeEntity;
}
