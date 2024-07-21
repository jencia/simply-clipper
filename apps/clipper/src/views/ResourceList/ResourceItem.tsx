import styles from './style.module.less';
import { IMaterial } from './mock';
import { formatTime } from '../../utils/transform';
import { useDraggerStore, useElementStore, useTrackStore } from '@app/store';
import { v4 as uuidV4 } from 'uuid';
import { useRef } from 'react';

export default function ResourceItem({ material }: { material: IMaterial }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { addElement } = useElementStore();
  const { addTrack } = useTrackStore();
  const { setDragging, setDragData, setHoverTrackIdx } = useDraggerStore();

  function createElement(data: IMaterial) {
    return {
      id: uuidV4(),
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
    };
  }

  function handleAdd(data: IMaterial) {
    const el = createElement(data);
    addElement(el);
    addTrack({
      id: uuidV4(),
      elementIds: [el.id],
      type: 'video',
    });
  }

  function dragMaterial(downEvent: React.MouseEvent<HTMLDivElement>) {
    const sx = downEvent.clientX;
    const sy = downEvent.clientY;
    const element = createElement(material);
    const { offsetLeft, offsetTop } = containerRef.current!;

    const onMouseMove = (moveEvent: MouseEvent) => {
      setDragging(true);
      const dx = moveEvent.clientX - sx;
      const dy = moveEvent.clientY - sy;
      setDragData({
        element,
        delay: 0,
        x: offsetLeft + dx,
        y: offsetTop + 48 + dy,
        from: 'material',
      });

      const trackIdx = useDraggerStore.getState().hoverTrackIdx;

      if (Math.floor(trackIdx) === trackIdx) {
        setHoverTrackIdx(trackIdx + 0.5);
      }
    };
    const onMouseUp = () => {
      const { hoverTrackIdx: trackIdx, isEnterTimeline } = useDraggerStore.getState();

      if (isEnterTimeline) {
        addElement(element);
        addTrack(
          {
            id: uuidV4(),
            type: 'video',
            elementIds: [element.id],
          },
          Math.floor(trackIdx + 1)
        );
      }

      setDragging(false);
      setDragData(null);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  return (
    <div
      ref={containerRef}
      className={styles.resourceItem}
      key={material.id}
      onMouseDown={dragMaterial}
    >
      <img src={material.thumbnail} alt={material.name} />
      <div className={styles.duration}>{formatTime(material.duration)}</div>
      <div className={styles.addBtn} onClick={() => handleAdd(material)}>
        ＋
      </div>
    </div>
  );
}
