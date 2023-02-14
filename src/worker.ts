import { MainMsg, MainMsgType } from './message';

const SPIN_AMOUNT = 1000000;
let progressUpdate: Int8Array;
let counter = 0;

const stepOptimizer = () => {
    for (let i = 0; i < SPIN_AMOUNT; i++) {}
}

const runOptimizer = () => {
    while (counter != 1000) {
        stepOptimizer();
        counter++;
        if (Atomics.exchange(progressUpdate, 0, 0)) {
            postMessage({counter: counter, finished: false})
        }
    }
    postMessage({counter: counter, finished: true})
}

onmessage = (data: MessageEvent<MainMsg>) => {
    switch (data.data.type) {
        case MainMsgType.SendArray:
            progressUpdate = new Int8Array(data.data.sab!);
            break;
        case MainMsgType.Compile:
            counter = 0;
            Atomics.store(progressUpdate, 0, 0);
            runOptimizer();
            break;
    }
}
