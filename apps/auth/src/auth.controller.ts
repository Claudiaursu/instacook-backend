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
        email: '',
        parola: ''
      },
    },
  })
  signIn(@Body() signInDto: Record<string, any>) {
    console.log("signinDTO", signInDto)
    return this.authService.signIn(signInDto.email, signInDto.parola);
  }
}
