export interface SignalData {
    id?: string;
    from?: Caller;
    to?: Caller;
    signal: any;
}

export interface Caller {
    id: string;
    name: string;
}