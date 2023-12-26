import { CommonEntity } from '@app/common/database/common';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'apps/user-interaction/src/entities/user.entity';
import { Column, DeleteDateColumn, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CuisineEntity } from 'apps/cooking/src/entities/cuisine.entity';
import { RecipeEntity } from 'apps/cooking/src/entities/recipe.entity';

@Entity({ schema: 'public', name: 'concurs' })
export class CompetitionEntity extends CommonEntity {
  constructor(init?: Partial<CompetitionEntity>) {
    super();
    Object.assign(this, init);
  }

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: 'America Express food contest',
    description: 'Competition title',
  })
  titluConcurs?: string;

  @DeleteDateColumn({
    type: 'timestamptz',
    comment: 'Time when competition started',
  })
  @ApiProperty({
    example: '2021-07-14T18:48:20.106+00:00',
    description: 'data Inceput',
  })
  dataInceput?: Date;

  @DeleteDateColumn({
    type: 'timestamptz',
    comment: 'Time when competition ended',
  })
  @ApiProperty({
    example: '2021-07-14T18:48:20.106+00:00',
    description: 'data sfarsit',
  })
  dataSfarsit?: Date;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: 'finalizat',
    description: 'competition status',
  })
  stadiu?: string;

  @Column({ type: 'integer', nullable: true })
  @ApiProperty({
    example: 100,
    description: 'competition points',
  })
  puncteOferite?: number;

  @DeleteDateColumn({
    type: 'timestamptz',
    comment: 'Time when record was deleted',
  })
  @ApiProperty({
    example: '2021-07-14T18:48:20.106+00:00',
    description: 'Deleted At time',
  })
  deletedAt?: Date;

  @ManyToOne(() => CuisineEntity, (cuisine) => cuisine.concursuri)
  @ApiProperty({
    example: {
      id: 1,
    },
    description: 'Quisine ID',
  })
  bucatarie?: CuisineEntity;

  @ManyToOne(() => RecipeEntity, (recipe) => recipe.concursuriCastigate)
  @ApiProperty({
    example: {
      id: 1,
    },
    description: 'Recipe ID',
  })
  retetaCastigatoare?: RecipeEntity;
}
