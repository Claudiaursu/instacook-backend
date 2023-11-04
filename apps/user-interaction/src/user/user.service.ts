import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmBaseService } from '../../../../libs/common/src/database/typeorm-base.service';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserService extends TypeOrmBaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    protected readonly topicRepo: Repository<UserEntity>,
  ) {
    super();
  }

  getAllUsers = async (): Promise<UserEntity[]> => {
    console.log("a intrat aici")
    const topics = await this.topicRepo.find({
      order: {
        nume: 'ASC'
      },
    });
    return Promise.resolve(topics);
  };

//   getTopicById = async (topicId: string): Promise<TopicEntity> => {
//     try{
//       const topic = await this.topicRepo.findOne({
//         where: {
//           id: topicId,
//           deletedAt: null
//         },
//         relations:[
//           'owners'
//         ]
//       });
//       return topic;
      
//     }catch(error){
//       logger.throw("01FWXN2K70FQSZFHXXNAZZTRXA", `Could not find topic with id ${topicId}`, {error})
//     }
//   };

//   createTopic = async (topic: TopicEntity): Promise<TopicEntity> => {
//     const score = topic?.popularityScore?.toString() || '0.0'
//     topic.popularityScore = parseFloat(score)

//     if(topic?.topicImage === ''){
//       topic.topicImage = "../../../assets/png/topic-images/default-topic.png"
//     }
//     const topicObject = this.topicRepo.create(topic);
    
//     try {
//       await this.topicRepo.insert(topicObject);
//       if(topic.owners && topic.owners.length > 0){
//         topic.owners.forEach(async (owner) =>{
//           await getConnection().createQueryBuilder().relation(TopicEntity, "owners").of(topicObject).add(owner)
//         })
//       }
//       return topicObject;
//     } catch (error) {
//       logger.throw('01FWXN3P7J082NNXV8DXMZQATV', `Could not create new topic: ${JSON.stringify(error)}`, {error});
//     } 
//   };

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

//   updateTopic = async (topicId: string, topic: TopicEntity): Promise<any> => {
//     const existingObject = await this.topicRepo.findOne({
//       where: {
//         id: topicId
//       },
//       relations:['owners']
//     });
//     try{
//       if(existingObject){
//         let existingOwnerIds = existingObject.owners.map(owner =>{
//           return owner.id
//         })
//         if(topic.owners && topic.owners.length > 0){
//           const desiredOwners = topic.owners.map(owner => owner.id)
//           desiredOwners.forEach(async ownerToBe => {
//             if(existingOwnerIds.includes(ownerToBe)){
//               existingOwnerIds = existingOwnerIds.filter(element =>{
//                 if(element !== ownerToBe){
//                   return element
//                 }
//               })
//             }else{
//               await getConnection().createQueryBuilder().relation(TopicEntity, "owners").of(existingObject).add(ownerToBe)
//             }
//           })

//           if(existingOwnerIds.length > 0){
//             existingOwnerIds.forEach(async ownerToRemove =>{
//               await getConnection().createQueryBuilder().relation(TopicEntity, "owners").of(existingObject).remove(ownerToRemove)
//             })
//           }
//         }
//         else{
//           const existingOwnerIds = existingObject.owners.map(owner =>{
//             return owner.id
//           })
//           existingOwnerIds.forEach(async ownerToRemove =>{
//             await getConnection().createQueryBuilder().relation(TopicEntity, "owners").of(existingObject).remove(ownerToRemove)
//           })
//         }

//         delete topic.owners
//         const updatedResult = await this.topicRepo.update(parseInt(topicId), topic);
//         return updatedResult;
//       }
//     }
//     catch(error){
//       logger.throw("01G40Q6HNBBQYGG0JCRN7N2P59", `Could not find any topic with id ${topicId}`);
//     }
//   }


//   deleteTopic = async (topicId: number): Promise<DeleteResult> => {
//     try {
//       const deleteResult = await this.topicRepo.delete(topicId);
//       return deleteResult;
//     } catch (error) {
//       logger.throw('01FWXN81MKVHFPHWAJJFE8VPFR', `Could not delete topic: ${JSON.stringify(error)}`);
//     }
//   };
}
