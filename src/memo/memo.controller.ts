import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import MemoDto from './memo.dto';
import { MemoService } from './memo.service';

@Controller('memo')
export class MemoController {
  constructor(private readonly memoService: MemoService) {}

  @ApiOperation({ summary: '저장된 모든 메모를 불러옵니다.' })
  @Get()
  findAllMemo() {
    return this.memoService.findAllMemo();
  }

  @ApiOperation({ summary: '특정 메모를 불러옵니다.' })
  @Get()
  findMemoById(id: number) {
    return this.memoService.findMemoById(id);
  }

  @ApiOperation({ summary: '메모를 생성합니다.' })
  @Post()
  createMemo(@Body() memoDto: MemoDto) {
    return this.memoService.createMemo(memoDto);
  }
}
