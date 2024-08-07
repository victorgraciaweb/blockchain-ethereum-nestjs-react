import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NetworksService } from './networks.service';
import { CreateNetworkDto } from './dto/create-network.dto';
import { UpdateNetworkDto } from './dto/update-network.dto';
import { CreateFaucetDto } from './dto/create-faucet.dto';

@Controller('networks')
export class NetworksController {
  constructor(private readonly networksService: NetworksService) {}

  @Post()
  create(@Body() createNetworkDto: CreateNetworkDto) {
    return this.networksService.create(createNetworkDto);
  }

  @Get()
  findAll() {
    return this.networksService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.networksService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNetworkDto: UpdateNetworkDto) {
    return this.networksService.update(id, updateNetworkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.networksService.remove(id);
  }

   @Post(':id/up')
   up(@Param('id') id: string) {
     return this.networksService.up(id);
   }

   @Post(':id/down')
   down(@Param('id') id: string) {
     return this.networksService.down(id);
   }

   @Post(':id/restart')
   restart(@Param('id') id: string) {
     return this.networksService.restart(id);
   }

   @Post(':id/addAlloc')
   addAlloc(@Param('id') id: string) {
     return this.networksService.addAlloc(id);
   }

   @Get(':id/isAlive')
   isAlive(@Param('id') id: string) {
     return this.networksService.isAlive(id);
   }

   @Get(':id/existsGenesisFile')
   existsGenesisFile(@Param('id') id: string) {
     return this.networksService.existsGenesisFile(id);
   }

   @Post(':id/faucet')
   faucet(@Param('id') id: string, @Body() createFaucetDto: CreateFaucetDto) {
     return this.networksService.faucet(id, createFaucetDto);
   }
}
