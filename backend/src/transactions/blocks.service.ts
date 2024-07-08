import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { NetworksService } from 'src/networks/networks.service';

@Injectable()
export class BlocksService {

  constructor(private readonly networksService: NetworksService) {}

  async findAllByIdNetwork(networkId: string): Promise<any[]> {
    const network = await this.networksService.findOneById(networkId);
    const port = network.nodos.find(i => i.type == 'rpc').port
    
    const provider = new ethers.JsonRpcProvider(`http://localhost:${port}`);

    const latestBlockNumber = await provider.getBlockNumber();
    const NumBlocks = 70;
    const blocks = [];
    for (let i = latestBlockNumber - NumBlocks; i <= latestBlockNumber; i++) {
      const block = await provider.getBlock(i);
      blocks.push(block);
    }
    return blocks;
  }
}