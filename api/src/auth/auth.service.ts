import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/models/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateJwt(user: User): Promise<string> {
    return await this.jwtService.signAsync(user);
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async comparePasswords(
    newPassword: string,
    passwordHash: string,
    salt: string,
  ): Promise<boolean> {
    const newPasswordHashed = await this.hashPassword(newPassword, salt);
    return newPasswordHashed === passwordHash;
  }
}
