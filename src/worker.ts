import { MainMsg } from './message';


const SPIN_AMOUNT = 100;
let getStatus = true;

const stepOptimizer = () => {
    for (let i = 0; i < SPIN_AMOUNT; i++) {
        console.log('wasting time');
    }
}

const runOptimizer = () => {
    let counter = 0;
    while (counter != 1000) {
        stepOptimizer();
        if (getStatus) {
            postMessage({counter, finished: false});
            getStatus = false;
        }
        counter++;
        console.log(counter);
    }
    postMessage({counter: counter, finished: true})
}

onmessage = (data: MessageEvent<MainMsg>) => {
    console.log('received message');
    if (data.data === MainMsg.Compile) {
        runOptimizer();
    } else if (data.data === MainMsg.GetStatus) {
        getStatus = true;
    }
}
