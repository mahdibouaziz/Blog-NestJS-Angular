import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { userEntity } from './models/user.entity';
import { User } from './models/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(userEntity)
    private userRepository: Repository<userEntity>,
    private authService: AuthService,
  ) {}

  async create(user: User): Promise<User> {
    //generate the salt and hash the password
    const salt = await bcrypt.genSalt();
    const password = await this.authService.hashPassword(user.password, salt);
    //create new user and save it to the database
    try {
      const newUser = this.userRepository.create({ ...user, password, salt });
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new BadRequestException('Cannot create the user');
    }
  }

  async findOne(id: number): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, salt, ...user } = await this.userRepository.findOne(id);
    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    //remove password + salts
    users.forEach((user) => {
      delete user.password;
      delete user.salt;
    });
    return users;
  }

  async deleteOne(id: number): Promise<any> {
    return await this.userRepository.delete(id);
  }

  async updateOne(id: number, user: User): Promise<any> {
    delete user.email;
    delete user.password;
    return await this.userRepository.update(id, user);
  }

  async login(user: Partial<User>): Promise<{ access_token: string }> {
    if (this.validateUser(user.email, user.password)) {
      const ourUser = await this.findByMail(user.email);
      user.name = ourUser.name;
      user.username = ourUser.username;
      user.id = ourUser.id;

      delete user.password;

      const access_token = await this.authService.generateJwt(user);
      return { access_token };
    } else {
      throw new UnauthorizedException('password invalid');
    }
  }

  async validateUser(email: string, password: string): Promise<boolean> {
    const user = await this.findByMail(email);
    if (!user) {
      throw new NotFoundException('User with this email not found');
    }
    return await this.authService.comparePasswords(
      password,
      user.password,
      user.salt,
    );
  }

  async findByMail(email: string): Promise<userEntity> {
    return await this.userRepository.findOne({ email });
  }
}
