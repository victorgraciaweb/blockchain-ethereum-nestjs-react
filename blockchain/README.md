## Intro

This API creates a docker compose file to run a local Ethereum PoA network as defined in datos/networks.json file. 

Some basic operations are allowed to start/create, stop, restart an Ethereum PoA network (check usage section below).

Also two methods are provided to check if network is alive and to list all the existing blocks from the Ethereum PoA network.

## Usage

### Initialize or start Ethereum PoA Network
```
curl http://localhost:3001/up/red2
```
### Stop existing Ethereum PoA network
```
curl http://localhost:3001/down/red2
```
### Restart existing Ethereum PoA network
```
curl http://localhost:3001/restart/red2
```
### Checks if Ethereum network is alive
```
curl http://localhost:3001/isAlive/red2
```
### List blocks from Ethereum network
```
curl http://localhost:3001/blocks/red2
```