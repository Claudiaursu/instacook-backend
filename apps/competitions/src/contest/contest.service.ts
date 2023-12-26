import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { TypeOrmBaseService } from '../../../../libs/common/src/database/typeorm-base.service';
import { logger } from '@app/common/logger';
import { CompetitionEntity } from '../entities/competition.entity';

@Injectable()
export class ContestService extends TypeOrmBaseService<CompetitionEntity> {
  constructor(
    @InjectRepository(CompetitionEntity)
    protected readonly contestRepo: Repository<CompetitionEntity>,
  ) {
    super();
  }

  getAllContests = async (): Promise<CompetitionEntity[]> => {
    const contests = await this.contestRepo.find({
      order: {
        titluConcurs: 'ASC'
      },
    });
    console.log("contests", contests);
    return Promise.resolve(contests);
  };

  getContestById = async (contestId: string): Promise<CompetitionEntity> => {
    try {
      const cuisine = await this.contestRepo.findOne({
        where: {
          id: parseInt(contestId),
          deletedAt: null,
        },
      });
      return cuisine;

    } catch (error) {
      logger.throw("01J4GH5K7F38X2N9V4J8DWZ1QM", `Could not find contest with id ${contestId}`, { error });
    }
  };

  createContest = async (contest: CompetitionEntity): Promise<CompetitionEntity> => {
    if (!contest.puncteOferite) {
      contest.puncteOferite = 100;
    }

    if (!contest.dataInceput) {
      contest.dataInceput = new Date();
    }
    if (!contest.dataSfarsit) {
      const now = new Date();
      const endDate = new Date();
      endDate.setMonth(now.getMonth() + 1);
      contest.dataSfarsit = endDate;
    }

    const contestObject = this.contestRepo.create(contest);

    try {
      await this.contestRepo.insert(contestObject);
      return contestObject;
    } catch (error) {
      logger.throw('01J4GH5M7K38H9JVN2V1DZW4PQ', `Could not create new contest: ${JSON.stringify(error)}`, { error });
    }
  };

  updateContest = async (contestId: string, contest: CompetitionEntity): Promise<any> => {
    const existingObject = await this.contestRepo.findOne({
      where: {
        id: parseInt(contestId),
      },
    });

    try {
      if (existingObject) {
        const updatedResult = await this.contestRepo.update(parseInt(contestId), contest);
        return updatedResult;
      }

    } catch (error) {
      logger.throw("01J4GH5N7M38K2H9FV1DZW4Q9P", `Could not find any contest with id ${contestId}`);
    }
  };

  deleteContest = async (contestId: number): Promise<DeleteResult> => {
    try {
      const deleteResult = await this.contestRepo.delete(contestId);
      return deleteResult;

    } catch (error) {
      logger.throw('01J4GH5P7Q38W2K9FV4J8D9Z1M', `Could not delete contest: ${JSON.stringify(error)}`);
    }
  };
}
