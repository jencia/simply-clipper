import { FC, useEffect } from 'react';
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
  const { list: tracks, removeTrack } = useTrackStore();
  const { currentTime, setCurrentTime } = usePlayerStore();
  const { setCurrentElement, removeElement } = useElementStore();
  const { dragging, hoverTrackIdx, setHoverTrackIdx, setIsEnterTimeline } = useDraggerStore();

  function dragCursor(downEvent: React.MouseEvent<HTMLDivElement>) {
    const sx = downEvent.clientX;
    const originTime = currentTime;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - sx;
      setCurrentTime(Math.max(originTime + dx * zoom, 0));
    };
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  // 鼠标移入
  function handleMouseEnter(index: number) {
    dragging && setHoverTrackIdx(index);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { current: currentElement } = useElementStore.getState();
      const { list: trackList } = useTrackStore.getState();
      if (!currentElement || e.key !== 'Delete') return;

      trackList.forEach(track => {
        track.elementIds = track.elementIds.filter(id => currentElement.id !== id);
        if (track.elementIds.length === 0) {
          removeTrack(track.id);
        }
      });
      removeElement(currentElement.id);
      setCurrentElement(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      className={styles.timeline}
      onMouseEnter={() => setIsEnterTimeline(true)}
      onMouseLeave={() => setIsEnterTimeline(false)}
    >
      {tracks.length === 0 ? (
        // 空轨道
        <div className={styles.emptyTrack}>
          <div className={styles.wrapper}>
            <div className={styles.icon}>
              <MediaIcon />
            </div>
            将素材拖拽到这里，开启你的大作吧~
          </div>
        </div>
      ) : (
        <>
          {/* 上方空白区域 */}
          <div
            className={styles.blank}
            onMouseEnter={() => handleMouseEnter(tracks.length - 0.5)}
            onClick={() => setCurrentElement(null)}
          />

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
          <div
            className={styles.blank}
            onMouseEnter={() => handleMouseEnter(0)}
            onClick={() => setCurrentElement(null)}
          />

          {/* 游标 */}
          <div
            className={styles.playCursor}
            style={{ transform: `translateX(${currentTime / zoom}px)` }}
            onMouseDown={dragCursor}
          >
            <div className={styles.playCursorBar} />
          </div>
        </>
      )}
    </div>
  );
};

export default Timeline;
