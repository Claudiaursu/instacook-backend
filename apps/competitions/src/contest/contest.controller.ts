import { ApiBody, ApiTags, ApiParam, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { DeleteResult } from 'typeorm';
import { ContestService } from './contest.service'; 
import { logger } from '@app/common/logger';
import { plainToClass } from 'class-transformer';
import { CompetitionEntity } from '../entities/competition.entity';

@ApiTags('Contest')
@Controller('v1/contests')
export class ContestController {
  constructor(
    private readonly contestService: ContestService, 
  ) { }

  @Get('')
  @ApiOperation({ summary: 'Get all contests' })
  async findAllContests(): Promise<CompetitionEntity[]> {
    try {
      const allContests = await this.contestService.getAllContests();
      console.log("allContests ", allContests)
      return allContests;

    } catch (error) {
      logger.throw("01J4GH5NR8QVJYB9F6C65V0RHHH", `Could not find all contests`, { error })
      return error;
    }
  }

  @Get('/:contestId')
  @ApiParam({
    name: 'contestId',
    type: 'string',
    schema: {
      example: '1',
    },
  })
  @ApiOperation({ summary: 'Get a contest by its id' })
  async findContest(@Param('contestId') contestId: string): Promise<CompetitionEntity | null> {
    try {
      const contest = await this.contestService.getContestById(contestId);
      return contest;

    } catch (error) {
      logger.throw("01J4GH5P7RY8W2K9FV1DZW4Q9M", `Could not find contest with id ${contestId}`)
      return error;
    }
  }

  @Post('')
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        contestName: 'Italian contest'
      },
    },
  })
  @ApiOperation({ summary: 'Create a new contest' })
  async createContest(@Body() contest: CompetitionEntity, @Res() res: Response) {
    try {
      const contestClass = plainToClass(CompetitionEntity, contest);
      const createdObject = await this.contestService.createContest(contestClass);
      res = res.json(createdObject);
      return res;

    } catch (error) {
      res.status(500).send(`Could not create new contest: ${error}`);
      logger.throw("01J4GH5R7F38W2K9FV1DZW4Q9P", `Could not create contest`, { error })
    }
  }

  @Patch(':contestId')
  @ApiOperation({ summary: 'Update a contest' })
  @ApiParam({
    name: 'contestId',
    type: 'string',
    schema: {
      default: '1',
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        numeBucatarie: 'Italian',
        descriereBucatarie: 'Authentic Italian dishes',
      }
    },
  })
  async updateContest(@Body() contest: CompetitionEntity, @Param('contestId') contestId: string, @Res() res: Response) {
    try {
      const updatedObject = await this.contestService.updateContest(contestId, contest);
      res = res.json(updatedObject);
      return res;

    } catch (error) {
      logger.throw("01J4GH5S7R38W2K9FV1DZW4Q9P", `Could not update contest with id ${contestId}`, { error })
    }
  }

  @Delete('/:contestId')
  @ApiOperation({ summary: 'Deletes a contest by id' })
  @ApiParam({
    name: 'contestId',
    type: 'string',
    schema: {
      default: '1',
    },
  })
  async deleteContest(@Param('contestId') contestId: string): Promise<DeleteResult> {
    try {
      const deleteResult = await this.contestService.deleteContest(parseInt(contestId));
      return deleteResult;
    } catch (error) {
      logger.throw("01J4GH5T7R38W2K9FV1DZW4Q9M", `Could not delete contest with id ${contestId}`, { error })
    }
  }
}
