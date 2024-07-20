import { FC } from 'react';
import styles from './style.module.less';
import { useElementStore, useTrackStore } from '@app/store';
import cx from 'classnames';
import { formatTime } from '../../utils/transform';

// 目前缩放比例先写死
const zoom = 15;

const Timeline: FC = () => {
  const track = useTrackStore();
  const elements = useElementStore(state => state.list);
  const maxDuration = useElementStore(state =>
    state.list.reduce((prev, curr) => Math.max(prev, curr.delay + curr.duration), 0)
  );

  return (
    <div className={styles.timeline}>
      {track.list.map(item => (
        <div className={styles.track} key={item.id} style={{ width: maxDuration / zoom + 80 }}>
          <div className={styles.type}>
            <svg width="1em" height="1em" viewBox="0 0 16 16">
              <g>
                <path
                  stroke-width="1.5"
                  d="M1.75 2.75h12.5v10.5H1.75z"
                  data-follow-stroke="currentColor"
                  stroke="currentColor"
                ></path>
                <path
                  d="M10.83 8 6.5 10.5v-5L10.83 8Z"
                  data-follow-fill="currentColor"
                  fill="currentColor"
                ></path>
              </g>
            </svg>
          </div>
          <div className={styles.segments}>
            {elements
              .filter(el => item.elementIds.includes(el.id))
              .map(el => (
                <div
                  key={el.id}
                  className={styles.segment}
                  style={{
                    transform: `translateX(${el.delay / zoom}px)`,
                    width: el.duration / zoom,
                    backgroundImage: `url(${el.thumbnail})`,
                  }}
                >
                  <div className={styles.duration}>{formatTime(el.duration)}</div>
                  <div className={cx([styles.bar, styles.barLeft])} />
                  <div className={cx([styles.bar, styles.barRight])} />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
