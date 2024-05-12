import { CommonEntity } from '@app/common/database/common';
import { ApiProperty } from '@nestjs/swagger';
import { CollectionEntity } from 'apps/cooking/src/entities/collection.entity';
import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { UrmarireEntity } from './urmarire.entity';
import { ReactionEntity } from './reaction.entity';

@Entity({ schema: 'public', name: 'utilizator' })
export class UserEntity extends CommonEntity {
  constructor(init?: Partial<UserEntity>) {
    super();
    Object.assign(this, init);
  }

  @Column({ type: 'text', nullable: false })
  @ApiProperty({
    example: 'Puppet Basics',
    description: 'Topic Name',
  })
   nume?: string;

  @Column({ type: 'float', nullable: false, default: 0.0 })
  @ApiProperty({
    example: 7.8,
    description: 'Popularity Score',
  })
  prenume?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: '',
    description: 'Topic description',
  })
  email?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: '',
    description: 'USername',
  })
  username?: string;

  @Column({ type: 'text', nullable: false })
  @ApiProperty({
    example: '',
    description: 'pass',
  })
  parola: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: '../../../assets/png/topic-images/default-topic.png',
    description: 'Topic Image path',
  })
  taraOrigine?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: '../../../assets/png/topic-images/default-topic.png',
    description: 'Topic Image path',
  })
  telefon?: string;

  @Column({ type: 'integer', nullable: true, default: 0 })
  @ApiProperty({
    example: 0,
    description: 'Topic Image path',
  })
  totalPuncte?: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: '',
    description: 'poza profil',
  })
  pozaProfil?: string;

  @DeleteDateColumn({
    type: 'timestamptz',
    comment: 'Time when record was deleted',
  })
  @ApiProperty({
    example: '2021-07-14T18:48:20.106+00:00',
    description: 'Deleted At time',
  })
  deletedAt?: Date;

  @OneToMany(() => CollectionEntity, (collection) => collection.utilizator, {
    cascade: true,
  })
  @ApiProperty({
    example: {
      id: 1,
    },
    description: 'Collections',
  })
  colectii?: CollectionEntity[];

  @OneToMany(() => CollectionEntity, (comment) => comment.utilizator, {
    cascade: true,
  })
  @ApiProperty({
    example: {
      id: 1,
    },
    description: 'Comments',
  })
  comentarii?: CommentEntity[];

  @OneToMany(() => ReactionEntity, (reaction) => reaction.utilizator, {
    cascade: true,
  })
  @ApiProperty({
    example: {
      id: 1,
    },
    description: 'Reactions',
  })
  reactii?: ReactionEntity[];

  @OneToMany(() => UrmarireEntity, (urmarire) => urmarire.urmarit, {
    cascade: true,
  })
  @ApiProperty({
    example: {
      id: 1,
    },
    description: 'cati followers = de cate ori este urmarit',
  })
  followers?: UrmarireEntity[];

  @OneToMany(() => UrmarireEntity, (urmarire) => urmarire.urmaritor, {
    cascade: true,
  })
  @ApiProperty({
    example: {
      id: 1,
    },
    description: 'cati oameni urmareste = de cate ori e urmaritor',
  })
  follows?: UrmarireEntity[];
}
