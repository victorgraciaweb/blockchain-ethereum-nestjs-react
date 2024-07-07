import { Controller, Get, Param } from '@nestjs/common';
import { BlocksService } from './blocks.service';

@Controller('networks/:networkId/blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Get()
  findAllByIdNetwork(@Param('networkId') networkId: string) {
    return this.blocksService.findAllByIdNetwork(networkId);
  }
}