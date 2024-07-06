import { Injectable } from '@nestjs/common';

@Injectable()
export class BlocksService {

  private blocks = [
    { id: 1, networkId: '1', data: 'Block 1 in Network 1' },
    { id: 2, networkId: '1', data: 'Block 2 in Network 1' },
    { id: 3, networkId: '3', data: 'Block 1 in Network 2' },
  ];

  async findAllByIdNetwork(networkId: string): Promise<any> {
    return this.blocks.filter(block => block.networkId === networkId);
  }
}