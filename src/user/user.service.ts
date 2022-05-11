import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  from,
  map,
  Observable,
  switchMap,
  defer,
  throwError,
  catchError,
} from 'rxjs';
import { Repository, UpdateResult } from 'typeorm';
import UserDto from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  createUser(userDto: UserDto): Observable<User> {
    return from(
      this.userRepository.findOne({ username: userDto.username }),
    ).pipe(
      map((user) => {
        if (user) throw new Error('User Already Exists');
        return user;
      }),
      switchMap((user) => this.userRepository.save(user)),
    );
  }

  updateUser(userDto: UserDto): Observable<UpdateResult> {
    return from(
      this.userRepository.findOne({ username: userDto.username }),
    ).pipe(
      map((user) => {
        if (!user) throw new Error();
        return user.username;
      }),
      switchMap((username) => {
        return this.userRepository.update({ username }, userDto);
      }),
    );
  }
}
