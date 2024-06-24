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





  async create(createNetworkDto: CreateNetworkDto): Promise<Network> {
    const networks = await this.fileService.readFile<Network[]>(this.filePath);

    // Buscar si existe el network con el mismo ID
    const existingNetworkIndex = networks.findIndex(i => i.id === createNetworkDto.id);

    if (existingNetworkIndex !== -1) {
      // Actualizar el network existente
      networks[existingNetworkIndex] = createNetworkDto;
    } else {
      // Agregar el nuevo network
      networks.push(createNetworkDto);
    }


    //fs.writeFileSync(this.filePath, JSON.stringify(networks, null, 4));
    //this.fileService.writeFile<Network[]>(this.filePath);




    //return networks;
    return createNetworkDto;
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