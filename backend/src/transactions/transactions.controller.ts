import { Controller, Get, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('networks/:networkId/blocks/:blockId/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAllByBlock(
    @Param('networkId') networkId: string, 
    @Param('blockId') blockId: string
  ) {
    return this.transactionsService.findAllByBlock(networkId, blockId);
  }

  @Get(':transactionId')
  findById(
    @Param('networkId') networkId: string, 
    @Param('blockId') blockId: string, 
    @Param('transactionId') transactionId: string
  ) {
    return this.transactionsService.findById(networkId, blockId, transactionId);
  }
}