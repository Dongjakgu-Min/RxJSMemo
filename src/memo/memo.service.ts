import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import MemoDto from './memo.dto';
import { Memo } from './memo.entity';

@Injectable()
export class MemoService {
  constructor(
    @InjectRepository(Memo)
    private readonly MemoRepository: Repository<Memo>,
  ) {}

  findAllMemo(): Observable<Memo[]> {
    return from(this.MemoRepository.find());
  }

  findMemoById(id: number): Observable<Memo> {
    return from(this.MemoRepository.findOne({ id }));
  }

  createMemo(memo: MemoDto): Observable<Memo> {
    return from(this.MemoRepository.save(memo));
  }
}
