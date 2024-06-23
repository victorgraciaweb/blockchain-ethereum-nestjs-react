import { Module } from '@nestjs/common';
import { NetworksService } from './networks.service';
import { NetworksController } from './networks.controller';
import { FileModule } from '../file/file.module';

@Module({
  controllers: [NetworksController],
  providers: [NetworksService],
  imports: [FileModule]
})
export class NetworksModule {}
