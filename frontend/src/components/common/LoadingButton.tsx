import React, { FC, useEffect, useState } from "react";
import { Button, ButtonProps } from "@mui/material";
import Countdown from "./CountDown";

interface LoadingButtonProps extends ButtonProps {
  isLoading: boolean;
  access_limit?: number;
  access_name?: string;
}

const LoadingButton: FC<LoadingButtonProps> = ({
  type,
  className,
  children,
  isLoading,
  access_limit,
  access_name,
  ...rest
}) => {
  const [isStartDelay, setIsStartDelay] = useState(false);
  const [delay, setDelay] = useState<number>(0);
  const [limit, setlimit] = useState<number>(access_limit ?? 5);
  const limit_key = `${access_name}_limit`;
  const access_time_key = `${access_name}_limit_delay`;
  useEffect(() => {
    if (access_limit && access_name) {
      if (limit == 0) {
        setIsStartDelay(true);
        setDelay(60);
        const new_time = new Date(new Date().getTime() + 60000);
        sessionStorage.setItem(access_time_key, new_time.toISOString());
      }
      if (limit != 0) {
        setIsStartDelay(false);
      }
      sessionStorage.setItem(limit_key, limit.toString());
    }
  }, [limit]);
  useEffect(() => {
    if (access_limit && access_name) {
      if (delay == 0 && isStartDelay) {
        setIsStartDelay(false);
        setlimit(access_limit);
      }
    }
  }, [delay]);
  useEffect(() => {
    if (access_limit && access_name) {
      const session_limit = sessionStorage.getItem(limit_key);
      const current_limit =
        session_limit != undefined ? +session_limit : access_limit;
      const session_access_time = sessionStorage.getItem(access_time_key);
      const current_access_time =
        session_access_time != undefined
          ? new Date(session_access_time)
          : new Date();
      const now = new Date();

      if (now < current_access_time) {
        if (current_limit) {
          setlimit(current_limit);
        }
        const differenceInSeconds = Math.floor(
          (current_access_time.getTime() - now.getTime()) / 1000
        );
        setDelay(differenceInSeconds);
        setIsStartDelay(true);
      }
    }
  }, []);
  function onClick() {
    if (access_limit && access_name) {
      setlimit((prev) => prev - 1);
    }
  }
  console.log(isLoading || isStartDelay);
  return (
    <button
      disabled={isLoading || isStartDelay}
      type={type}
      style={{
        position: "relative",
      }}
      className={className}
      {...rest}
      onClick={onClick}
    >
      {isStartDelay && <Countdown seconds={delay} setSeconds={setDelay} />}
      <span className={isLoading ? "hide-btn-text" : ""}>
        {!isStartDelay && children}
      </span>
      {isLoading && <span className="btn-loading"></span>}
    </button>
  );
};

export default LoadingButton;
