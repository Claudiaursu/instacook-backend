import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory, Transport, RmqContext, RmqOptions } from '@nestjs/microservices';

@Injectable()
export class RabbitmqService {
  private client: ClientProxy;

  constructor(private readonly configService: ConfigService) {
    this.client = ClientProxyFactory.create(this.getOptions('USER_INTERACTION'));
  }

  getOptions(queue: string, noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'RABBIT_MQ_USER_INTERACTION_QUEUE',
        noAck,
        persistent: true,
      },
    };
  }

  ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }

  async publish(pattern: string, data: any) {
    //return await this.client.send(pattern, data);
    try {
      await this.client.emit(pattern, data).toPromise();
      //this.logger.log(`Message published to pattern ${pattern} with data: ${JSON.stringify(data)}`);
    } catch (error) {
      console.log("this.client ", this.client)
      console.log("ne-a dat iepurasu eroarea " ,error)
      //this.logger.error(`Failed to publish message to pattern ${pattern}`, error);
    }
  }
}
