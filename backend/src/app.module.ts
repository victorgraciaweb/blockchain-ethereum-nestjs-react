import { Module } from '@nestjs/common';
import { NetworksModule } from './networks/networks.module';

@Module({
  imports: [NetworksModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule { }
