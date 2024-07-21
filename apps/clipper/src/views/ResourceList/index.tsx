import { FC } from 'react';
import styles from './style.module.less';
import { IMaterial, materials } from './mock';
import { formatTime } from '../../utils/transform';
import { useElementStore, useTrackStore } from '@app/store';
import { v4 as uuidV4 } from 'uuid';

const ResourceList: FC = () => {
  const { addElement } = useElementStore();
  const { addTrack } = useTrackStore();

  function handleAdd(data: IMaterial) {
    const elId = uuidV4();
    addElement({
      id: elId,
      materialId: data.id,
      delay: 0,
      duration: data.duration,
      startTime: 0,
      endTime: data.duration,
      type: 'video',
      width: data.width,
      height: data.height,
      name: data.name,
      naturalDuration: data.duration,
      naturalWidth: data.width,
      naturalHeight: data.height,
      url: data.url,
      thumbnail: data.thumbnail,
    });

    addTrack({
      id: uuidV4(),
      elementIds: [elId],
      type: 'video',
    });
  }

  return (
    <div className={styles.resourceList}>
      {materials.map(material => (
        <div className={styles.resourceItem} key={material.id}>
          <img src={material.thumbnail} alt={material.name} />
          <div className={styles.duration}>{formatTime(material.duration)}</div>
          <div className={styles.addBtn} onClick={() => handleAdd(material)}>
            ＋
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResourceList;
