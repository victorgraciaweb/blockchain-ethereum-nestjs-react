import { Injectable } from '@nestjs/common';
import { Genesis } from "./interfaces/docker.interface";
import { FileService } from 'src/file/file.service';
import { Network, Nodo } from '../networks/interfaces/network.interface';
import * as fs from "node:fs";
import * as path from "node:path";
import { exec, execSync } from 'node:child_process';
import { promisify } from 'util';
import * as yaml from 'js-yaml';
import { NetworksService } from 'src/networks/networks.service';
import { CreateNetworkDto } from 'src/networks/dto/create-network.dto';


@Injectable()
export class DockerService {
    private readonly filePath: string;
    private readonly networksPath: string;
    private readonly dataPath: string;

    constructor(private readonly fileService: FileService) {
        this.networksPath = path.join(__dirname, '..', '..', '..', 'blockchain', 'datos', 'networks');
        this.dataPath = path.join(__dirname, '..', '..', '..', 'blockchain', 'datos');
        this.filePath = path.join(__dirname, '..', '..', '..', 'blockchain', 'datos', 'networks.json');
    }

    async createGenesis(network: any, networkPath: string): Promise<Genesis> {
        return new Promise((resolve, reject) => {
            try{
                // Parse networks.json
                const networksFilePath = this.filePath;
                const networksData = fs.readFileSync(networksFilePath, 'utf-8');
                const networks = JSON.parse(networksData);
        
                if (!network) {
                    return reject(new Error(`Network with ID ${network.id} not found in networks.json`));
                }

                // Find network by ID and alloc property
                const networkById = networks.find((n: any) => n.id === network.id);
                if (!networkById) {
                    return reject(new Error(`Network with ID ${network.id} not found in networks.json`));
                }

                // Genesis structure example
                const genesis: Genesis = {
                    config: {
                        chainId: parseInt(network.chainId),
                        homesteadBlock: 0,
                        eip150Block: 0,
                        eip155Block: 0,
                        eip158Block: 0,
                        byzantiumBlock: 0,
                        constantinopleBlock: 0,
                        petersburgBlock: 0,
                        istanbulBlock: 0,
                        clique: {
                            period: 4,
                            epoch: 30000
                        }
                    },
                    nonce: '0x0',
                    timestamp: '0x5e9d4d7c',
                    extradata: '',
                    gasLimit: '0x2fefd8',
                    difficulty: '0x1',
                    alloc: {}
                };
        
                // Add alloc accounts from network.json to genesis
                genesis.alloc = networkById.alloc.reduce((acc: { [key: string]: { balance: string } }, i: string) => {
                    const account = i.startsWith('0x') ? i.slice(2) : i;
                    acc[account] = { balance: '0xad78ebc5ac6200000' };
                    return acc;
                }, {});
        
                // Add first account to extradata as signer account
                const firstAccount = networkById.alloc[0];
                if (firstAccount) {
                    let account = firstAccount.startsWith('0x') ? firstAccount.slice(2) : firstAccount;
                    genesis.extradata = '0x' + '0'.repeat(64) + account.trim() + '0'.repeat(130);
                }
        
                resolve(genesis);
            } catch (error) {
                if (error instanceof SyntaxError) {
                    reject(new Error('Error parsing networks.json: ' + error.message));
                } else if (error.code === 'ENOENT') {
                    reject(new Error('networks.json file not found at path: ' + networkPath));
                } else {
                    reject(new Error('Error creating genesis: ' + error.message));
                }
            }
        });
    }

    createPassword(): string {
        return '12345678'
    }

    createNetworkBlock(networkName: string, driver: string, subnet: string): any {
        try {
            const networkBlock = {
                [networkName]: {
                    driver: driver,
                    ipam: {
                        config: [
                            {
                                subnet: subnet
                            }
                        ]
                    }
                }
            };
            return networkBlock;
        } catch (error) {
            throw new Error(`Error creating network block: ${error.message}`);
        }
    }

    createBootnode(network: any): any {
        try {
            const bootnodeConfig: any = {
                'geth-bootnode': {
                    hostname: 'geth-bootnode',
                    image: 'ethereum/client-go:alltools-v1.13.8',
                    command: `bootnode --addr ${network.ipBootnode}:30301 --netrestrict=${network.subnet} --nodekey=/root/bootnode.key`,
                    volumes: [
                        './bootnode.key:/root/bootnode.key'
                    ],
                    networks: {
                        ethnetwork: {
                            ipv4_address: network.ipBootnode
                        }
                    }
                }
            };
            return bootnodeConfig;
        } catch (error) {
            throw new Error(`Error creating bootnode: ${error.message}`);
        }
    }

