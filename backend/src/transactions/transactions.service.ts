import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { NetworksService } from 'src/networks/networks.service';

@Injectable()
export class TransactionsService {

  constructor(
    private readonly networksService: NetworksService,
    private readonly configService: ConfigService
  ) { }

  async findAllByBlock(networkId: string, blockId: string) {
    const network = await this.networksService.findOneById(networkId);
    const port = network.nodos.find(i => i.type == 'rpc').port

    const provider = new ethers.JsonRpcProvider(`${this.configService.get<string>('rpcProviderEnvironment')}:${port}`);

    const blockNumber = parseInt(blockId);
    if (isNaN(blockNumber)) {
      throw new NotFoundException('Invalid blockId. Must be a number.');
    }

    const block = await provider.getBlock(blockNumber);
    if (!block) {
      throw new NotFoundException(`Block ${blockNumber} not found.`);
    }

    const transactions = block.transactions;

    const detailedTransactions = [];
    for (const txHash of transactions) {
      const tx = await provider.getTransaction(txHash);
      detailedTransactions.push(tx);
    }

    return detailedTransactions;
  }

  async findById(networkId: string, blockId: string, transactionId: string) {
    const network = await this.networksService.findOneById(networkId);
    const port = network.nodos.find(i => i.type == 'rpc').port

    const provider = new ethers.JsonRpcProvider(`${this.configService.get<string>('rpcProviderEnvironment')}:${port}`);

    try {
      const transaction = await provider.getTransaction(transactionId);
      return transaction;
    } catch (error) {
      throw new Error('Error fetching transaction: ' + error.message);
    }
  }
}