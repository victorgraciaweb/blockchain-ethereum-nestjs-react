import { Module } from '@nestjs/common';
import { NetworksModule } from './networks/networks.module';
import { FileModule } from './file/file.module';
import { DockerModule } from './docker/docker.module';

@Module({
  imports: [NetworksModule, FileModule, DockerModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule { }
