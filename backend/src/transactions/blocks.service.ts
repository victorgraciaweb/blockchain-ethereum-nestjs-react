import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { NetworksService } from 'src/networks/networks.service';

@Injectable()
export class BlocksService {

  constructor(
    private readonly networksService: NetworksService,
    private readonly configService: ConfigService
  ) { }

  async findAllByIdNetwork(networkId: string): Promise<any[]> {
    const network = await this.networksService.findOneById(networkId);
    const port = network.nodos.find(i => i.type == 'rpc').port

    const provider = new ethers.JsonRpcProvider(`${this.configService.get<string>('rpcProviderEnvironment')}:${port}`);
   
     // Obtener el número de bloque más reciente
     const latestBlockNumber = await provider.getBlockNumber();

     // Calcular el rango de bloques que queremos obtener
     const desdeBloque = Math.max(0, latestBlockNumber - 350 + 1);
     const hastaBloque = latestBlockNumber;

     // Obtener los bloques en el rango especificado
     const bloquesPromesas = [];
     for (let i = desdeBloque; i <= hastaBloque; i++) {
         bloquesPromesas.push(provider.getBlock(i));
     }

     // Esperar a que todas las promesas se resuelvan
     const bloques = await Promise.all(bloquesPromesas);

     return bloques.filter(bloque => !!bloque); // Filtrar bloques no nulos
  }
}