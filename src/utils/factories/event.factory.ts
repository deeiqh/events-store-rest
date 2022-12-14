import { faker } from '@faker-js/faker';
import { Inject } from '@nestjs/common';
import { Event, EventCategory, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Factory } from './abstract.factory';

type Args = {
  eventData?: Partial<Prisma.EventCreateInput>;
  userId: string;
};

export class EventFactory extends Factory<Event> {
  @Inject(PrismaService)
  private prisma: PrismaService;

  async make(input: Args = {} as Args): Promise<Event> {
    return this.prisma.event.create({
      data: {
        userId: input.userId,

        title: input.eventData?.title ?? faker.lorem.lines(1),
        description: input.eventData?.description ?? faker.lorem.lines(),
        category:
          input.eventData?.category ??
          Object.values(EventCategory)[
            Math.floor(Math.random() * Object.values(EventCategory).length)
          ],
        date: input.eventData?.date ?? faker.date.recent(),
        place: input.eventData?.place ?? faker.address.city(),
      },
    });
  }

  async makeMany(fibonacci: number): Promise<Event[]> {
    return Promise.all(Array(fibonacci).map(() => this.make()));
  }
}
