import { MainMsg, WorkerMsg } from './message';

const SPIN_AMOUNT = 1000;
let should_spin = true;
let getStatus = true;

const stepOptimizer = () => {
    for (let i = 0; i < SPIN_AMOUNT; i++) {}
}

const runOptimizer = () => {
    console.log('in runOptimizer');
    let counter = 0;
    should_spin = true;
    while (counter != 10) {
        stepOptimizer();
        if (getStatus) {
            postMessage({counter, finished: false});
            getStatus = false;
        }
        counter++;
        if (!should_spin) {
            return;
        }
    }
    postMessage({counter: -1, finished: true})
}

onmessage = (data: MessageEvent<MainMsg>) => {
    console.log('received message');
    if (data.data === MainMsg.Compile) {
        should_spin = false; // probably won't stop an existing runOptimizer call
        runOptimizer();
    } else if (data.data === MainMsg.GetStatus) {
        getStatus = true;
    }
}
