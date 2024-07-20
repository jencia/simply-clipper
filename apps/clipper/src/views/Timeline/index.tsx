import { FC } from 'react';
import styles from './style.module.less';
import { useElementStore, usePlayerStore, useTrackStore } from '@app/store';
import cx from 'classnames';
import { formatTime } from '../../utils/transform';
import MediaIcon from '../../components//MediaIcon';

// 目前缩放比例先写死
const zoom = 15;

const Timeline: FC = () => {
  const tracks = useTrackStore(state => state.list);
  const currentTime = usePlayerStore(state => state.currentTime);
  const { list: elements, current: currentElement, setCurrentElement } = useElementStore();
  const maxDuration = useElementStore(state =>
    state.list.reduce((prev, curr) => Math.max(prev, curr.delay + curr.duration), 0)
  );

  if (tracks.length === 0) {
    return (
      <div className={styles.emptyTrack}>
        <div className={styles.wrapper}>
          <div className={styles.icon}>
            <MediaIcon />
          </div>
          将素材拖拽到这里，开启你的大作吧~
        </div>
      </div>
    );
  }

  return (
    <div className={styles.timeline}>
      {tracks.map(item => (
        <div className={styles.track} key={item.id} style={{ width: maxDuration / zoom + 80 }}>
          <div className={styles.type}>
            <MediaIcon />
          </div>
          <div className={styles.segments}>
            {elements
              .filter(el => item.elementIds.includes(el.id))
              .map(el => (
                <div
                  key={el.id}
                  className={cx([
                    styles.segment,
                    { [styles.active]: el.id === currentElement?.id },
                  ])}
                  style={{
                    transform: `translateX(${el.delay / zoom}px)`,
                    width: el.duration / zoom,
                    backgroundImage: `url(${el.thumbnail})`,
                  }}
                  onClick={() => setCurrentElement(el)}
                >
                  <div className={styles.duration}>{formatTime(el.duration)}</div>
                  <div className={cx([styles.bar, styles.barLeft])} />
                  <div className={cx([styles.bar, styles.barRight])} />
                </div>
              ))}
          </div>
        </div>
      ))}
      <div
        className={styles.playCursor}
        style={{ transform: `translateX(${currentTime / zoom}px)` }}
      >
        <div className={styles.playCursorBar} />
      </div>
    </div>
  );
};

export default Timeline;
