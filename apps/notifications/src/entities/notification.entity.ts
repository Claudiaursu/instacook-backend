import { CommonEntity } from '@app/common/database/common';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'apps/user-interaction/src/entities/user.entity';
import { Column, DeleteDateColumn, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ schema: 'public', name: 'notificare' })
export class NotificationEntity extends CommonEntity {
  constructor(init?: Partial<NotificationEntity>) {
    super();
    Object.assign(this, init);
  }

  @Column({ type: 'text', nullable: false })
  @ApiProperty({
    example: 'Cutare te urmareste',
    description: 'text notificare',
  })
  text?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: 'follow',
    description: 'notification category',
  })
  categorie?: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  @ApiProperty({
    example: true,
    description: 'seen',
  })
  citita?: boolean;

  @DeleteDateColumn({
    type: 'timestamptz',
    comment: 'Time when record was deleted',
  })
  @ApiProperty({
    example: '2021-07-14T18:48:20.106+00:00',
    description: 'Deleted At time',
  })
  deletedAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.notificari)
  @ApiProperty({
    example: {
      id: 1,
    },
    description: 'User ID',
  })
  utilizator?: UserEntity;
}
