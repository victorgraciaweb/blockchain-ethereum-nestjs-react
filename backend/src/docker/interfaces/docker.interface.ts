export interface Genesis {
    config: {
        chainId: number;
        homesteadBlock: number;
        eip150Block: number;
        eip155Block: number;
        eip158Block: number;
        byzantiumBlock: number;
        constantinopleBlock: number;
        petersburgBlock: number;
        istanbulBlock: number;
        clique: {
            period: number;
            epoch: number;
        };
    };
    nonce: string;
    timestamp: string;
    extradata: string;
    gasLimit: string;
    difficulty: string;
    alloc: {
        [key: string]: {
            balance: string;
        };
    };
}

