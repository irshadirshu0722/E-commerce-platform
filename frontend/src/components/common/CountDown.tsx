import React, { useEffect } from "react";

interface CountdownProps {
  seconds: number;
  setSeconds: React.Dispatch<React.SetStateAction<number>>;
}

const Countdown: React.FC<CountdownProps> = ({ seconds, setSeconds }) => {
  useEffect(() => {
    if (seconds <= 0) {
      return;
    }

    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1); // Decrease seconds by 1
    }, 1000); // Run every second

    // Cleanup function to clear the interval when component unmounts or when seconds reach 0
    return () => clearInterval(intervalId);
  }, [seconds, setSeconds]); // Run effect whenever 'seconds' state or 'setSeconds' function changes

  return <span className="count-down-val">{seconds}s</span>;
};

export default Countdown;
