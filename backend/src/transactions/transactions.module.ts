import { Module } from '@nestjs/common';
import { BlocksController } from './blocks.controller';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { BlocksService } from './blocks.service';
import { NetworksService } from 'src/networks/networks.service';
import { NetworksModule } from 'src/networks/networks.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    controllers: [
        BlocksController, 
        TransactionsController
    ],
    providers: [
        TransactionsService, 
        BlocksService
    ],
    imports: [
        ConfigModule,
        NetworksModule
    ],
})
export class TransactionsModule {}