    async createAccount(network: any, networksPath: string): Promise<string> {
        try {
            const execAsync = promisify(exec);

            if (!network) {
                throw new Error('Network not found');
            }

            if (!networksPath) {
                throw new Error('Networks path not found');
            }

            const networkPath: string = path.join(networksPath, `${network.id}`);

            const cmd = `docker run -e IP="@0.0.0.0:0?discport=30301" \
                --rm -v ${networkPath}:/root ethereum/client-go:alltools-v1.13.8 \
                sh -c "geth account new --password /root/password.txt --datadir /root | grep 'of the key' | cut -c30-"`;
    
            const { stdout } = await execAsync(cmd);
    
            // Gets account string from stdout
            let account = stdout.trim();
            if (account.startsWith('0x')) {
                account = account.slice(2);
            }
            
            // Add new account to file networks.json
            // Read file networks.json
            const networksData = fs.readFileSync(this.filePath, 'utf-8');
            const networks = JSON.parse(networksData);

            // Find network by ID and updates 'alloc' property
            const networkById = networks.find((n: any) => n.id === network.id);

            if (networkById) {
                networkById.alloc.push(account);
                fs.writeFileSync(this.filePath, JSON.stringify(networks, null, 2), 'utf-8');
            } else {
                throw new Error(`Network with ID ${networkById} not found in networks.json`);
            }

            return account;
        } catch (error) {
            throw new Error(`Error creating bootnode key: ${error.message}`);
        }
    }

    async createBootnodeKey(networkPath: string): Promise<void> {
        try {
            const execAsync = promisify(exec);
            const bootnodeCmd = `docker run --rm -v ${networkPath}:/root ethereum/client-go:alltools-v1.13.8 \
                sh -c "bootnode -genkey /root/bootnode.key -writeaddress > /root/bootnode \
                && chown $(id -u):$(id -g) /root/bootnode /root/bootnode.key"`;
    
            await execAsync(bootnodeCmd);
        } catch (error) {
            throw new Error(`Error creating bootnode key: ${error.message}`);
        }
    }

    createMinerNode(node: Nodo): any {
        try {
            if (!node || !node.name || !node.ip) {
                throw new Error('Invalid node object');
            }
    
            const minerNodeConfig = {
                [node.name]: {
                    image: 'ethereum/client-go:v1.13.8',
                    volumes: [
                        `./${node.name}:/root/.ethereum`,
                        './genesis.json:/root/genesis.json',
                        './password.txt:/root/.ethereum/password.sec',
                        './keystore:/root/.ethereum/keystore'
                    ],
                    depends_on: [
                        'geth-bootnode'
                    ],
                    networks: {
                        ethnetwork: {
                            ipv4_address: node.ip
                        }
                    },
                    entrypoint: `sh -c 'geth init /root/genesis.json && geth --nat "extip:${node.ip}" --netrestrict=\${SUBNET} --bootnodes="\${BOOTNODE}" --miner.etherbase \${ETHERBASE} --mine --unlock \${UNLOCK} --password /root/.ethereum/password.sec'`
                }
            };
    
            return minerNodeConfig;
        } catch (error) {
            throw new Error(`Error creating miner node: ${error.message}`);
        }
    }

    createRpcNode(node: Nodo): any {
        try {
            if (!node || !node.name || !node.ip || !node.port) {
                throw new Error('Invalid node object');
            }
    
            const rpcNodeConfig = {
                [node.name]: {
                    image: 'ethereum/client-go:v1.13.8',
                    volumes: [
                        `./${node.name}:/root/.ethereum`,
                        './genesis.json:/root/genesis.json'
                    ],
                    depends_on: [
                        'geth-bootnode'
                    ],
                    networks: {
                        ethnetwork: {
                            ipv4_address: node.ip
                        }
                    },
                    ports: [
                        `${node.port}:8545`
                    ],
                    entrypoint: `sh -c 'geth init /root/genesis.json && geth --netrestrict=\${SUBNET} --bootnodes="\${BOOTNODE}" --nat "extip:${node.ip}" --http --http.addr "0.0.0.0" --http.port 8545 --http.corsdomain "*" --http.api "admin,eth,debug,miner,net,txpool,personal,web3"'`
                }
            };
    
            return rpcNodeConfig;
        } catch (error) {
            throw new Error(`Error creating RPC node: ${error.message}`);
        }
    }

