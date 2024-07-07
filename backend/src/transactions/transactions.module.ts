import { Module } from '@nestjs/common';
import { BlocksController } from './blocks.controller';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { BlocksService } from './blocks.service';
import { NetworksService } from 'src/networks/networks.service';
import { NetworksModule } from 'src/networks/networks.module';

@Module({
    controllers: [
        BlocksController, 
        TransactionsController
    ],
    providers: [
        TransactionsService, 
        BlocksService
    ],
    imports: [NetworksModule],
})
export class TransactionsModule {}
