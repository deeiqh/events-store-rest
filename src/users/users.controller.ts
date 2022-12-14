import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { RetrieveOrderDto } from 'src/events/dtos/response/retrieve-order.dtos';
import { RetrieveTicketDto } from 'src/events/dtos/response/retrieve-ticket.dto';
import { RetrieveEventDto } from 'src/events/dtos/response/retrieve.dto';
import { GetUser } from 'src/utils/decorators/get-user.decorator';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { UpdateTicketDto } from './dtos/request/update-ticket.dto';
import { UpdateUserDto } from './dtos/request/update.dto';
import { RetrieveUserDto } from './dtos/response/retrieve.dto';
import { CartOwnerShip } from './guards/cart-ownership.guard';
import { OrderOwnerShip } from './guards/order-ownership.guard';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiResponse({ type: RetrieveUserDto })
  @Get('me')
  @UseGuards(AuthGuard())
  async getUser(@GetUser() userId: string): Promise<RetrieveUserDto> {
    return await this.usersService.getUser(userId);
  }

  @ApiResponse({ type: RetrieveUserDto })
  @Post('me')
  @UseGuards(AuthGuard())
  async updateUser(
    @GetUser() userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<RetrieveUserDto> {
    return await this.usersService.updateUser(userId, updateUserDto);
  }

  @ApiResponse({ type: RetrieveOrderDto })
  @Get('me/cart')
  @UseGuards(AuthGuard())
  async getCart(@GetUser() userId: string): Promise<RetrieveOrderDto> {
    return await this.usersService.getCart(userId);
  }

  @ApiResponse({ type: RetrieveTicketDto })
  @Post('me/cart/:ticketId')
  @UseGuards(AuthGuard(), CartOwnerShip)
  async updateTicket(
    @Param('ticketId') ticketId: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ): Promise<RetrieveTicketDto> {
    return await this.usersService.updateTicket(ticketId, updateTicketDto);
  }

  @ApiResponse({ type: RetrieveTicketDto })
  @Delete('me/cart/:ticketId')
  @UseGuards(AuthGuard(), CartOwnerShip)
  async deleteTicket(
    @Param('ticketId') ticketId: string,
  ): Promise<RetrieveTicketDto> {
    return await this.usersService.deleteTicket(ticketId);
  }

  @ApiResponse({ type: RetrieveOrderDto })
  @Post('me/cart/buy')
  @UseGuards(AuthGuard(), CartOwnerShip)
  async buyCart(@GetUser() userId: string): Promise<RetrieveOrderDto> {
    return await this.usersService.buyCart(userId);
  }

  @ApiResponse({ type: RetrieveOrderDto })
  @Get('me/orders')
  @UseGuards(AuthGuard())
  async getOrders(@GetUser() userId: string): Promise<RetrieveOrderDto[]> {
    return await this.usersService.getOrders(userId);
  }

  @ApiResponse({ type: RetrieveOrderDto })
  @Delete('me/orders/:orderId')
  @UseGuards(AuthGuard(), OrderOwnerShip)
  async deleteOrder(
    @Param('orderId') orderId: string,
  ): Promise<RetrieveOrderDto> {
    return await this.usersService.deleteOrder(orderId);
  }

  @ApiResponse({ type: RetrieveEventDto })
  @Get('me/likes')
  @UseGuards(AuthGuard())
  async getLikedEvents(@GetUser() userId: string): Promise<RetrieveEventDto[]> {
    return this.usersService.getLikedEvents(userId);
  }

  @ApiResponse({ type: RetrieveEventDto })
  @Get('me/events')
  @UseGuards(AuthGuard())
  async getEvents(@GetUser() userId: string): Promise<RetrieveEventDto[]> {
    return this.usersService.getEvents(userId);
  }

  @ApiResponse({ type: RetrieveOrderDto })
  @Get(':userId/orders')
  @Roles(UserRole.MANAGER)
  @UseGuards(AuthGuard(), RolesGuard)
  async getUserOrders(
    @Param('userId') userId: string,
  ): Promise<RetrieveOrderDto[]> {
    return await this.usersService.getOrders(userId);
  }

  @ApiResponse({ type: RetrieveOrderDto })
  @Delete(':userId/orders/:orderId')
  @Roles(UserRole.MANAGER)
  @UseGuards(AuthGuard(), RolesGuard)
  async deleteUserOrder(
    @Param('orderId') orderId: string,
  ): Promise<RetrieveOrderDto> {
    return await this.usersService.deleteOrder(orderId);
  }
}
