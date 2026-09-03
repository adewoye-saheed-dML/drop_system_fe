import {
  useEffect,
  useState,
} from 'react';

interface Props {
  expiresAt: string;
  onExpired?: () => void;
}

function getSecondsRemaining(
  expiresAt: string,
): number {
  const difference =
    new Date(expiresAt).getTime() -
    Date.now();

  if (difference <= 0) {
    return 0;
  }

  return Math.floor(
    difference / 1000,
  );
}

export default function Countdown({
  expiresAt,
  onExpired,
}: Props) {
  const [seconds, setSeconds] =
    useState(() =>
      getSecondsRemaining(expiresAt),
    );

  useEffect(() => {
    const update = () => {
      const remaining =
        getSecondsRemaining(expiresAt);

      setSeconds(remaining);

      if (remaining === 0) {
        onExpired?.();
      }
    };

    update();

    const timer = window.setInterval(
      update,
      1000,
    );

    return () =>
      window.clearInterval(timer);
  }, [
    expiresAt,
    onExpired,
  ]);

  const minutes =
    Math.floor(seconds / 60);

  const remainingSeconds =
    seconds % 60;

  const expired = seconds === 0;

  return (
    <div className="mt-5 rounded-lg bg-gray-100 p-4">
      <p className="text-sm text-gray-500">
        Reservation time remaining
      </p>

      <p
        className={`mt-1 text-2xl font-bold ${
          expired
            ? 'text-red-600'
            : 'text-gray-900'
        }`}
      >
        {expired
          ? 'Expired'
          : `${minutes}:${remainingSeconds
              .toString()
              .padStart(2, '0')}`}
      </p>
    </div>
  );
}