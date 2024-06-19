const { existsDir, createDir} = require("./utils/os_utils");
const dockerutils = require('./utils/docker_utils');
const yaml = require('js-yaml');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');
const ethers = require('ethers');
const { execSync, exec } = require("child_process");
const { error } = require("console");
app.listen(3001, () => console.log('Listening on port 3001'));
const port = 3001;
app.use(cors());
app.use(express.json());

const networks = JSON.parse(fs.readFileSync('./datos/networks.json').toString());
DIR_BASE = path.join(__dirname, 'datos');
DIR_NETWORKS = path.join(DIR_BASE, 'networks');

app.get('/down/:id', async (req, res) => {
    const { id } = req.params
    const pathNetwork = path.join(DIR_NETWORKS, id)
    
    if (!existsDir(pathNetwork))
        res.status(404).send('No se ha encontrado la red')
    else {
        execSync(`docker compose -f ${pathNetwork}/docker-compose.yml down`)
        // fs.rmSync(pathNetwork, { recursive: true })
        res.send({id:id});
    }

});

app.get('/up/:id', async (req, res) => {
    const { id } = req.params
    const networks = JSON.parse(fs.readFileSync('./datos/networks.json').toString())

    const network = networks.find(i => i.id == id)
    
    if (!network) {
    
        res.status(404).send('No se ha encontrado la red')
        return;
    
    } else {
    
        console.log("up",network)
        const pathNetwork = path.join(DIR_NETWORKS, id)

        if (!existsDir(path.join(DIR_BASE, 'networks', id))) {
            // fs.rmSync(path.join(DIR_BASE, 'networks', id), { recursive: true })
            const rootDir = path.join(DIR_BASE, 'networks', id)
            fs.mkdirSync(rootDir, { recursive: true })

            // To prevent docker compose from root permissioning folders
            const keyDir = path.join(rootDir, 'keystore')
            fs.mkdirSync(keyDir, { recursive: true })

            // To prevent docker compose from root permissioning folders
            network.nodos.forEach(nodo => {
                const nodoDir = path.join(rootDir, nodo.name);
                fs.mkdirSync(nodoDir, { recursive: true });
            });

            fs.writeFileSync(`${pathNetwork}/password.txt`, dockerutils.createPassword(network))

            dockerutils.createCuentaBootnode(network, pathNetwork)
            fs.writeFileSync(`${pathNetwork}/genesis.json`, JSON.stringify(dockerutils.createGenesis(network), null, 4))

            const yamlStr = yaml.dump(dockerutils.createDockerCompose(network), { indent: 2 });
            fs.writeFileSync(`${pathNetwork}/docker-compose.yml`, yamlStr)
            fs.writeFileSync(`${pathNetwork}/.env`, dockerutils.createEnv(network))

            console.log(`docker compose -f ${pathNetwork}/docker-compose.yml up -d`)
            
        }
        
        execSync(`docker compose -f ${pathNetwork}/docker-compose.yml up -d`)
        res.send(network);

    }
});

app.get('/restart/:id', async (req, res) => {
    const { id } = req.params
    const pathNetwork = path.join(DIR_NETWORKS, id)
    // docker-compose stop 
    // update el docker-compose
    if (!existsDir(pathNetwork))
        res.status(404).send('No se ha encontrado la red')
    else {
        execSync(`docker compose -f ${pathNetwork}/docker-compose.yml restart`)
        res.send('ok');
    }

});

app.get('/', async (req, res) => {
    res.send(JSON.parse(fs.readFileSync('./datos/networks.json').toString()));
});

// para cuando existe y para cuando no existe
app.post('/', async (req, res) => {
    const network = req.body
    console.log(network)
    const networks = JSON.parse(fs.readFileSync('./datos/networks.json').toString())
    if (networks.find(i => i.id == network.id)){
        networks[networks.findIndex(i => i.id == network.id)] = network
        fs.writeFileSync('./datos/networks.json', JSON.stringify(networks, null, 4))
        res.send(network);
    }
    else {
        networks.push(network)
        fs.writeFileSync('./datos/networks.json', JSON.stringify(networks, null, 4))
        res.send(network);
    }
});

