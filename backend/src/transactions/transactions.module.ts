import { Module } from '@nestjs/common';
import { BlocksController } from './blocks.controller';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { BlocksService } from './blocks.service';

@Module({
    controllers: [
        BlocksController, 
        TransactionsController
    ],
    providers: [
        TransactionsService, 
        BlocksService
    ]
})
export class TransactionsModule {}
