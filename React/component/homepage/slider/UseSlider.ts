import { useState, useEffect, useCallback } from "react";

interface UseSliderOptions {
  total: number;
  interval?: number;
  autoPlay?: boolean;
}

export const useSlider = ({
  total,
  interval = 4000,
  autoPlay = true,
}: UseSliderOptions) => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? "next" : "prev");
      setCurrent(index);
    },
    [current],
  );

  const goNext = useCallback(() => {
    setDirection("next");
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setDirection("prev");
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (!autoPlay || isPaused) return;
    const timer = setInterval(goNext, interval);
    return () => clearInterval(timer);
  }, [autoPlay, isPaused, interval, goNext]);

  return { current, direction, goTo, goNext, goPrev, setIsPaused };
};
