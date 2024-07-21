import { FC } from 'react';
import styles from './style.module.less';
import { materials } from './mock';
import ResourceItem from './ResourceItem';

const ResourceList: FC = () => {
  return (
    <div className={styles.resourceList}>
      {materials.map(material => (
        <ResourceItem key={material.id} material={material} />
      ))}
    </div>
  );
};

export default ResourceList;
