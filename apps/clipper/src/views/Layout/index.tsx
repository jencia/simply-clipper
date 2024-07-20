import { FC } from 'react';
import styles from './style.module.less';
import ResourceList from '../ResourceList';
import Player from '../Player';
import Timeline from '../Timeline';

const Layout: FC = () => {
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
    </div>
  );
};

export default Layout;
