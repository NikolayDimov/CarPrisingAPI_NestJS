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
    // ClassSerializerInterceptor,
    Session
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

    @Get('/whoami')
        whoAmI(@Session() session: any) {
            return this.userService.findOne(session.userId);
        }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        // this.userService.create(body.email, body.password);  // creating User with no authentication
        const user = await this.authService.signup(body.email, body.password);  // creating User with authentication
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);  // login User with authentication
        session.userId = user.id;
        return user;
    }

    @Post('/signout')
    signout(@Session() session: any) {
        session.userId = null;
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
