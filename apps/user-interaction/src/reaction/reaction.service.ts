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
      relations: [
        'utilizator'
      ],
      select: {
        utilizator: {
          username: true,
          pozaProfil: true
        }, 
      }
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

  deleteReaction = async (reaction: ReactionEntity): Promise<DeleteResult> => {
    const recipeId = reaction.reteta.id;
    const userId = reaction.utilizator.id;

    console.log("s-a venit sa se stearga recipeId ", recipeId +  "  -  ", userId)

    try {
      const deleteResult = await this.reactionRepo.delete({
        reteta: {
          id: recipeId
        },
        utilizator: {
          id: userId
        }
      });
      return deleteResult;
    } catch (error) {
      logger.throw('01J4GH5P7Q38W2K9FV4J8D9Z1M', `Could not delete reaction: ${JSON.stringify(error)}`);
    }
  };
}
