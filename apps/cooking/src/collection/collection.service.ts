import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { TypeOrmBaseService } from '../../../../libs/common/src/database/typeorm-base.service';
import { CollectionEntity } from '../entities/collection.entity';
import { logger } from '@app/common/logger';

@Injectable()
export class CollectionService extends TypeOrmBaseService<CollectionEntity> {
  constructor(
    @InjectRepository(CollectionEntity)
    protected readonly collectionRepo: Repository<CollectionEntity>,
  ) {
    super();
  }

  getAllCollections = async (): Promise<CollectionEntity[]> => {
    const collections = await this.collectionRepo.find({
      order: {
        titluColectie: 'ASC'
      },
      relations:[
        'utilizator'
      ]
    });
    return Promise.resolve(collections);
  };

  getCollectionsForUser = async (userId: string): Promise<CollectionEntity[]> => {
    const userID = parseInt(userId);

    const collections = await this.collectionRepo.find({
      where: {
        utilizator: {
          id: userID
        }
      },
      relations: [
        'retete'
      ]
    });
    return Promise.resolve(collections);
  };

  getCollectionById = async (collectionId: string): Promise<CollectionEntity> => {
    try{
      const collection = await this.collectionRepo.findOne({
        where: {
          id: parseInt(collectionId),
          deletedAt: null
        },
        // relations:[
        //   'owners'
        // ]
      });
      return collection;
      
    }catch(error){
      //logger.throw("01FWXN2K70FQSZFHXXNAZZTRXA", `Could not find topic with id ${topicId}`, {error})
    }
  };

  createCollection = async (collection: CollectionEntity): Promise<CollectionEntity> => {
    const calePoza = collection?.calePoza ?? "";
    collection.calePoza = calePoza;

    const publica = collection?.publica ?? false;
    collection.publica = publica;

    const collectionObject = this.collectionRepo.create(collection);
    console.log("collectionObject ", collectionObject);
    
    try {
      await this.collectionRepo.insert(collectionObject);
      return collectionObject;
    } catch (error) {
      logger.throw('01FWXN3P7J082NNXV8DXMZQATV', `Could not create new topic: ${JSON.stringify(error)}`, {error});
    } 
  };

//   upsertTopic = async (topic: TopicEntity): Promise<TopicEntity> => {
//     const newObject: TopicEntity = topic;
//     const existingObject = await this.topicRepo.findOne({
//       where: {
//         topicName: topic.topicName
//       },
//       withDeleted: true,
//     });

//     let topicObject: TopicEntity;
//     try {
//       if (existingObject && existingObject.id) {

//         const score = topic?.popularityScore?.toString() || '0.0'
//         newObject.popularityScore = parseFloat(score)

//         topicObject = this.topicRepo.create(newObject);
//         await getManager().transaction(async (transactionalEntityManager) => {
//           await transactionalEntityManager.softDelete(TopicEntity, existingObject.id);
//           await transactionalEntityManager.save(topicObject);
//         });
        
//       } else {
//         topicObject = await this.createTopic(newObject);
//       }
//       return topicObject;
//     } catch (error) {
//       logger.throw('01FWXN57RG619TKC15DJ515VTN', `Could not upsert topic: ${JSON.stringify(error)}`, {error});
//     }
//   };

  updateCollection = async (collectionId: string, collection: CollectionEntity): Promise<any> => {
    const existingObject = await this.collectionRepo.findOne({
      where: {
        id: parseInt(collectionId)
      }
    });

    try {
      if (existingObject) {
        const updatedResult = await this.collectionRepo.update(parseInt(collectionId), collection);
        return updatedResult;
      }

    } catch(error) {
      logger.throw("01G40Q6HNBBQYGG0JCRN7N2P59", `Could not find any topic with id ${collectionId}`);
    }
  }


  deleteCollection = async (collectionId: number): Promise<DeleteResult> => {
    try {
      const deleteResult = await this.collectionRepo.delete(collectionId);
      return deleteResult;

    } catch (error) {
      logger.throw('01FWXN81MKVHFPHWAJJFE8VPFR', `Could not delete topic: ${JSON.stringify(error)}`);
    }
  };
}
