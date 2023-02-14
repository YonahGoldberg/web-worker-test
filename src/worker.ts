import { MainMsg, MainMsgType } from './message';

const SPIN_AMOUNT = 10000000;
let checkUpdates: Int8Array;
let counter = 0;

const stepOptimizer = () => {
    for (let i = 0; i < SPIN_AMOUNT; i++) {}
}

const runOptimizer = () => {
    while (counter != 2000) {
        stepOptimizer();
        counter++;
        if (Atomics.exchange(checkUpdates, 0, 0)) {
            return;
        }
    }
    postMessage({counter: counter, finished: true})
}

onmessage = (data: MessageEvent<MainMsg>) => {
    switch (data.data.type) {
        case MainMsgType.SendArray:
            checkUpdates = new Int8Array(data.data.sab!);
            break;
        case MainMsgType.Compile:
            console.log('compiling');
            counter = 0;
            runOptimizer();
            break;
        case MainMsgType.ProgressUpdate:
            console.log('progressUpdate');
            postMessage({counter: counter, finshed: false})
            runOptimizer();
            break;
    }
}
