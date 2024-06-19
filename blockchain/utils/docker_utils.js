const { execSync, exec } = require("child_process");
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const { stdout } = require("process");

function createGenesis(network) {
    const pathNetwork = path.join(DIR_NETWORKS, network.id)
    // ejemplo de genesis
    let genesis = {
        "config": {
            "chainId": parseInt(network.chainId),
            "homesteadBlock": 0,
            "eip150Block": 0,
            "eip155Block": 0,
            "eip158Block": 0,
            "byzantiumBlock": 0,
            "constantinopleBlock": 0,
            "petersburgBlock": 0,
            "istanbulBlock": 0,
            "clique": {
                "period": 4,
                "epoch": 30000
            }
        },
        "nonce": "0x0",
        "timestamp": "0x5e9d4d7c",

        "extradata": "0x00000000000000000000000000000000000000000000000000000000000000002235dea2f59600419e3e894d4f2092f0f9c4bb620000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",

        "gasLimit": "0x2fefd8",
        "difficulty": "0x1",

        "alloc": {
            "2235dea2f59600419e3e894d4f2092f0f9c4bb62": {
                "balance": "0xad78ebc5ac6200000"
            },
            "C077193960479a5e769f27B1ce41469C89Bec299": {
                "balance": "0xad78ebc5ac6200000"
            }
        }
    }

    // metemos la cuenta generada 
    network.alloc.push(fs.readFileSync(`${pathNetwork}/address.txt`).toString().trim())
    genesis.alloc = network.alloc.reduce((acc, i) => {
        const cuenta = i.substring(0, 2) == '0x' ? i.substring(2) : i
        acc[cuenta] = { balance: "0xad78ebc5ac6200000" }
        return acc
    }, {})

    // cuenta que firma
    let cuenta = fs.readFileSync(`${pathNetwork}/address.txt`).toString()
    cuenta = cuenta.substring(0, 2) == '0x' ? cuenta.substring(2) : i

    genesis.extradata = "0x" + "0".repeat(64) + cuenta.trim() + "0".repeat(130)
    return genesis;
}
function createPassword(network) {
    return '12345678'
}

