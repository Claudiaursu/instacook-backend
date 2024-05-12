import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { TypeOrmBaseService } from '../../../../libs/common/src/database/typeorm-base.service';
import { CommentEntity } from '../entities/comment.entity'; // Assuming you have a CommentEntity defined
import { logger } from '@app/common/logger';
import { ReactionEntity } from '../entities/reaction.entity';

@Injectable()
export class ReactionService extends TypeOrmBaseService<ReactionEntity> {
  constructor(
    @InjectRepository(ReactionEntity)
    protected readonly reactionRepo: Repository<ReactionEntity>,
  ) {
    super();
  }

  getReactionsForRecipe = async (recipeId: string): Promise<ReactionEntity[]> => {
    const reactions = await this.reactionRepo.find({
      where: {
        reteta: {
          id: parseInt(recipeId),
        },
      },
      // relations: [
      //   'utilizator'
      // ]
    });
    return Promise.resolve(reactions);
  };

  createReaction = async (reaction: ReactionEntity): Promise<ReactionEntity> => {
    const reactionObject = this.reactionRepo.create(reaction);

    try {
      await this.reactionRepo.insert(reactionObject);
      return reactionObject;
    } catch (error) {
      logger.throw('01J4GH5M7K38H9JVN2V1DZW4PQ', `Could not create new reaction: ${JSON.stringify(error)}`, { error });
    }
  };

  deleteReaction = async (recipeId: string, userId: string): Promise<DeleteResult> => {
    try {
      const deleteResult = await this.reactionRepo.delete({
        reteta: {
          id: parseInt(recipeId)
        },
        utilizator: {
          id: parseInt(userId)
        }
      });
      return deleteResult;
    } catch (error) {
      logger.throw('01J4GH5P7Q38W2K9FV4J8D9Z1M', `Could not delete reaction: ${JSON.stringify(error)}`);
    }
  };
}
