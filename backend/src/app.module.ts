import { Module } from '@nestjs/common';
import { NetworksModule } from './networks/networks.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [NetworksModule, FileModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule { }
