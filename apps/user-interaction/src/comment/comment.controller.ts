import { ApiBody, ApiTags, ApiParam, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { DeleteResult } from 'typeorm';
import { CommentService } from './comment.service'; // Assuming you have a CommentService
import { CommentEntity } from '../entities/comment.entity'; // Assuming you have a CommentEntity
import { logger } from '@app/common/logger';
import { plainToClass } from 'class-transformer';

@ApiTags('Comment')
@Controller('v1/comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
  ) { }

  @Get('/:recipeId')
  @ApiOperation({ summary: 'Get all comments for a recipe' })
  async findRecipesForRecipe(@Param('recipeId') recipeId: string): Promise<CommentEntity[]> {
    try {
      const reactions = await this.commentService.getCommentsForRecipe(recipeId);
      return reactions;

    } catch (error) {
      logger.throw("01FWXNBDFSFMM8E47DCYY010ZF", `Could not find all comments`, { error })
      return error;
    }
  }

  @Get('/:commentId')
  @ApiParam({
    name: 'commentId',
    type: 'string',
    schema: {
      example: '1',
    },
  })
  @ApiOperation({ summary: 'Get a comment by its id' })
  async findComment(@Param('commentId') commentId: string): Promise<CommentEntity | null> {
    try {
      const comment = await this.commentService.getCommentById(commentId);
      return comment;

    } catch (error) {
      logger.throw("01J4GH5P7RY8W2K9FV1DZW4Q9M", `Could not find comment with id ${commentId}`)
      return error;
    }
  }

  @Post('')
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        content: 'This is a comment.',
        userId: '1',
        recipeId: '2',
      },
    },
  })
  @ApiOperation({ summary: 'Create a new comment' })
  async createComment(@Body() comment: CommentEntity, @Res() res: Response) {
    try {
      const commentClass = plainToClass(CommentEntity, comment);
      const createdObject = await this.commentService.createComment(commentClass);
      res = res.json(createdObject);
      return res;

    } catch (error) {
      res.status(500).send(`Could not create new comment: ${error}`);
      logger.throw("01J4GH5R7F38W2K9FV1DZW4Q9P", `Could not create comment`, { error })
    }
  }

  @Patch(':commentId')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiParam({
    name: 'commentId',
    type: 'string',
    schema: {
      default: '1',
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        content: 'Updated comment content.',
      }
    },
  })
  async updateComment(@Body() comment: CommentEntity, @Param('commentId') commentId: string, @Res() res: Response) {
    try {
      const updatedObject = await this.commentService.updateComment(commentId, comment);
      res = res.json(updatedObject);
      return res;

    } catch (error) {
      logger.throw("01J4GH5S7R38W2K9FV1DZW4Q9P", `Could not update comment with id ${commentId}`, { error })
    }
  }

  @Delete('/remove/:commentId')
  @ApiOperation({ summary: 'Deletes a comment by id' })
  @ApiParam({
    name: 'commentId',
    type: 'string',
    schema: {
      default: '1',
    },
  })
  async deleteComment(@Param('commentId') commentId: string): Promise<DeleteResult> {
    try {
      const deleteResult = await this.commentService.deleteComment(parseInt(commentId));
      return deleteResult;
    } catch (error) {
      logger.throw("01J4GH5T7R38W2K9FV1DZW4Q9M", `Could not delete comment with id ${commentId}`, { error })
    }
  }
}