    createNormalNode(node: Nodo): any {
        try {
            if (!node || !node.name || !node.ip) {
                throw new Error('Invalid node object');
            }
    
            const normalNodeConfig = {
                [node.name]: {
                    image: 'ethereum/client-go:v1.13.8',
                    volumes: [
                        `./${node.name}:/root/.ethereum`,
                        './genesis.json:/root/genesis.json'
                    ],
                    depends_on: [
                        'geth-bootnode'
                    ],
                    networks: {
                        ethnetwork: {
                            ipv4_address: node.ip
                        }
                    },
                    entrypoint: `sh -c 'geth init /root/genesis.json && geth --bootnodes="\${BOOTNODE}" --nat "extip:${node.ip}" --netrestrict=\${SUBNET}'`
                }
            };
    
            return normalNodeConfig;
        } catch (error) {
            throw new Error(`Error creating normal node: ${error.message}`);
        }
    }
    
    createNode(node: Nodo): any {
        try {
            if (!node || !node.type) {
                throw new Error('Invalid node type');
            }
    
            switch (node.type) {
                case 'miner':
                    return this.createMinerNode(node);
                case 'rpc':
                    return this.createRpcNode(node);
                case 'normal':
                    return this.createNormalNode(node);
                default:
                    throw new Error(`Invalid node type: ${node.type}`);
            }
        } catch (error) {
            throw new Error(`Error creating node: ${error.message}`);
        }
    }

    createDockerCompose(network: any): any {
        try {
            const dockerCompose: any = {
                version: '3',
                services: {},
                networks: {},
            };
    
            const newNetwork = this.createNetworkBlock(
                'ethnetwork',
                'bridge',
                network.subnet
            );
            
            Object.assign(dockerCompose.services, this.createBootnode(network));
            network.nodos.forEach((node: any) => {
                Object.assign(dockerCompose.services, this.createNode(node));
            });
            Object.assign(dockerCompose.networks, newNetwork);
    
            return dockerCompose;
        } catch (error) {
            throw new Error(`Cannot create docker-compose file: ${error.message}`);
        }
    }

    updateDockerCompose(network: any, networkPath: string): { yamlStr: any } | { error: Error } {
        try {
            const dockerCompose = fs.readFileSync(`${networkPath}/docker-compose.yml`, 'utf-8');
            const yamlStr = yaml.load(dockerCompose);

            yamlStr.services = {};

            Object.assign(yamlStr.services, this.createBootnode(network));
            network.nodos.forEach(node => {
                Object.assign(yamlStr.services, this.createNode(node));
            });

            return { yamlStr };
        } catch (error) {
            throw new Error(`Cannot update docker-compose file: ${error.message}`);
        }
    }

    createEnv(network: any, networksPath: string): string {
        try{
            const pathNetwork = path.join(networksPath, network.id)
            
            let bootnode =
                `enode://${fs.readFileSync(`${pathNetwork}/bootnode`).toString()}@${network.ipBootnode}:0?discport=30301`
            bootnode = bootnode.replace('\n', '')
            
            const file =
            `
            BOOTNODE=${bootnode}
            SUBNET=${network.subnet}
            IPBOOTNODE=${network.ipBootnode}
            ETHERBASE=${network.alloc[0]}
            UNLOCK=${network.alloc[0]}
            `
            return file
        } catch (error) {
            throw new Error(`Cannot create .env file: ${error.message}`)
        }
    }

    async getRunningDockerComposeServices(networkPath: string): Promise<string[] | { error: Error }> {
        try {
            const execAsync = promisify(exec);
            const { stdout, stderr } = await execAsync(`docker compose ps --services --status running`, { cwd: networkPath });
    
            if (stderr) {
                throw new Error(stderr);
            }
    
            const services = stdout.trim().split('\n').filter(service => service !== '');
            return services;
        } catch (error) {
            return { error: new Error(`Error getting running services: ${error.message}`) };
        }
    }

    async isDockerComposeServiceInList(serviceName: string, serviceList: string[]): Promise<boolean> {
        try {
            return serviceList.includes(serviceName);
        } catch (error) {
            throw new Error(`Error checking if service is in list: ${error.message}`);
        }
    }

