import { forwardRef,Module } from '@nestjs/common';
import { DockerService } from './docker.service';
import { FileModule } from '../file/file.module';
import { NetworksModule } from '../networks/networks.module';

@Module({
  providers: [DockerService],
  exports: [DockerService],
  imports: [FileModule, forwardRef(() => NetworksModule)],
})
export class DockerModule {}
