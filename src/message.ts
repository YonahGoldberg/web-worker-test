export interface WorkerMsg {
    finished: boolean,
    counter: number,
}

export interface MainMsg {
    type: MainMsgType,
    sab : SharedArrayBuffer | undefined
}

export enum MainMsgType {
    Compile, SendArray
}