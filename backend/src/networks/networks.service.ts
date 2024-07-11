import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

import { CreateNetworkDto } from './dto/create-network.dto';
import { UpdateNetworkDto } from './dto/update-network.dto';
import { Network } from './interfaces/network.interface';
import { FileService } from 'src/file/file.service';
import { DockerService } from 'src/docker/docker.service';
import { PassThrough } from 'stream';
import { ethers, TransactionResponse } from 'ethers';
import { CreateFaucetDto } from './dto/create-faucet.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NetworksService {

  private readonly filePath: string;
  private readonly networksPath: string;

  constructor(
    private fileService: FileService, 
    private dockerService: DockerService,     
    private readonly configService: ConfigService
  ) {
    this.filePath = path.join(__dirname, configService.get<string>('networksJsonPathFile'));
    this.networksPath = path.join(__dirname, configService.get<string>('networksJsonPathFolder'));
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

  async down(id: string): Promise<{ success: boolean }> {
    try {
      const networks = await this.findAll();
      const networkPath = path.join(this.networksPath, id);

      if (!this.fileService.directoryExists(networkPath)) {
        return { success: false };
      } else {
        await this.dockerService.stopAllDockerComposeServices(networkPath);
        return { success: true };
      }
    } catch (error) {
      return { success: false };
    }
  }

  async up(id: string): Promise<{ success: boolean }> {
    try {
      const networks = await this.findAll();
      const network = networks.find(n => n.id === id);
      var networkPath: string
      
      if (!network) {
        throw new Error('Network not found');
      } else {
        networkPath = path.join(this.networksPath, id);
      }

      if (!fs.existsSync(path.join(networkPath, 'genesis.json'))) {
        await this.dockerService.createBootnodeKey(networkPath);
        const genesis = await this.dockerService.createGenesis(network, networkPath);
        await this.dockerService.writeGenesisToFile(networkPath, genesis);
    
        const yamlStr = yaml.dump(this.dockerService.createDockerCompose(network), { indent: 2 });
        await this.dockerService.writeDockerComposeToFile(networkPath, yamlStr);
        const env = this.dockerService.createEnv(network, this.networksPath);
        await this.dockerService.writeEnvToFile(networkPath, env);
      }

      await this.dockerService.startAllDockerComposeServices(networkPath);
      return { success: true };
      
    } catch (error) {
      console.error(error);
      return { success: false};
    }
  }

  async restart(id: string): Promise<{ success: boolean }> {
    try{
      const networks = await this.findAll();
      const network = networks.find(n => n.id === id);

      if (!network) {
        return { success: false };
      } else {
        await this.dockerService.restartAndUpdateDockerComposeServices(network, this.networksPath);
      }
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }

  async isAlive(id: string): Promise<{success: boolean}> {
    try {
      const networks = await this.findAll();
      const network = networks.find(n => n.id === id);

      if (!network) {
        return { success: false };
      }

      const networkPath = path.join(this.networksPath, network.id)
      const port = network.nodos.find(i => i.type == 'rpc').port

      // Temporarily suppress console logs
      const originalConsoleLog = console.log;
      console.log = () => {};

      const provider = new ethers.JsonRpcProvider(`${this.configService.get<string>('rpcProviderEnvironment')}:${port}`);
      const blockNumber = await provider.getBlockNumber();

      // Restore console logs
      console.log = originalConsoleLog;

      if (!blockNumber) {
        return({ success: false })
      }

      return({ success: true })

    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.error('Network is down:', error.message);
        return { success: false };
      }
      console.error('Error checking network status:', error);
      return { success: false };
    }
  }

  async addAlloc(id: string): Promise<{success: boolean; account: any}> {
    try {
      const networks = await this.findAll();
      const network = networks.find(n => n.id === id);
      let account: string;

      if (!network) {
        return { success: false, account: null };
      }

      const networkPath = path.join(this.networksPath, network.id);

      if (!(await this.fileService.directoryExists(networkPath))) {
        await this.dockerService.createNetworkDirectories(networkPath);
        const password = this.dockerService.createPassword();
        await this.dockerService.writePasswordToFile(networkPath, password);
      }  

      if (!fs.existsSync(path.join(networkPath, 'genesis.json'))) {
        account = await this.dockerService.createAccount(network, this.networksPath);
      } else {
        return { success: false, account: null };
      }

      return { success: true, account }
    } catch (error) {
      console.log(error)
      return { success: false, account: null };
    }
  }

  async existsGenesisFile(id: string): Promise<{success: boolean}> {
    try {
      const networks = await this.findAll();
      const network = networks.find(n => n.id === id);
      const networkPath = path.join(this.networksPath, network.id);
      
      if (fs.existsSync(path.join(networkPath, 'genesis.json'))) 
        return { success: true }  
      
      return { success: false }
    } catch (error) {
      console.log(error)
      return { success: false }
    }
  }

  async faucet(id: string, createFaucetDto: CreateFaucetDto): Promise<TransactionResponse> {
    try {
      const networks = await this.findAll();
      const network = networks.find(n => n.id === id);

      if (!network) {
        throw new NotFoundException(`Network not found with id: ${id}`);
      }

      // Get the directory, address, and password
      const pathNetwork = path.join(this.networksPath, network.id);
      const password = fs.readFileSync(`${pathNetwork}/password.txt`).toString().trim();
      const files = fs.readdirSync(`${pathNetwork}/keystore`);

      // Get the RPC port
      const port = network.nodos.find(i => i.type == 'rpc').port;

      // Create provider and signer
      const provider = new ethers.JsonRpcProvider(`${this.configService.get<string>('rpcProviderEnvironment')}:${port}`);
      const json = fs.readFileSync(path.join(pathNetwork, 'keystore', files[0])).toString();
      const wallet = await ethers.Wallet.fromEncryptedJson(json, password);
      const signer = wallet.connect(provider);

      // Send transaction
      const tx = await signer.sendTransaction({
        to: createFaucetDto.address,
        value: ethers.parseUnits(createFaucetDto.quantity, 18)
      });

      return tx;

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error processing faucet request with id: ${id}`);
    }
  }
}