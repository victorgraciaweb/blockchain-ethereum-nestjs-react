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

    const networkById = networks.find(network => network.id === createNetworkDto.id);
    if (networkById) {
      throw new BadRequestException(`Error creating new Network with id ${createNetworkDto.id}. Resource already exists`);
    }

    const networkByChainId = networks.find(network => network.chainId === createNetworkDto.chainId);
    if (networkByChainId) {
      throw new BadRequestException(`Error creating new Network with ChainID ${createNetworkDto.chainId}. Resource already exists`);
    }

    networks.push(createNetworkDto);

    await this.fileService.writeFile(this.filePath, networks);

    return createNetworkDto;
  }

  async findAll(): Promise<Network[]> {
    return await this.fileService.readFile<Network[]>(this.filePath);
  }

  async findOneById(id: string): Promise<Network> {
    let networks = await this.fileService.readFile<Network[]>(this.filePath);

    const network = networks.find(network => network.id === id);

    if (!network) {
      throw new NotFoundException(`Not found at ${id}`);
    }

    return network;
  }

  async update(id: string, updateNetworkDto: UpdateNetworkDto): Promise<Network> {
    const networks = await this.findAll();

    const index = networks.findIndex(network => network.id === id);

    if (index === -1) {
      throw new NotFoundException(`Network with id ${id} not found`);
    }

    const updatedNetwork = { ...networks[index], ...updateNetworkDto };
    networks[index] = updatedNetwork;

    await this.fileService.writeFile(this.filePath, networks);

    return updatedNetwork;
  }

  async remove(id: string): Promise<void> {
    const networks = await this.findAll();
    const updatedNetworks = networks.filter(network => network.id !== id);

    if (networks.length === updatedNetworks.length) {
      throw new NotFoundException(`Network with id ${id} not found`);
    }

    await this.fileService.writeFile(this.filePath, updatedNetworks);
  }
}