import { useState, useMemo, useEffect, useRef } from 'react';
import './App.css';
import { WorkerMsg, MainMsg } from './message';

const expensiveOperation = () => {
  for (let i = 0; i < 1000; i++) {}
}

function App() {
  const [counter, setCounter] = useState(0);
  const isCompiling = useRef(false);
  const worker = useMemo(() => new Worker('./worker.ts'), []);
  useEffect(() => {
    console.log('hi');
    worker.onmessage = (e: MessageEvent<WorkerMsg>) => {
      console.log('hi');
      const msg = e.data;
      if (msg.finished) {
        isCompiling.current = false;
      } else {
        setCounter(msg.counter);
      }
    }  
  }, [worker])

  const onClick = () => {
    isCompiling.current = true;
    worker.postMessage(MainMsg.Compile);
    while (isCompiling.current) {
      console.log('hey');
      expensiveOperation();
      worker.postMessage(MainMsg.GetStatus);
    }
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