app.get('/blocks/:net/', async (req, res) => {
    const { net } = req.params

    // obtenemos la red
    const networks = JSON.parse(fs.readFileSync('./datos/networks.json').toString())
    const network = networks.find(i => i.id == net)

    // si no existe not data found
    if (!network) {
        res.status(404).send({"error" : "No se ha encontrado la red"});
        return;
    }
    // obtenemos el directorio donde esta y los datos de la password la cuenta
    const pathNetwork = path.join(DIR_NETWORKS, network.id)

    // obtenemos el port del rpc
    const port = network.nodos.find(i => i.type == 'rpc').port

    // creamos el provider 
    try {
        const provider = new ethers.JsonRpcProvider(`http://localhost:${port}`);
        const blockNumber = await provider.getBlockNumber();

        let promises = [];
        for (let i = blockNumber - 10; i < blockNumber; i++) {
            promises.push(provider.getBlock(i));
        }

        const blocks = await Promise.all(promises)
        res.send(blocks);
    
    } catch {
        res.status(404).send({"error": "No network"})
        return;
    }
})

app.get('/isAlive/:net/', async (req, res) => {
    const { net } = req.params
    // obtenemos la red
    const networks = JSON.parse(fs.readFileSync('./datos/networks.json').toString())
    const network = networks.find(i => i.id == net)
    // si no existe not data found
    if (!network) {
        res.status(404).send('No se ha encontrado la red');
        return;
    }
    // obtenemos el directorio donde esta y los datos de la password la cuenta
    const pathNetwork = path.join(DIR_NETWORKS, network.id)
    // obtenemos el port del rpc
    const port = network.nodos.find(i => i.type == 'rpc').port
    console.log(port)
    
    // creamos el provider 
    try {
        const provider = new ethers.JsonRpcProvider(`http://localhost:${port}`);
        const blockNumber = await provider.getBlockNumber();
        console.log(blockNumber)
        res.send({ alive: true , blockNumber})

    } catch (error) {
        res.send({ alive: false })
    }

    
});

app.get('/updateServices/:net', async (req, res) => {
    const { net } = req.params
    const networks = JSON.parse(fs.readFileSync('./datos/networks.json').toString())
    const network = networks.find(i => i.id == net)

    if (!network) {
        res.status(404).send('No se ha encontrado la red');
        return;
    }

    const servicesList = network.nodos.map(nodo => nodo.name);
    const pathNetwork = path.join(DIR_NETWORKS, network.id)

    try {
        const services = await dockerutils.getRunningServices(pathNetwork);
        
        const stopPromises = services.map(service => {
            if (!dockerutils.isServiceInList(service, servicesList) && service !== "geth-bootnode") {
                return dockerutils.stopAndRemoveService(service, pathNetwork);
            }
            return Promise.resolve(); // No hacer nada si el servicio está en la lista o es "geth-bootnode"
        });

        await Promise.all(stopPromises);
        console.log("After Stop service")

        const result = dockerutils.updateDockerCompose(network, pathNetwork);
        if (result.error) {
            res.status(500).send({ error: result.error.message });
            return;
        } else {
            const yamlStr = yaml.dump(result.yamlStr, { indent: 2 });
            fs.writeFileSync(`${pathNetwork}/docker-compose.yml`, yamlStr);
            fs.writeFileSync(`${pathNetwork}/.env`, dockerutils.createEnv(network));
            res.status(200).send({ msg: 'Servicios actualizados y archivo docker-compose.yml modificado con éxito' });
            
            const startPromises = servicesList.map(service => {
                console.log(services, servicesList)
                if (!services.includes(service) && services !== "geth-bootnode") {
                    return dockerutils.startService(service, pathNetwork);
                }
                return Promise.resolve(); // No hacer nada si el servicio ya está en ejecución
            });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }

    
});

