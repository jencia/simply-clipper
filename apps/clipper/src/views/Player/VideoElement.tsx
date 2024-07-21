import { usePlayerStore } from '@app/store';
import { IElement } from '@app/types';
import { useEffect, useRef } from 'react';

const VideoElement: React.FC<{ data: IElement }> = ({ data }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const player = usePlayerStore();

  /** 当前指针是否在片段范围内 */
  const inRange =
    player.currentTime >= data.delay && player.currentTime <= data.delay + data.duration;

  const getTime = () => player.currentTime - data.delay + data.startTime;

  useEffect(() => {
    if (!videoRef.current || !inRange) return;
    videoRef.current.currentTime = getTime() / 1000;
    // 播放
    if (player.playing) {
      if (videoRef.current.currentTime === data.duration / 1000) {
        videoRef.current.currentTime = 0;
      }
      videoRef.current.play();
    }
    // 暂停
    else {
      videoRef.current.pause();
    }
  }, [player.playing, inRange]);

  useEffect(() => {
    if (player.playing || !videoRef.current) return;
    videoRef.current.currentTime = getTime() / 1000;
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
