import { useState, useEffect, useRef } from 'react';
import './App.css';
import { WorkerMsg, MainMsgType, Color, WorkerMsgType, MainMsg, colorToString } from './message';
import Worker from './worker?worker';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface Counter {
  counter: number,
  color: Color,
}

function App() {
  const [counter, setCounter] = useState<Counter>({ counter: 0, color: Color.Red });
  const [intervalAmount, setIntervalAmount] = useState<number>(0);
  const worker = useRef<Worker>(new Worker());
  const timerID = useRef<undefined | number>(undefined);
  const nextTrioToCompile = useRef<Color>(Color.Red);
  const workerSentUpdate = useRef<boolean>(true);
  const workerFinished = useRef<boolean>(true);
  const mainWaitingToSendTrio = useRef<boolean>(false)
  // First index is if main wants an update, second index is if main wants to compile
  // a new trio
  const sharedMemory = useRef<undefined | Int8Array>(undefined)

  const nextTrio = () => {
    switch (nextTrioToCompile.current) {
      case Color.Red: 
        nextTrioToCompile.current = Color.Yellow
        break;
      case Color.Yellow: 
        nextTrioToCompile.current = Color.Green
        break;
      case Color.Green: 
        nextTrioToCompile.current = Color.Blue
        break;
      case Color.Blue: 
        nextTrioToCompile.current = Color.Purple
        break;
      case Color.Purple: 
        nextTrioToCompile.current = Color.Red
        break;
    }
  }

  const askForUpdate = () => {
    // If already waiting for a worker to send an update, do nothing
    if (!workerSentUpdate.current) {
      console.log("waiting for update");
    }
    if (workerSentUpdate.current) {
      console.log("asking for update");
      workerSentUpdate.current = false;
      Atomics.store(sharedMemory.current!, 0, 1)
    }
  }

  const sendTrio = () => {
    const mainMsg: MainMsg = {
      type: MainMsgType.Compile,
      sab: undefined,
      trio: nextTrioToCompile.current,
    }
    worker.current.postMessage(mainMsg);
    console.log("setting interval: " + intervalAmount);
    timerID.current = setInterval(askForUpdate, intervalAmount);
  }

  useEffect(() => {
    const sab = new SharedArrayBuffer(2);
    sharedMemory.current = new Int8Array(sab);
    const mainMsg: MainMsg = {
      type: MainMsgType.SendSharedMemory,
      sab,
      trio: undefined
    }
    worker.current.postMessage(mainMsg);
  }, []);

  worker.current.onmessage = (e: MessageEvent<WorkerMsg>) => {
    const msg = e.data;
    switch (msg.type) {
      case WorkerMsgType.Finished: 
        workerFinished.current = true;
        setCounter({ counter: msg.counter!, color: msg.trio! })
        clearInterval(timerID.current!);
        console.log("worker finished");
        break;
      case WorkerMsgType.Update:
        console.log("received update");
        setCounter({ counter: msg.counter!, color: msg.trio! });
        console.log(colorToString(msg.trio!));
        workerSentUpdate.current = true;
        break;
      case WorkerMsgType.ReadyForNewTrio:
        console.log("sending new trio");
        mainWaitingToSendTrio.current = false;
        sendTrio();
        break;
    }
  }

  const onClick = () => {
    nextTrio();
    if (workerFinished.current) {
      console.log("sending new trio");
      workerFinished.current = false;
      sendTrio();
    } else {
      console.log("main waiting for worker to be ready to compile again");
      if (!mainWaitingToSendTrio.current) {
        console.log("main telling worker to stop working and wait for new trio");
        clearInterval(timerID.current!);
        mainWaitingToSendTrio.current = true;
        Atomics.store(sharedMemory.current!, 1, 1);
      }
    }
  };

  return (
    <div className="App">
      <p style={{ color: colorToString(counter.color) }}>{`Counter: ${counter.counter}`}</p>
      <button onClick={onClick}>
        Compile Diagram
      </button>
      <p>{`Interval Amount: ${intervalAmount}`}</p>
      <Slider 
        min={0} 
        max={1000} 
        onChange={(num) => {
          if (!Array.isArray(num)) {
            console.log("setting interval amount in onChange: " + num);
            setIntervalAmount(num)
          }
        }}
        style={{ marginTop: 10}}   
      />
    </div>
  )
}

export default App
