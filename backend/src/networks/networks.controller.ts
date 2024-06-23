import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NetworksService } from './networks.service';
import { CreateNetworkDto } from './dto/create-network.dto';
import { UpdateNetworkDto } from './dto/update-network.dto';

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
  findOne(@Param('id') id: string) {
    return this.networksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNetworkDto: UpdateNetworkDto) {
    return this.networksService.update(+id, updateNetworkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.networksService.remove(+id);
  }
}
