import { IElement } from '@app/types';
import cx from 'classnames';
import styles from './style.module.less';
import { useDraggerStore, useElementStore, useViewportStore } from '@app/store';
import { formatTime } from '../../../utils/transform';
import { useDragSegment } from './useDragSegment';

export default function Segment({ element }: { element: IElement }) {
  const { current: currentElement } = useElementStore();
  const setCurrentElement = useElementStore(state => state.setCurrentElement);
  const { dragData } = useDraggerStore();
  const zoom = useViewportStore(state => state.zoom);

  // 当前元素是否正在拖拽
  const dragging = dragData?.element.id === element.id;

  // 是否激活片段
  const active = element.id === currentElement?.id && !dragging;

  // 当前片段的偏移值
  const x = element.delay / zoom + (dragging ? dragData.x : 0);
  const y = dragging ? dragData.y : 0;

  const { dragSegment } = useDragSegment();

  return (
    <div
      className={cx([styles.segment, { [styles.active]: active, [styles.dragging]: dragging }])}
      style={{
        transform: `translate(${x}px, ${y}px)`,
        width: element.duration / zoom,
        backgroundImage: `url(${element.thumbnail})`,
      }}
      onClick={e => {
        e.stopPropagation();
        setCurrentElement(element);
      }}
      onMouseDown={e => dragSegment(element, e)}
    >
      {/* 时长 */}
      <div className={styles.duration}>{formatTime(element.duration)}</div>
      {/* 左手柄 */}
      <div className={cx([styles.bar, styles.barLeft])} />
      {/* 右手柄 */}
      <div className={cx([styles.bar, styles.barRight])} />
    </div>
  );
}
