import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { NodoDto } from 'src/networks/dto/nodo.dto';

@ValidatorConstraint({ name: 'singleMinerAndOptionalUniqueRpcNode', async: false })
export class SingleMinerAndOptionalUniqueRpcNodeConstraint implements ValidatorConstraintInterface {

    validate(nodos: NodoDto[], args: ValidationArguments) {
        let minerCount = 0;
        let rpcCount = 0;

        for (const nodo of nodos) {
            if (nodo.type === 'miner') {
                minerCount++;
                if (nodo.port) {
                    return false;  // Miner node must have an empty port
                }
            } else if (nodo.type === 'rpc') {
                rpcCount++;
                if (!nodo.port) {
                    return false;  // RPC node must have an assigned port
                }
            }
        }

        return minerCount === 1 && rpcCount <= 1;  // Only one miner and at most one RPC node
    }

    defaultMessage(args: ValidationArguments) {
        return 'There must be exactly one miner node with an empty port and at most one RPC node with an assigned port.';
    }
}