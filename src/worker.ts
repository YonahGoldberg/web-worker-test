import { WorkerMsg, MainMsgType, Color, WorkerMsgType, MainMsg, colorToString } from './message';
const SPIN_AMOUNT = 10000000;
let sharedMemory: Int8Array;
let counter = 0;
let currTrio: Color = Color.Red;

const stepOptimizer = () => {
    for (let i = 0; i < SPIN_AMOUNT; i++) {}
}

const runOptimizer = () => {
    while (counter != 2000) {
        stepOptimizer();
        counter++;
        console.log(counter);
        // If main wants an update
        if (Atomics.load(sharedMemory, 0)) {
            console.log("Sending update");
            Atomics.store(sharedMemory, 0, 0);
            const workerMsg: WorkerMsg = {
                type: WorkerMsgType.Update,
                counter,
                trio: currTrio,
            }
            postMessage(workerMsg);
        }
        // Main wants to compile somethign else
        if (Atomics.load(sharedMemory, 1)) {
            Atomics.store(sharedMemory, 1, 0);
            console.log("main wants to compile something new");
            const workerMsg: WorkerMsg = {
                type: WorkerMsgType.ReadyForNewTrio,
                counter: undefined,
                trio: undefined,
            }
            console.log("waiting for new trio");
            postMessage(workerMsg);
            return;
        }
    }
    const workerMsg: WorkerMsg = {
        type: WorkerMsgType.Finished,
        counter,
        trio: currTrio,
    }
    postMessage(workerMsg);
}

onmessage = (data: MessageEvent<MainMsg>) => {
    const msg = data.data;
    switch (msg.type) {
        case MainMsgType.SendSharedMemory:
            console.log("received shared memory");
            sharedMemory = new Int8Array(data.data.sab!);
            break;
        case MainMsgType.Compile:
            console.log("received new trio");
            currTrio = msg.trio!;
            counter = 0;
            runOptimizer(); 
            break;
    }
}
