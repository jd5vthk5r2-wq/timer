export const durationToSeconds = (duration: {
  hours?: number;
  minutes?: number;
  seconds?: number;
}): number => {
  return (
    (duration.hours || 0) * 3600 +
    (duration.minutes || 0) * 60 +
    (duration.seconds || 0)
  );
};
