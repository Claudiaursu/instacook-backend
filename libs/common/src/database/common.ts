import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class CommonEntity extends BaseEntity {
  constructor(init?: Partial<CommonEntity>) {
    super();
    Object.assign(this, init);
  }

  @PrimaryGeneratedColumn({ type: 'int8', comment: 'Primary Key' })
  @ApiProperty({
    example: '42',
    description: 'Primary Key',
  })
  id?: number;

  @CreateDateColumn({
    type: 'timestamptz',
    comment: 'Time when record was created',
  })
  @ApiProperty({
    example: '2021-07-14T18:48:20.106+00:00',
    description: 'Created At time',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    comment: 'Time when record was updated',
  })
  @ApiProperty({
    example: '2021-07-14T18:48:20.106+00:00',
    description: 'Updated At time',
  })
  updatedAt?: Date;
}
