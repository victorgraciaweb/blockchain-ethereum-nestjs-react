import { forwardRef, Module } from '@nestjs/common';
import { NetworksService } from './networks.service';
import { NetworksController } from './networks.controller';
import { FileModule } from '../file/file.module';
import { DockerModule } from 'src/docker/docker.module';

@Module({
  controllers: [NetworksController],
  providers: [NetworksService],
  exports: [NetworksService],
  imports: [FileModule, forwardRef(() => DockerModule)],
})
export class NetworksModule {}
