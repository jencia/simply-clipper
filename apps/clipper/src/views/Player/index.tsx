import { FC, useEffect, useRef } from 'react';
import styles from './style.module.less';
import { useElementStore, usePlayerStore } from '@app/store';
import VideoElement from './VideoElement';
import { formatTime } from '../../utils/transform';
import cx from 'classnames';

const Player: FC = () => {
  const elements = useElementStore(state => state.list);
  const maxDuration = useElementStore(state =>
    state.list.reduce((prev, el) => Math.max(prev, el.delay + el.duration), 0)
  );
  const player = usePlayerStore();
  const playTaskRef = useRef<number>();
  const disabled = maxDuration === 0;

  function runPlay(time: number) {
    let nextTime = time + 1000 / 60;
    nextTime = Math.max(0, Math.min(maxDuration, nextTime));
    player.setCurrentTime(nextTime);

    if (nextTime >= maxDuration) {
      player.pause();
      return;
    }
    playTaskRef.current = requestAnimationFrame(() => runPlay(nextTime));
  }

  useEffect(() => {
    if (player.playing) {
      runPlay(player.currentTime >= maxDuration ? 0 : player.currentTime);
      return;
    }
    const cancel = () => {
      playTaskRef.current && cancelAnimationFrame(playTaskRef.current);
    };
    cancel();

    return cancel;
  }, [player.playing]);

  return (
    <div className={styles.player}>
      <div className={styles.title}>播放器</div>
      <div className={styles.scene}>
        {elements.map(el => (
          <VideoElement data={el} key={el.id} />
        ))}
      </div>
      <div className={styles.controls}>
        <div className={styles.time}>
          <div className={styles.currentTime}>{formatTime(player.currentTime, 'h')}</div>
          <div className={styles.separator}>/</div>
          <div className={styles.duration}>{formatTime(maxDuration, 'h')}</div>
        </div>
        <div className={cx([styles.playControl, { [styles.disabled]: disabled }])}>
          {!player.playing ? (
            <div className={styles.playIcon} onClick={() => !disabled && player.play()} />
          ) : (
            <div className={styles.pauseIcon} onClick={() => !disabled && player.pause()} />
          )}
        </div>
        <div className={styles.action}></div>
      </div>
    </div>
  );
};

export default Player;
