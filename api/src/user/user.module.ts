import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userEntity } from './models/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([userEntity])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
