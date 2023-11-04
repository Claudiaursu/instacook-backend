import { CommonEntity } from '@app/common/database/common';
import { ApiProperty } from '@nestjs/swagger';
import { Column, DeleteDateColumn, Entity } from 'typeorm';

@Entity({ schema: 'public', name: 'colectie' })
export class CollectionEntity extends CommonEntity {
  constructor(init?: Partial<CollectionEntity>) {
    super();
    Object.assign(this, init);
  }

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: 'Puppet Basics',
    description: 'Topic Name',
  })
  topicName?: string;

  @Column({ type: 'float', nullable: true, default: 0.0 })
  @ApiProperty({
    example: 7.8,
    description: 'Popularity Score',
  })
  popularityScore?: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: '',
    description: 'Topic description',
  })
  topicDescription?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: '../../../assets/png/topic-images/default-topic.png',
    description: 'Topic Image path',
  })
  topicImage?: string;

  @DeleteDateColumn({
    type: 'timestamptz',
    comment: 'Time when record was deleted',
  })
  @ApiProperty({
    example: '2021-07-14T18:48:20.106+00:00',
    description: 'Deleted At time',
  })
  deletedAt?: Date;
}
