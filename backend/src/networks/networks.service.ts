import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { CreateNetworkDto } from './dto/create-network.dto';
import { UpdateNetworkDto } from './dto/update-network.dto';
import { Network } from './interfaces/network.interface';
import { FileService } from 'src/file/file.service';

@Injectable()
export class NetworksService {

  private readonly filePath: string;

  constructor(private fileService: FileService) {
    this.filePath = path.join(__dirname, '..', '..', '..', 'blockchain', 'datos', 'networks.json');
  }

  create(createNetworkDto: CreateNetworkDto) {
    return 'This action adds a new network';
  }

  async findAll(): Promise<Network[]> {
    return await this.fileService.readFile<Network[]>(this.filePath);
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