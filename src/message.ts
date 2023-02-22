export interface WorkerMsg {
    type: WorkerMsgType
    counter: number | undefined,
    trio: Color | undefined,
}

export interface MainMsg {
    type: MainMsgType,
    sab : SharedArrayBuffer | undefined
    trio: Color | undefined,
}

export enum MainMsgType {
    Compile, SendSharedMemory
}

export enum WorkerMsgType {
    Update, ReadyForNewTrio, Finished
}

export enum Color {
    Red, Yellow, Green, Blue, Purple
}

export function colorToString(color: Color) {
    switch (color) {
        case Color.Red: 
            return "red";
        case Color.Yellow: 
            return "yellow";
        case Color.Green: 
            return "green";
        case Color.Blue: 
            return "blue";
        case Color.Purple: 
            return "purple";
    }
}