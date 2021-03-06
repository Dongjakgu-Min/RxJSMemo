import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { exec } from 'child_process';


import * as dotenv from 'dotenv';

import { Db, Repository } from 'typeorm';
import UserDto from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let module: TestingModule;
  let repository: Repository<User>;

  afterEach(() => {
    exec('docker-compose down', (err, stdout, stderr) => {
      console.log(stdout);
    });
  });

  beforeEach(async () => {
    dotenv.config({ path: './test.env' });

    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: process.env.DB_TEST_USERNAME,
          password: process.env.DB_TEST_PASSWORD,
          database: process.env.DB_NAME,
          entities: [User],
          synchronize: true,
          keepConnectionAlive: true,
        }),
      ],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create user', (done) => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      jest.spyOn(repository, 'save').mockResolvedValue(new User());

      service
        .createUser({
          username: 'test',
          password: 'password',
        })
        .subscribe((res) => {
          expect(res).toBeInstanceOf(User);
          done();
        });
    });
  });

  describe('createUserError', () => {
    it('shoud exception occured', (done) => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(new User());

      service
        .createUser({
          username: 'test',
          password: 'password',
        })
        .subscribe({
          error: (error: Error) => {
            expect(error.message).toBe('User Already Exists');
            done();
          },
        });
    });
  });
});
