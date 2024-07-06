import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionsService {

  private transactions = [
    { id: 1, blockId: '1', networkId: '1', data: 'Transaction 1 in Block 1 in Network 1' },
    { id: 2, blockId: '1', networkId: '1', data: 'Transaction 2 in Block 1 in Network 1' },
    { id: 3, blockId: '2', networkId: '1', data: 'Transaction 1 in Block 2 in Network 1' },
    { id: 4, blockId: '1', networkId: '2', data: 'Transaction 1 in Block 1 in Network 2' },
  ];

  findAllByBlock(blockId: string) {
    return this.transactions.filter(transaction => transaction.blockId === blockId);
  }

  async findById(id: string) {
    return this.transactions.filter(transaction => transaction.id === parseInt(id));
  }
}