import {
    Body,
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Query,
    NotFoundException,
    // UseInterceptors,
    // ClassSerializerInterceptor
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateuserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@Serialize(UserDto) // no password return for user

export class UsersController {
    constructor(
        private userService: UsersService,
        private authService: AuthService
        ) {}

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        // this.userService.create(body.email, body.password);  // creating User with no authentication
        return this.authService.signup(body.email, body.password);  // creating User with authentication
    }

    @Post('/signin')
    signin(@Body() body: CreateUserDto) {
        return this.authService.signin(body.email, body.password);  // login User with authentication
    }

    // @UseInterceptors(new SerializerInterceptor(UserDto)) // no password return with Get method
    // @Serialize(UserDto)
    @Get('/:id')
    async findUser(@Param('id') id: string) {
        // console.log('handler is running');
        const user = await this.userService.findOne(parseInt(id));
        if (!user) {
            throw new NotFoundException('user not found');
        }
        return user;
    }

    // @Serialize(UserDto)     // no password return for user
    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.userService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.userService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateuserDto) {
        return this.userService.update(parseInt(id), body);
    }
}
