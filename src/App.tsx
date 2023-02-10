import { useState, useMemo, useEffect, useRef } from 'react';
import './App.css';
import { WorkerMsg, MainMsg } from './message';
import Worker from './worker?worker';

const expensiveOperation = () => {
  for (let i = 0; i < 1000; i++) {}
}

function App() {
  const [counter, setCounter] = useState(0);
  const worker = useRef<undefined | Worker>(undefined);
  const timerID = useRef<undefined | number>(undefined);


  const onClick = () => {
    console.log('in on click');
    if (worker.current) {
      worker.current.terminate();
    }
    
    worker.current = new Worker();
    worker.current.onmessage = (e: MessageEvent<WorkerMsg>) => {
      const msg = e.data;
      if (msg.finished) {
        setCounter(msg.counter);
        clearInterval(timerID.current);
      } else {
        console.log('setting counter: ' + msg.counter);
        setCounter(msg.counter);
      }
    }  

    worker.current.postMessage(MainMsg.Compile);
    console.log('waiting');
    timerID.current = setInterval(() => {
      worker.current!.postMessage(MainMsg.GetStatus);
    });
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
