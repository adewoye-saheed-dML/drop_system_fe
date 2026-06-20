import { useEffect, useState } from 'react';

interface Props {
  expiresAt: string;
}

export default function Countdown({
  expiresAt,
}: Props) {

  const calculateTimeLeft = () => {

    const difference =
      new Date(expiresAt).getTime()
      -
      new Date().getTime();

    if (difference <= 0) {
      return 0;
    }

    return Math.floor(
      difference / 1000,
    );
  };


  const [seconds, setSeconds] =
    useState(
      calculateTimeLeft(),
    );


  useEffect(() => {

    const timer =
      setInterval(() => {

        setSeconds(
          calculateTimeLeft(),
        );

      }, 1000);


    return () =>
      clearInterval(timer);

  }, [expiresAt]);


  const minutes =
    Math.floor(seconds / 60);

  const remainingSeconds =
    seconds % 60;


  return (
    <div className="mt-4 text-lg font-bold">

      Time remaining:

      <span className="ml-2 text-red-600">

        {minutes}:
        {remainingSeconds
          .toString()
          .padStart(2, '0')
        }

      </span>

    </div>
  );
}