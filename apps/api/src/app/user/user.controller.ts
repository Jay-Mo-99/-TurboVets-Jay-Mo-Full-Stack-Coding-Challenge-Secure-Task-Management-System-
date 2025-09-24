import { Controller, Post, Body, HttpException, HttpStatus, Get } from "@nestjs/common";
import { UserService } from "./user.service";

interface RegisterDto {
  email: string;
  username: string;
  password: string;
}

interface LoginDto {
  email: string;
  password: string;
}

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('health')
  healthCheck() {
    return { status: 'ok', message: 'User API is working' };
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    try {
      const { email, username, password } = body;
      if (!email || !username || !password) {
        throw new HttpException('All fields are required', HttpStatus.BAD_REQUEST);
      }
      const user = await this.userService.register(email, username, password);
      return { success: true, user };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    try {
      const { email, password } = body;
      if (!email || !password) {
        throw new HttpException('Email and password are required', HttpStatus.BAD_REQUEST);
      }
      const result = await this.userService.login(email, password);
      return { success: true, ...result };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }
}
