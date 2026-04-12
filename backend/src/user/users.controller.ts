import { Controller, Get, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { 
  ApiTags, 
  ApiOperation, 
  ApiOkResponse, 
  ApiBearerAuth, 
  ApiUnauthorizedResponse 
} from '@nestjs/swagger';
import { Users } from '../entities/Users';

@ApiTags('users')
@ApiBearerAuth() // Indicates that a JWT is required to access these routes
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ 
    summary: 'Get current user profile', 
    description: 'Retrieves the full profile of the authenticated user based on the JWT token.' 
  })
  @ApiOkResponse({ 
    description: 'The user profile has been successfully retrieved.',
    type: Users
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token.' })
  async getProfile(@Request() req) {
    const user = await this.usersService.findOneById(req.user.userId);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { passwordHash, ...result } = user;
    return result;
  }
}