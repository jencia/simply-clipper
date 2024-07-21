import { FC } from 'react';
import styles from './style.module.less';
import {
  useDraggerStore,
  useElementStore,
  usePlayerStore,
  useTrackStore,
  useViewportStore,
} from '@app/store';
import cx from 'classnames';
import MediaIcon from '../../components//MediaIcon';
import Tracker from './Tracker';

const Timeline: FC = () => {
  const zoom = useViewportStore(state => state.zoom);
  const tracks = useTrackStore(state => state.list);
  const currentTime = usePlayerStore(state => state.currentTime);
  const { setCurrentElement } = useElementStore();
  const { dragging, hoverTrackIdx, setHoverTrackIdx } = useDraggerStore();

  // 空轨道
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

  // 鼠标移入
  function handleMouseEnter(index: number) {
    dragging && setHoverTrackIdx(index);
  }

  return (
    <div className={styles.timeline} onClick={() => setCurrentElement(null)}>
      {/* 上方空白区域 */}
      <div className={styles.blank} onMouseEnter={() => handleMouseEnter(tracks.length - 0.5)} />

      {/* 轨道列表 */}
      {[...tracks].reverse().map((item, i, arr) => (
        <div key={item.id}>
          <div
            className={cx([
              styles.gap,
              { [styles.dragging]: hoverTrackIdx === arr.length - i - 0.5 },
            ])}
            onMouseEnter={() => {
              handleMouseEnter(arr.length - i - 0.5);
            }}
          />
          <Tracker track={item} index={arr.length - i - 1} />
        </div>
      ))}

      {/* 下方空白区域 */}
      <div className={styles.blank} onMouseEnter={() => handleMouseEnter(0)} />

      {/* 游标 */}
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
