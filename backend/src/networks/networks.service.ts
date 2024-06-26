import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createNetworkDto: CreateNetworkDto): Promise<Network> {
    const networks = await this.fileService.readFile<Network[]>(this.filePath);

    const network = networks.find(network => network.id === createNetworkDto.id);

    if (network) {
      throw new BadRequestException(`Error creating new Network with id ${createNetworkDto.id}. Resource already exists`);
    }

    networks.push(createNetworkDto);

    await this.fileService.writeFile(this.filePath, networks);

    return createNetworkDto;
  }

  async findAll(): Promise<Network[]> {
    return await this.fileService.readFile<Network[]>(this.filePath);
  }

  async findOne(id: string): Promise<Network> {
    let networks = await this.fileService.readFile<Network[]>(this.filePath);

    const network = networks.find(network => network.id === id);

    if (!network) {
      throw new NotFoundException(`Not found at ${id}`);
    }

    return network;
  }

  update(id: number, updateNetworkDto: UpdateNetworkDto) {
    return `This action updates a #${id} network`;
  }

  remove(id: number) {
    return `This action removes a #${id} network`;
  }
}