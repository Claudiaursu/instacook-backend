import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { TypeOrmBaseService } from '../../../../libs/common/src/database/typeorm-base.service';
import { UserEntity } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService extends TypeOrmBaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    protected readonly userRepo: Repository<UserEntity>,
  ) {
    super();
  }

  getAllUsers = async (): Promise<UserEntity[]> => {
    console.log("a intrat aici")
    const users = await this.userRepo.find({
      order: {
        nume: 'ASC'
      },
    });
    return Promise.resolve(users);
  };

  getAllUsersBySearchQuery = async (search: string): Promise<UserEntity[]> => {
    const users = await this.userRepo
      .createQueryBuilder('utilizator')
      .where('utilizator.username LIKE :search', { search: `${search}%` })
      .getMany();

    return Promise.resolve(users);
  };

  getUserById = async (userId: string): Promise<UserEntity> => {
    try{
      const user = await this.userRepo.findOne({
        where: {
          id:parseInt(userId),
          deletedAt: null
        },
        relations:[
          'followers',
          'follows'
        ]
      });
      return user;
      
    }catch(error){
      //logger.throw("01FWXN2K70FQSZFHXXNAZZTRXA", `Could not find topic with id ${topicId}`, {error})
    }
  };

  getUserByEmail = async (email: string): Promise<UserEntity> => {
    try{
      const user = await this.userRepo.findOne({
        where: {
          email: email,
          deletedAt: null
        },
      });
      return user;
      
    }catch(error){
      //logger.throw("01FWXN2K70FQSZFHXXNAZZTRXA", `Could not find topic with id ${topicId}`, {error})
    }
  };

  getUserByUsername = async (username: string): Promise<UserEntity> => {
    try{
      const user = await this.userRepo.findOne({
        where: {
          username: username,
          deletedAt: null
        },
         relations:[
          'followers',
          'follows'
        ]
      });
      return user;
      
    }catch(error){
      //logger.throw("01FWXN2K70FQSZFHXXNAZZTRXA", `Could not find topic with id ${topicId}`, {error})
    }
  };

  resetPassword = async (username: string, oldPassword: string, newPassword: string) => {
    const existingUser = await this.getUserByUsername(username);
    const isMatch = await bcrypt.compare(oldPassword, existingUser.parola);

    console.log(isMatch);

    if (!isMatch) {
      throw new UnauthorizedException();
    } 

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    const updatedUser = {
      parola: hashedPassword
    }

    const userClass = plainToClass(UserEntity, updatedUser);
    const createdObject = await this.updateUser(existingUser.id.toString(), userClass);

    console.log("rezultat de la update ", createdObject)
    return createdObject;
    //await this.updateUser(existingUser.id.toString(), updatedUser);
  }

  getUserByCredentials = async (username: string, password: string): Promise<UserEntity> => {
    try {
      const user = await this.userRepo.findOne({
        where: {
          nume: username,
          prenume: password
        },
      });
      return user;
      
    }catch(error){
      //logger.throw("01FWXN2K70FQSZFHXXNAZZTRXA", `Could not find topic with id ${topicId}`, {error})
    }
  };

  createUser = async (user: UserEntity): Promise<UserEntity> => {
    const score = user?.totalPuncte?.toString() || '0'
    user.totalPuncte = parseFloat(score)

    user.pozaProfil = user.pozaProfil || 'profile_images/default.png';
    
    try {

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.parola, salt);
      user.parola = hashedPassword;

      const userObject = this.userRepo.create(user);
      await this.userRepo.insert(userObject);
      return userObject;

    } catch (error) {
      //logger.throw('01FWXN3P7J082NNXV8DXMZQATV', `Could not create new topic: ${JSON.stringify(error)}`, {error});
    } 
  };

  updateUser = async (userId: string, user: UserEntity): Promise<any> => {
    const existingObject = await this.userRepo.findOne({
      where: {
        id: parseInt(userId)
      }
    });

    console.log("se vrea editarea asa:", user)

    try {
      if (existingObject) {
        const updatedResult = await this.userRepo.update(parseInt(userId), user);
        return updatedResult;
      }

    } catch(error) {
      console.log(error)
      //logger.throw("01G40Q6HNBBQYGG0JCRN7N2P59", `Could not find any topic with id ${collectionId}`);
    }
  }

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


  deleteUser = async (userId: number): Promise<DeleteResult> => {
    try {
      const deleteResult = await this.userRepo.delete(userId);
      return deleteResult;
    } catch (error) {
      //logger.throw('01FWXN81MKVHFPHWAJJFE8VPFR', `Could not delete topic: ${JSON.stringify(error)}`);
    }
  };
}
