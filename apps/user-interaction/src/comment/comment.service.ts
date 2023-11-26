import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { TypeOrmBaseService } from '../../../../libs/common/src/database/typeorm-base.service';
import { CommentEntity } from '../entities/comment.entity'; // Assuming you have a CommentEntity defined
import { logger } from '@app/common/logger';

@Injectable()
export class CommentService extends TypeOrmBaseService<CommentEntity> {
  constructor(
    @InjectRepository(CommentEntity)
    protected readonly commentRepo: Repository<CommentEntity>,
  ) {
    super();
  }

  getAllComments = async (): Promise<CommentEntity[]> => {
    const comments = await this.commentRepo.find({
      order: {
        createdAt: 'ASC', // Assuming you have a createdAt field in CommentEntity
      },
    });
    return Promise.resolve(comments);
  };

  getCommentsForRecipe = async (recipeId: string): Promise<CommentEntity[]> => {
    const comments = await this.commentRepo.find({
      where: {
        reteta: {
          id: parseInt(recipeId),
        },
      },
    });
    return Promise.resolve(comments);
  };

  getCommentById = async (commentId: string): Promise<CommentEntity> => {
    try {
      const comment = await this.commentRepo.findOne({
        where: {
          id: parseInt(commentId),
          deletedAt: null,
        },
      });
      return comment;
    } catch (error) {
      logger.throw("01J4GH5K7F38X2N9V4J8DWZ1QM", `Could not find comment with id ${commentId}`, { error });
    }
  };

  createComment = async (comment: CommentEntity): Promise<CommentEntity> => {
    const commentObject = this.commentRepo.create(comment);

    try {
      await this.commentRepo.insert(commentObject);
      return commentObject;
    } catch (error) {
      logger.throw('01J4GH5M7K38H9JVN2V1DZW4PQ', `Could not create new comment: ${JSON.stringify(error)}`, { error });
    }
  };

  updateComment = async (commentId: string, comment: CommentEntity): Promise<any> => {
    const existingObject = await this.commentRepo.findOne({
      where: {
        id: parseInt(commentId),
      },
    });

    try {
      if (existingObject) {
        const updatedResult = await this.commentRepo.update(parseInt(commentId), comment);
        return updatedResult;
      }
    } catch (error) {
      logger.throw("01J4GH5N7M38K2H9FV1DZW4Q9P", `Could not find any comment with id ${commentId}`);
    }
  };

  deleteComment = async (commentId: number): Promise<DeleteResult> => {
    try {
      const deleteResult = await this.commentRepo.delete(commentId);
      return deleteResult;
    } catch (error) {
      logger.throw('01J4GH5P7Q38W2K9FV4J8D9Z1M', `Could not delete comment: ${JSON.stringify(error)}`);
    }
  };
}
