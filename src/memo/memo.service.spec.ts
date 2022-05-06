import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { Memo } from './memo.entity';
import { MemoService } from './memo.service';

const mockRepository = () => ({
  save: jest.fn().mockResolvedValue(new Memo()),
});

describe('MemoService', () => {
  let service: MemoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemoService,
        {
          provide: getRepositoryToken(Memo),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<MemoService>(MemoService);
  });

  describe('createMemo', () => {
    it('should create a memo', (done) => {
      service
        .createMemo({
          title: '내가 만일 하늘이라면',
          content: '그대 얼굴에 물들고 싶어',
          tag: ['안치환'],
        })
        .subscribe((res) => {
          expect(res).toBeInstanceOf(Memo);
          done();
        });
    });
  });
});
