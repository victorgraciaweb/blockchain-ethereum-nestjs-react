import { forwardRef, Module } from '@nestjs/common';
import { NetworksService } from './networks.service';
import { NetworksController } from './networks.controller';
import { FileModule } from '../file/file.module';
import { DockerModule } from 'src/docker/docker.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [NetworksController],
  providers: [NetworksService],
  exports: [NetworksService],
  imports: [
    ConfigModule,
    FileModule, forwardRef(() => DockerModule)
  ],
})
export class NetworksModule {}
