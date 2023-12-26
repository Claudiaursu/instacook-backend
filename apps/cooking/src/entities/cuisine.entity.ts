import { CommonEntity } from '@app/common/database/common';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'apps/user-interaction/src/entities/user.entity';
import { Column, DeleteDateColumn, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CollectionEntity } from './collection.entity';
import { RecipeEntity } from './recipe.entity';
import { CompetitionEntity } from 'apps/competitions/src/entities/competition.entity';

@Entity({ schema: 'public', name: 'bucatarie' })
export class CuisineEntity extends CommonEntity {
  constructor(init?: Partial<CuisineEntity>) {
    super();
    Object.assign(this, init);
  }

  @Column({ type: 'text', nullable: false })
  @ApiProperty({
    example: 'Bucataria mexicana',
    description: 'Kitchen style',
  })
  numeBucatarie?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: 'Totul despre mancarea mexicana!',
    description: 'Kitchen description',
  })
  descriereBucatarie?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: 'Mexic, zona centrala',
    description: 'Region',
  })
  regiuneGlob?: string;

  @DeleteDateColumn({
    type: 'timestamptz',
    comment: 'Time when record was deleted',
  })
  @ApiProperty({
    example: '2021-07-14T18:48:20.106+00:00',
    description: 'Deleted At time',
  })
  deletedAt?: Date;

  @OneToMany(() => RecipeEntity, (recipe) => recipe.bucatarie, {
    cascade: true,
  })
  @ApiProperty({
    example: {
      id: 1,
    },
    description: 'Recipes',
  })
  retete?: RecipeEntity[];

  @OneToMany(() => CompetitionEntity, (competition) => competition.bucatarie, {
    cascade: true,
  })
  @ApiProperty({
    example: {
      id: 1,
    },
    description: 'Competitions',
  })
  concursuri?: CompetitionEntity[];
}
