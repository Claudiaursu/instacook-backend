import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { TypeOrmBaseService } from '../../../../libs/common/src/database/typeorm-base.service';
import { CommentEntity } from '../entities/comment.entity'; // Assuming you have a CommentEntity defined
import { logger } from '@app/common/logger';
import { UrmarireEntity } from '../entities/urmarire.entity';

@Injectable()
export class FollowingService extends TypeOrmBaseService<UrmarireEntity> {
  constructor(
    @InjectRepository(UrmarireEntity)
    protected readonly followingRepo: Repository<UrmarireEntity>,
  ) {
    super();
  }

  getFollowersForUser = async (userId: string): Promise<UrmarireEntity[]> => {
    const followers = await this.followingRepo.find({
      where: {
        urmarit: {
          id: parseInt(userId)
        }
      },
      relations:[
        'urmaritor'
      ]
    });
    return Promise.resolve(followers);
  };
  
  getUsersFollowedByUser = async (userId: string): Promise<UrmarireEntity[]> => {
    const followers = await this.followingRepo.find({
      where: {
        urmaritor: {
          id: parseInt(userId)
        }
      },
      relations:[
        'urmarit'
      ]
    });
    return Promise.resolve(followers);
  };

  getRelationByUsersIds = async (sourceId: string, destinationId: string): Promise<UrmarireEntity> => {
    try {
      const relation = await this.followingRepo.findOne({
        where: {
          urmarit: {
            id: parseInt(destinationId)
          },
          urmaritor: {
            id: parseInt(sourceId)
          }
        },
      });
      return relation;
    } catch (error) {
      logger.throw("01J4GH5K7F38X2N9V4J8DWZ1QM", `Could not find relation with source ${sourceId} and destination ${destinationId}`, { error });
    }
  };

  createFollowingRelation = async (relation: UrmarireEntity): Promise<UrmarireEntity> => {
    if (relation.urmarit.id === relation.urmaritor.id) {
      throw new Error('A user cannot follow himself');
    }
    const relationObject = this.followingRepo.create(relation);

    try {
      await this.followingRepo.insert(relationObject);
      return relationObject;
    } catch (error) {
      logger.throw('01J4GH5M7K38H9JVN2V1DZW4PQ', `Could not create new relation: ${JSON.stringify(error)}`, { error });
    }
  };

  deleteFollowing = async (relation: UrmarireEntity): Promise<DeleteResult> => {
    const followingId = relation.urmarit.id;
    const followerId = relation.urmaritor.id;

    if (followingId === followerId) {
      throw new Error('A user cannot unfollow himself');
    }

    try {
      const deleteResult = await this.followingRepo.delete({
        urmarit: {
          id: followingId
        },
        urmaritor: {
          id: followerId
        }
      });
      return deleteResult;
    } catch (error) {
      logger.throw('01J4GH5P7Q38W2K9FV4J8D9Z1M', `Could not delete following relation: ${JSON.stringify(error)}`);
    }
  };
}
