import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as crypto from 'crypto';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = crypto.randomBytes(32).toString('hex');
    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('hex');

    const user = this.create({
      username,
      password: `${salt}:${hashedPassword}`,
    });

    try {
      await this.save(user);
    } catch (error: any) {
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const e = error as { code?: string };
        if (e.code === '23505') {
          throw new ConflictException('username already exists');
        }
      }
      throw new InternalServerErrorException();
    }
  }
}
