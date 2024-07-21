import { useDraggerStore, useElementStore, useViewportStore } from '@app/store';
import { ITrack } from '@app/types';
import cx from 'classnames';
import MediaIcon from '../../../components/MediaIcon';
import Segment from '../segment';
import styles from './style.module.less';

export default function Tracker({ track, index }: { track: ITrack; index: number }) {
  const elements = useElementStore(state => state.list);
  const currentElement = useElementStore(state => state.current);
  const maxDuration = useElementStore(state =>
    state.list.reduce((prev, curr) => Math.max(prev, curr.delay + curr.duration), 0)
  );
  const zoom = useViewportStore(state => state.zoom);
  const filteredElements = elements.filter(el => track.elementIds.includes(el.id));
  const { dragData, hoverTrackIdx, setHoverTrackIdx } = useDraggerStore();

  // 激活态，当前轨道存在选中元素 || 拖拽处在当前轨道
  const active = track.elementIds.includes(currentElement?.id ?? '') || hoverTrackIdx === index;

  return (
    <div
      className={cx([styles.track, { [styles.active]: active }])}
      style={{ minWidth: maxDuration / zoom + 80 }}
      onMouseEnter={() => setHoverTrackIdx(index)}
    >
      {/* 轨道左侧图标 */}
      <div className={styles.type}>
        <MediaIcon />
      </div>

      {/* 片段列表 */}
      <div className={styles.segments}>
        {/* 拖拽时的占位片段 */}
        {dragData && hoverTrackIdx === index && (
          <div
            className={styles.placeholderElement}
            style={{
              width: dragData.element.duration / zoom,
              transform: `translateX(${dragData.delay / zoom}px)`,
            }}
          />
        )}

        {/* 元素片段 */}
        {filteredElements.map(el => (
          <Segment key={el.id} element={el} />
        ))}
      </div>
    </div>
  );
}
