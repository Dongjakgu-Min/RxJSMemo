import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Db, Repository } from 'typeorm';
import UserDto from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let module: TestingModule;
  let repository: Repository<User>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
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

  afterEach(async () => {
    module.close();
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
