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

    const blocks = [];
    const latestBlockNumber = await provider.getBlockNumber();
    const numBlocksShowing = 350;

    // Iteramos desde el último bloque hasta el bloque número (latestBlockNumber - 349)
    for (let i = latestBlockNumber; i > latestBlockNumber - numBlocksShowing; i--) {
      const block = await provider.getBlock(i);
      blocks.push(block);
    }

    return blocks;
  }
}