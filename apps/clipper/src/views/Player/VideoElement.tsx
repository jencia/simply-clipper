import { usePlayerStore } from '@app/store';
import { IElement } from '@app/types';
import { useEffect, useRef } from 'react';

const VideoElement: React.FC<{ data: IElement }> = ({ data }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const player = usePlayerStore();

  /** 当前指针是否在片段范围内 */
  const inRange =
    player.currentTime >= data.delay && player.currentTime <= data.delay + data.duration;

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = (player.currentTime - data.delay + data.startTime) / 1000;
  }, [player.currentTime]);

  return (
    <video
      ref={videoRef}
      style={{
        visibility: inRange ? 'visible' : 'hidden',
      }}
      src={data.url}
    ></video>
  );
};

export default VideoElement;
