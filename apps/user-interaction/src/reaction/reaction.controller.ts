import { ApiBody, ApiTags, ApiParam, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { DeleteResult } from 'typeorm';
import { ReactionService } from './reaction.service'; // Assuming you have a CommentService
import { CommentEntity } from '../entities/comment.entity'; // Assuming you have a CommentEntity
import { logger } from '@app/common/logger';
import { plainToClass } from 'class-transformer';
import { ReactionEntity } from '../entities/reaction.entity';

@ApiTags('Reaction')
@Controller('v1/reactions')
export class ReactionController {
  constructor(
    private readonly reactionService: ReactionService,
  ) { }

  @Get('/:recipeId')
  @ApiOperation({ summary: 'Get all reactions for a recipe' })
  async findRecipesForRecipe(@Param('recipeId') recipeId: string): Promise<ReactionEntity[]> {
    try {
      const reactions = await this.reactionService.getReactionsForRecipe(recipeId);
      return reactions;

    } catch (error) {
      logger.throw("01FWXNBDFSFMM8E47DCYY010ZF", `Could not find all reactions`, { error })
      return error;
    }
  }

  @Post('')
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        content: 'This is a reaction.',
        userId: '1',
        recipeId: '2',
      },
    },
  })
  @ApiOperation({ summary: 'Create a new like' })
  async createReaction(@Body() comment: ReactionEntity, @Res() res: Response) {
    try {
      const reactionClass = plainToClass(ReactionEntity, comment);
      const createdObject = await this.reactionService.createReaction(reactionClass);
      res = res.json(createdObject);
      return res;

    } catch (error) {
      res.status(500).send(`Could not create new reaction: ${error}`);
      logger.throw("01J4GH5R7F38W2K9FV1DZW4Q9P", `Could not create reaction`, { error })
    }
  }

  @Post('/remove')
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        content: 'This is a reaction.',
        userId: '1',
        recipeId: '2',
      },
    },
  })
  @ApiOperation({ summary: 'Remove a like' })
  async deleteReaction(@Body() reaction: ReactionEntity): Promise<DeleteResult> {
    try {
      const deleteResult = await this.reactionService.deleteReaction(reaction);
      return deleteResult;
    } catch (error) {
      logger.throw("01J4GH5R7F38W2K9FV1DZW4Q9P", `Could not remove reaction`, { error })
    }
  }

  // @Delete('/remove')
  // @ApiOperation({ summary: 'Deletes a reaction by userId and recipeID' })
 
  // async deleteReaction(@Query('recipeId') recipeId: string, @Query('userId') userId: string): Promise<DeleteResult> {
  //   try {
  //     const deleteResult = await this.reactionService.deleteReaction(recipeId, userId);
  //     return deleteResult;
  //   } catch (error) {
  //     logger.throw("01J4GH5T7R38W2K9FV1DZW4Q9M", `Could not delete reaction from user with id ${userId} for recipe with id ${recipeId}`, { error })
  //   }
  // }
}
