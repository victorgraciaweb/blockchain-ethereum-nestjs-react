import { forwardRef,Module } from '@nestjs/common';
import { DockerService } from './docker.service';
import { FileModule } from '../file/file.module';
import { NetworksModule } from '../networks/networks.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [DockerService],
  exports: [DockerService],
  imports: [
    ConfigModule,
    FileModule, 
    forwardRef(() => NetworksModule)
  ],
})
export class DockerModule {}
