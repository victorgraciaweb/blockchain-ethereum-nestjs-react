import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { CreateNetworkDto } from './dto/create-network.dto';
import { UpdateNetworkDto } from './dto/update-network.dto';
import { Network } from './interfaces/network.interface';

@Injectable()
export class NetworksService {

  private readonly filePath = path.join(__dirname, '..', '..', '..', 'blockchain', 'datos', 'networks.json');
  
  create(createNetworkDto: CreateNetworkDto) {
    return 'This action adds a new network';
  }






  async findAll(): Promise<Network[]> {
    try {  
      const jsonData = await fs.promises.readFile(this.filePath, 'utf8');
      const networks: Network[] = JSON.parse(jsonData);

      return networks;

    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new NotFoundException(`File not found at ${this.filePath}`);
      }
      throw error;
    }
  }




  


  

  findOne(id: number) {
    return `This action returns a #${id} network`;
  }

  update(id: number, updateNetworkDto: UpdateNetworkDto) {
    return `This action updates a #${id} network`;
  }

  remove(id: number) {
    return `This action removes a #${id} network`;
  }
}