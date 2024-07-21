import { FC } from 'react';
import styles from './style.module.less';
import ResourceList from '../ResourceList';
import Player from '../Player';
import Timeline from '../Timeline';
import { useDraggerStore } from '@app/store';
import Segment from '../Timeline/segment';

const Layout: FC = () => {
  const { dragData, isEnterTimeline } = useDraggerStore();

  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <div className={styles.logo}>Logo</div>
        <div className={styles.title}>时间轴示例</div>
        <div className={styles.action}>
          <div className={styles.btn}>导出</div>
        </div>
      </div>
      <div className={styles.left}>
        <ResourceList />
      </div>
      <div className={styles.right}>
        <div className={styles.playerContainer}>
          <Player />
        </div>
        <div className={styles.timelineContainer}>
          <Timeline />
        </div>
      </div>
      {dragData &&
        dragData.from === 'material' &&
        (isEnterTimeline ? (
          <Segment element={dragData.element} />
        ) : (
          <div
            className={styles.dragBox}
            style={{ transform: `translate(${dragData.x}px, ${dragData.y}px)` }}
          >
            <img src={dragData.element.thumbnail} />
          </div>
        ))}
    </div>
  );
};

export default Layout;
