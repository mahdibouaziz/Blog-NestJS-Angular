import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { User } from './models/user.interface';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  /* Login handler */
  @Post('login')
  login(@Body() user: Partial<User>) {
    return this.userService.login(user);
  }

  /* Basic CRUD */
  @Post()
  create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.userService.deleteOne(id);
  }

  @Put(':id')
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ): Promise<any> {
    return this.userService.updateOne(id, user);
  }
}
