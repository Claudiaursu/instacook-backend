import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        username: '',
        parola: ''
      },
    },
  })
  async signIn(@Body() signInDto: Record<string, any>) {
    console.log("signinDTO", signInDto)
    const result = await this.authService.signIn(signInDto.username, signInDto.parola);
    console.log("result!!!!! ", result);
    return result;
  }
}