    async stopAndRemoveDockerComposeService(serviceName: string, networkPath: string): Promise<string | { error: Error }> {
        try {
            const { stdout, stderr } = await promisify(exec)(`docker compose stop ${serviceName}`, { cwd: networkPath });

            const errorMessages = stderr.split('\n').filter(line => line.includes('Error'));
            if (errorMessages.length > 0) {
                throw new Error(stderr);
            }

            return `Service ${serviceName} stopped`;
        } catch (error) {
            throw new Error(`Error stopping service: ${error.message}`);
        }
    }

    async stopAllDockerComposeServices(networkPath: string): Promise<string | { error: Error }> {
        try {
            const execAsync = promisify(exec);
            const { stdout, stderr } = await execAsync(`docker compose down`, { cwd: networkPath });
    
            const errorMessages = stderr.split('\n').filter(line => line.includes('Error'));
            if (errorMessages.length > 0) {
                throw new Error(stderr);
            }
    
            return `All services down`;
        } catch (error) {
            return { error: new Error(`Error stopping services: ${error.message}`) };
        }
    }

    async startDockerComposeService(serviceName: string, networkPath: string): Promise<string> {
        try {
            const { stdout, stderr } = await promisify(exec)(`docker compose up -d ${serviceName}`, { cwd: networkPath });

            const errorMessages = stderr.split('\n').filter(line => line.includes('Error'));
            if (errorMessages.length > 0) {
                throw new Error(stderr);
            }

            return `Service ${serviceName} started`;
        } catch (error) {
            throw new Error(`Error starting service: ${error.message}`);
        }
    }

    async startAllDockerComposeServices(networkPath: string): Promise<string> {
        try {
            const { stdout, stderr } = await promisify(exec)(`docker compose up -d`, { cwd: networkPath });

            const errorMessages = stderr.split('\n').filter(line => line.includes('Error'));
            if (errorMessages.length > 0) {
                throw new Error(stderr);
            }

            return `All services started or already running`;
        } catch (error) {
            throw new Error(`Error starting services: ${error.message}`);
        }
    }

    async restartAndUpdateDockerComposeServices(network: any, networksPath: string): Promise<string> {
        try {
            const networkPath = path.join(networksPath, network.id);
            const servicesList = network.nodos.map(nodo => nodo.name);
            
            // Get the list of running services
            const services = await this.getRunningDockerComposeServices(networkPath);

            // Stop services
            if (Array.isArray(services)) {
                const stopPromises = services.map(service => {
                    if (!servicesList.includes(service)) {
                        if (service !== "geth-bootnode")
                            return this.stopAndRemoveDockerComposeService(service, networkPath);
                    }
                    return Promise.resolve();
                });
            
                await Promise.all(stopPromises);
            } else {
                throw new Error(`Error stopping services: ${services.error.message}`);
            }
    
            // Update docker-compose file
            const result = this.updateDockerCompose(network, networkPath);
            if ('error' in result) {
                throw new Error(`Error updating services in docker-compose.yml: ${result.error.message}`);
            }
            
            // Write the new configuration to the docker-compose.yml file
            const yamlStr = yaml.dump(result.yamlStr, { indent: 2 });
            await this.writeDockerComposeToFile(networkPath, yamlStr);

            // Start services
            if (Array.isArray(services)) {
                const stopPromises = servicesList.map(service => {
                    if (!services.includes(service) && service !== "geth-bootnode") {
                        return this.startDockerComposeService(service, networkPath);
                    }
                    return Promise.resolve();
                });
            
                await Promise.all(stopPromises);
            } else {
                throw new Error('Error starting services');
            }
    
            return `All services updated and restarted`;
        } catch (error) {
            throw new Error(`Error updating services: ${error.message}`);
        }
    }

    async createNetworkDirectories(networkPath: string) {
        await this.fileService.createDirectory(networkPath);
        await this.fileService.createDirectory(path.join(networkPath, 'keystore'));
    }
      
    async writePasswordToFile(networkPath: string, password: string) {
        await fs.promises.writeFile(`${networkPath}/password.txt`, password);
    }
    
    async writeGenesisToFile(networkPath: string, genesis: any) {
        await fs.promises.writeFile(`${networkPath}/genesis.json`, JSON.stringify(genesis, null, 4));
    }
    
    async writeDockerComposeToFile(networkPath: string, yamlStr: string) {
        await fs.promises.writeFile(`${networkPath}/docker-compose.yml`, yamlStr);
    }
      
    async writeEnvToFile(networkPath: string, env: string) {
        await fs.promises.writeFile(`${networkPath}/.env`, env);
    }
}

