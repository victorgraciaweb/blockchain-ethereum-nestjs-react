export interface Network {
    id:         string;
    chainId:    string;
    subnet:     string;
    ipBootnode: string;
    alloc:      string[];
    nodos:      Nodo[];
}

export interface Nodo {
    type: string;
    name: string;
    ip:   string;
    port: number | string;
}
