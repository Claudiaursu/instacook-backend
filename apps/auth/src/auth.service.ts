import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './utils/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UserService,
    private jwtService: JwtService
    ) {}

  async signIn(username: string, password: string): Promise<{ token: string }> {
    const existingUser = await this.usersService.getUserByEmail(username);
    const isMatch = await bcrypt.compare(password, existingUser.parola);

    console.log(isMatch);

    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = { 
      id: existingUser.id, 
      email: existingUser.email
    };
    
    return {
      token: await this.jwtService.signAsync(payload),
    };

  }
  
}
