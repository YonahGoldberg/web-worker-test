export interface WorkerMsg {
    finished: boolean,
    counter: number,
}

export enum MainMsg {
    Compile, GetStatus,
}