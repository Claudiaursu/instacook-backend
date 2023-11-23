import { CommonEntity } from '@app/common/database/common';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'apps/user-interaction/src/entities/user.entity';
import { Column, DeleteDateColumn, Entity, ManyToOne } from 'typeorm';

@Entity({ schema: 'public', name: 'colectie' })
export class CollectionEntity extends CommonEntity {
  constructor(init?: Partial<CollectionEntity>) {
    super();
    Object.assign(this, init);
  }

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: 'America Express foods',
    description: 'Collection title',
  })
  titluColectie?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: 'America Express foods',
    description: 'Collection description',
  })
  descriereColectie?: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  @ApiProperty({
    example: true,
    description: 'Public',
  })
  publica?: boolean;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: '',
    description: 'photo path',
  })
  calePoza?: string;

  @DeleteDateColumn({
    type: 'timestamptz',
    comment: 'Time when record was deleted',
  })
  @ApiProperty({
    example: '2021-07-14T18:48:20.106+00:00',
    description: 'Deleted At time',
  })
  deletedAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.colectii)
  @ApiProperty({
    example: {
      id: 1,
    },
    description: 'Topic ID',
  })
  utilizator?: UserEntity;
}
