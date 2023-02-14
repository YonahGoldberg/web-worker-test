import { useState, useEffect, useRef } from 'react';
import './App.css';
import { WorkerMsg, MainMsgType } from './message';
import Worker from './worker?worker';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function App() {
  const [counter, setCounter] = useState(0);
  const [intervalAmount, setIntervalAmount] = useState<number>(0);
  const worker = useRef<Worker>(new Worker());
  const timerID = useRef<undefined | number>(undefined);
  const checkUpdates = useRef<undefined | Int8Array>(undefined)

  useEffect(() => {
    const sab = new SharedArrayBuffer(1);
    checkUpdates.current = new Int8Array(sab);

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
    worker.current.postMessage({ type: MainMsgType.Compile, undefined });
    clearInterval(timerID.current);
    timerID.current = setInterval(() => {
      worker.current.postMessage({ type: MainMsgType.ProgressUpdate});
      Atomics.store(checkUpdates.current!, 0, 1);
    }, intervalAmount);
  };

  return (
    <div className="App">
      <p>{`Counter: ${counter}`}</p>
      <button onClick={onClick}>
        Compile Diagram
      </button>

      <p>{`Interval Amount: ${intervalAmount}`}</p>

      <Slider 
        min={0} 
        max={1000} 
        onChange={(num) => {
          if (!Array.isArray(num)) {
            setIntervalAmount(num)
          }
        }}
        style={{ marginTop: 10}}   
      />
    </div>
  )
}

export default App
