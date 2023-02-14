import { useState, useEffect, useRef } from 'react';
import './App.css';
import { WorkerMsg, MainMsgType } from './message';
import Worker from './worker?worker';

const INTERVAL_AMOUNT = 200;

function App() {
  const [counter, setCounter] = useState(0);
  const worker = useRef<Worker>(new Worker());
  const timerID = useRef<undefined | number>(undefined);
  const progressUpdate = useRef<undefined | Int8Array>(undefined)

  useEffect(() => {
    const sab = new SharedArrayBuffer(1);
    progressUpdate.current = new Int8Array(sab);

    worker.current.onmessage = (e: MessageEvent<WorkerMsg>) => {
      const msg = e.data;
      setCounter(msg.counter);
      if (msg.finished) {
        clearInterval(timerID.current);
      }
    }
    worker.current.postMessage({ type : MainMsgType.SendArray, sab })
  }, [])

  const onClick = () => {
    worker.current.postMessage({ type : MainMsgType.Compile, undefined });
    timerID.current = setInterval(() => {
      Atomics.store(progressUpdate.current!, 0, 1);
    }, INTERVAL_AMOUNT);
  };

  return (
    <div className="App">
      <p>{counter}</p>
      <button onClick={onClick}>
        Compile Diagram
      </button>
    </div>
  )
}

export default App
