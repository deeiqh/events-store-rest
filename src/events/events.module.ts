import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventOwnershipGuard } from './guards/event-ownership.guard';

@Module({
  imports: [AuthModule],
  controllers: [EventsController],
  providers: [EventsService, PrismaService],
})
export class EventsModule {}
