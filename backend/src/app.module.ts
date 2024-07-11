import { Module } from '@nestjs/common';
import { NetworksModule } from './networks/networks.module';
import { FileModule } from './file/file.module';
import { DockerModule } from './docker/docker.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ConfigModule } from '@nestjs/config';
import { AppConfiguration } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ AppConfiguration ],
    }),
    NetworksModule, 
    FileModule, 
    DockerModule, 
    TransactionsModule
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule { }
