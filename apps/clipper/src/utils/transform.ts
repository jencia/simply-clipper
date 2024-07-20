export function formatTime(duration: number, showRange: 'h' | 'm' | 's' = 'm') {
  const HH = String(Math.floor(duration / 1000 / 60 / 60) % 60).padStart(2, '0');
  const mm = String(Math.floor(duration / 1000 / 60) % 60).padStart(2, '0');
  const ss = String(Math.floor(duration / 1000) % 60).padStart(2, '0');

  if (showRange === 's') {
    return ss;
  }
  if (showRange === 'm') {
    return `${mm}:${ss}`;
  }
  return `${HH}:${mm}:${ss}`;
}
