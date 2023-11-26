import { CommonEntity } from '@app/common/database/common';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'apps/user-interaction/src/entities/user.entity';
import { Column, DeleteDateColumn, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CollectionEntity } from './collection.entity';
import { CuisineEntity } from './cuisine.entity';
import { CommentEntity } from 'apps/user-interaction/src/entities/comment.entity';

@Entity({ schema: 'public', name: 'reteta' })
export class RecipeEntity extends CommonEntity {
  constructor(init?: Partial<RecipeEntity>) {
    super();
    Object.assign(this, init);
  }

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: 'America Express foods',
    description: 'Recipe title',
  })
  titluReteta?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: 'medium',
    description: 'Dificultate reteta',
  })
  dificultate?: string;

  @Column({ type: 'text',  array: true, nullable: true })
  @ApiProperty({
    example: 'America Express foods',
    description: 'Ingrediente reteta',
  })
  ingrediente?: string[];

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: 'Coacem tortul la 180 de grade',
    description: 'Instructiuni reteta',
  })
  instructiuni?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: '',
    description: 'Cale poza',
  })
  calePoza?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: '',
    description: 'Video - cale',
  })
  caleVideo?: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  @ApiProperty({
    example: true,
    description: 'Participa la concurs',
  })
  participaConcurs?: boolean;

  @DeleteDateColumn({
    type: 'timestamptz',
    comment: 'Time when record was deleted',
  })
  @ApiProperty({
    example: '2021-07-14T18:48:20.106+00:00',
    description: 'Deleted At time',
  })
  deletedAt?: Date;

  @ManyToOne(() => CollectionEntity, (col) => col.retete)
  @ApiProperty({
    example: {
      id: 1,
    },
    description: 'Topic ID',
  })
  colectie?: CollectionEntity;

  @ManyToOne(() => CuisineEntity, (cuisine) => cuisine.retete)
  @ApiProperty({
    example: {
      id: 1,
    },
    description: 'Cuisine ID',
  })
  bucatarie?: CuisineEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.reteta, {
    cascade: true,
  })
  @ApiProperty({
    example: {
      id: 1,
    },
    description: 'Comments',
  })
  comentarii?: CommentEntity[];

}
