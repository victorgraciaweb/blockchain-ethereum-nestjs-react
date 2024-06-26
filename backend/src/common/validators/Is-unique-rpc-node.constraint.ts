import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { NodoDto } from 'src/networks/dto/nodo.dto';

@ValidatorConstraint({ name: 'IsUniqueRpcNode', async: false })
export class IsUniqueRpcNodeConstraint implements ValidatorConstraintInterface {
    validate(nodos: NodoDto[], args: ValidationArguments) {
        const rpcNodes = nodos.filter(node => node.type === 'rpc');
        return rpcNodes.length === 1;
    }

    defaultMessage(args: ValidationArguments) {
        return 'There must be exactly one node with type "rpc".';
    }
}