import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto) {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto) {
    const { username, password } = authCredentialsDto;

    const user = await this.usersRepository.findOne({ where: { username } });

    if (user) {
      // Split the stored password to get salt and hash
      const [salt, hash] = user.password.split(':');

      // Hash the provided password with the same salt
      const hashVerify = crypto
        .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
        .toString('hex');

      // Compare the hashes
      if (hash === hashVerify) {
        // return { message: 'Login successful' };
        const payload = { username };
        const accessToken: string = this.jwtService.sign(payload);
        return { accessToken };
      }
    }

    return new UnauthorizedException('Invalid credentials');
  }
}
