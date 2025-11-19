import { useEffect, useState } from 'react';

export const useBattery = () => {
  const [battery, setBattery] = useState(87);

  useEffect(() => {
    const interval = setInterval(() => {
      setBattery((prev) => {
        const next = prev - 1;
        return next <= 5 ? 95 : next;
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return battery;
};