function createNetworkBlock(networkName, driver, subnet) {
    return {
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
}

function createNodoMiner(nodo) {
    return {
      [nodo.name]: {
        image: 'ethereum/client-go:v1.13.8',
        volumes: [
          `./${nodo.name}:/root/.ethereum`,
          './genesis.json:/root/genesis.json',
          './password.txt:/root/.ethereum/password.sec',
          './keystore:/root/.ethereum/keystore'
        ],
        depends_on: [
          'geth-bootnode'
        ],
        networks: {
          ethnetwork: {
            ipv4_address: nodo.ip
          }
        },
        entrypoint: `sh -c 'geth init /root/genesis.json && geth --nat "extip:${nodo.ip}" --netrestrict=\${SUBNET} --bootnodes="\${BOOTNODE}" --miner.etherbase \${ETHERBASE} --mine --unlock \${UNLOCK} --password /root/.ethereum/password.sec'`
      }
    };
}

function createBootnode(network) {
    return {
      'geth-bootnode': {
        hostname: 'geth-bootnode',
        image: 'ethereum/client-go:alltools-v1.13.8',
        command: 'bootnode --addr ${IPBOOTNODE}:30301 --netrestrict=${SUBNET} --nodekey=/root/bootnode.key',
        volumes: [
          './bootnode.key:/root/bootnode.key'
        ],
        networks: {
          ethnetwork: {
            ipv4_address: '${IPBOOTNODE}'
          }
        }
      }
    };
  }

const newNetwork = createNetworkBlock(
    'ethnetwork',
    'bridge',
    '${SUBNET}'
);

function createNodoRpc(nodo) {
    return {
      [nodo.name]: {
        image: 'ethereum/client-go:v1.13.8',
        volumes: [
          `./${nodo.name}:/root/.ethereum`,
          './genesis.json:/root/genesis.json'
        ],
        depends_on: [
          'geth-bootnode'
        ],
        networks: {
          ethnetwork: {
            ipv4_address: nodo.ip
          }
        },
        ports: [
          `${nodo.port}:8545`
        ],
        entrypoint: `sh -c 'geth init /root/genesis.json && geth --netrestrict=\${SUBNET} --bootnodes="\${BOOTNODE}" --nat "extip:${nodo.ip}" --http --http.addr "0.0.0.0" --http.port 8545 --http.corsdomain "*" --http.api "admin,eth,debug,miner,net,txpool,personal,web3"'`
      }
    };
}

function createNodoNormal(nodo) {
    return {
      [nodo.name]: {
        image: 'ethereum/client-go:v1.13.8',
        volumes: [
          `./${nodo.name}:/root/.ethereum`,
          './genesis.json:/root/genesis.json'
        ],
        depends_on: [
          'geth-bootnode'
        ],
        networks: {
          ethnetwork: {
            ipv4_address: nodo.ip
          }
        },
        entrypoint: `sh -c 'geth init /root/genesis.json && geth --bootnodes="\${BOOTNODE}" --nat "extip:${nodo.ip}" --netrestrict=\${SUBNET}'`
      }
    };
  }

function createNodo(nodo) {
    switch (nodo.type) {
        case 'miner':
            return createNodoMiner(nodo)
        case 'rpc':
            return createNodoRpc(nodo)
        case 'normal':
            return createNodoNormal(nodo)
    }

}

function createCuentaBootnode(network, pathNetwork) {
    const UID = process.getuid();
    const GID = process.getgid();

    const cmd = `
    docker run -e IP="@0.0.0.0:0?discport=30301" \
    --rm -v ${pathNetwork}:/root ethereum/client-go:alltools-v1.13.8 \
    sh -c "geth account new --password /root/password.txt --datadir /root | grep 'of the key' | cut -c30-  \
    > /root/address.txt  \
    &&  bootnode -genkey /root/bootnode.key -writeaddress > /root/bootnode \
    &&  chown ${UID}:${GID} /root/address.txt /root/bootnode /root/bootnode.key"`

    execSync(cmd)

}

function createDockerCompose(network) {
    const dockerCompose = {
        version: '3',
        services: {
            
        },    
        networks: {

        },
    }

    Object.assign(dockerCompose.services, createBootnode(network));
    network.nodos.forEach(nodo => {
        Object.assign(dockerCompose.services, createNodo(nodo));
    })
    Object.assign(dockerCompose.networks, newNetwork);

    return dockerCompose;
}

function updateDockerCompose(network, pathNetwork) {
    
    try {
        const dockerCompose = fs.readFileSync(`${pathNetwork}/docker-compose.yml`, 'utf-8')
        
        const yamlStr = yaml.load(dockerCompose)
        
        yamlStr.services = {}

        Object.assign(yamlStr.services, createBootnode(network));
        network.nodos.forEach(nodo => {
            Object.assign(yamlStr.services, createNodo(nodo));
        })
        
        return {yamlStr}

    } catch (error) {
        return {error}
    }
}

function createEnv(network) {
    const pathNetwork = path.join(DIR_NETWORKS, network.id)
    let bootnode =
        `enode://${fs.readFileSync(`${pathNetwork}/bootnode`).toString()}@${network.ipBootnode}:0?discport=30301`
    bootnode = bootnode.replace('\n', '')
    const file =
        `
    BOOTNODE=${bootnode}
    SUBNET=${network.subnet}
    IPBOOTNODE=${network.ipBootnode}
    ETHERBASE=${fs.readFileSync(`${pathNetwork}/address.txt`).toString().trim()}
    UNLOCK=${fs.readFileSync(`${pathNetwork}/address.txt`).toString().trim()}
`
    return file
}
function getRunningServices(pathNetwork, callback) {
    return new Promise((resolve, reject) => {
        exec(`docker compose ps --services --status running`, { cwd: pathNetwork }, (err, stdout, stderr) => {
            if (err) {
                return reject(err);
            }
            if (stderr) {
                return reject(new Error(stderr));
            }

            const services = stdout.trim().split('\n').filter(service => service !== '');
            resolve(services);
        });
    });
}

function isServiceInList(service, serviceList) {
    return serviceList.includes(service)
}

function stopAndRemoveService(serviceName, pathNetwork){
    return new Promise((resolve, reject) => {
        // exec(`docker compose stop ${serviceName} && docker compose rm ${serviceName}`, { cwd: pathNetwork }, (err, stdout, stderr) => {
        exec(`docker compose stop ${serviceName}`, { cwd: pathNetwork }, (err, stdout, stderr) => {
            if (err) {
                return reject(err);
            }
            const errorMessages = stderr.split('\n').filter(line => line.includes('Error'));
            if (errorMessages.length > 0) {
                return reject(new Error(stderr));
            }
            resolve(`Servicio ${serviceName} detenido y eliminado`);
        });
    });
}

function startService(serviceName, pathNetwork) {
    return new Promise((resolve, reject) => {
        exec(`docker compose up -d ${serviceName}`, { cwd: pathNetwork }, (err, stdout, stderr) => {
            if (err) {
                return reject(err);
            }
            const errorMessages = stderr.split('\n').filter(line => line.includes('Error'));
            if (errorMessages.length > 0) {
                return reject(new Error(stderr));
            }
            resolve(`Servicio ${serviceName} iniciado`);
        });
    });
};

module.exports = {
  getRunningServices,
  createGenesis,
  createPassword,
  createNetworkBlock,
  createNodoMiner,
  createNetworkBlock,
  createNodoRpc,
  createNodoNormal,
  createNodo,
  createDockerCompose,
  createEnv,
  createCuentaBootnode,
  updateDockerCompose,
  isServiceInList,
  stopAndRemoveService,
  startService
};