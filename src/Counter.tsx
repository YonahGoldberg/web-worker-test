import React from "react";

const Counter = () => {
    const [count, setCount] = React.useState(0)
    
    const animate = () => {
        setCount(prevCount => prevCount + 1)
        requestAnimationFrame(animate);
    }
    
    React.useEffect(() => {
      requestAnimationFrame(animate);
    }, []); // Make sure the effect runs only once
    
    return <div>{count}</div>
  }

  export default Counter;