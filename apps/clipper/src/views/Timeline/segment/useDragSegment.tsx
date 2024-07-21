import { useDraggerStore, useElementStore, useTrackStore, useViewportStore } from '@app/store';
import { IElement } from '@app/types';
import { useRef } from 'react';
import { v4 as uuidV4 } from 'uuid';

function hasSpace(points: [number, number][], originX: number, originWidth: number) {
  for (let i = 0, len = points.length; i < len; i++) {
    const [leftPoint, rightPoint] = points[i];
    if (i === len - 1) {
      return originX >= rightPoint || originX + originWidth < leftPoint;
    }
    const [nextPoint] = points[i + 1];
    return (
      (originX >= rightPoint && originX + originWidth <= nextPoint) ||
      originX + originWidth < leftPoint
    );
  }
  return true;
}

export function useDragSegment() {
  const { list: tracks, removeTrack, pushElementId, addTrack } = useTrackStore();
  const { list: elements, updateElement } = useElementStore();
  const { setDragging, setDragData, setHoverTrackIdx } = useDraggerStore();
  const zoom = useViewportStore(state => state.zoom);
  const oldTrackIdx = useRef(-1);

  function collectElementPoints(currentElement: IElement) {
    const points: [number, number][][] = [];
    tracks.forEach(track => {
      const trackElements = elements.filter(el => track.elementIds.includes(el.id));
      const arr: [number, number][] = [];
      trackElements.forEach(el => {
        if (el.id === currentElement.id) return;
        arr.push([el.delay / zoom, (el.delay + el.duration) / zoom]);
      });
      points.push(arr);
    });
    return points;
  }

  function dragSegment(element: IElement, downEvent: React.MouseEvent<HTMLDivElement>) {
    const sx = downEvent.clientX;
    const sy = downEvent.clientY;
    const originX = element.delay / zoom;
    const originWidth = element.duration / zoom;
    let finalDelay = element.delay;
    const pointsList = collectElementPoints(element);

    oldTrackIdx.current = tracks.findIndex(track => track.elementIds.includes(element.id));

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - sx;
      const dy = moveEvent.clientY - sy;
      const currTrackIdx = useDraggerStore.getState().hoverTrackIdx;
      let newX = Math.max(originX + dx, 0);

      if (
        currTrackIdx > -1 &&
        // 不存在小数位就是在旧轨道插入
        Math.floor(currTrackIdx) === currTrackIdx &&
        // 没有空间可以放得下片段
        !hasSpace(pointsList[currTrackIdx], newX, originWidth)
      ) {
        setHoverTrackIdx(currTrackIdx + (dy > 0 ? 0.5 : -0.5));
      }

      finalDelay = newX * zoom;
      setDragging(true);
      setDragData({ element, x: dx, y: dy, delay: finalDelay, from: 'segment' });
    };
    const onMouseUp = () => {
      updateElement(element.id, { delay: finalDelay });
      applyTrackChange(element);
      setDragging(false);
      setDragData(null);

      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  // 拖拽左右手柄
  function dragBar(
    element: IElement,
    isLeft: boolean,
    downEvent: React.MouseEvent<HTMLDivElement>
  ) {
    downEvent.stopPropagation();
    const sx = downEvent.clientX;
    const originDelay = element.delay;
    const originDuration = element.duration;
    const originStartTime = element.startTime;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - sx;
      const options: Partial<IElement> = {};

      if (isLeft) {
        const offset = Math.max(originStartTime + dx * zoom, 0) - originStartTime;

        options.delay = originDelay + offset;
        options.startTime = originStartTime + offset;
        options.duration = originDuration - offset;
      } else {
        options.duration = Math.max(
          100,
          Math.min(originDuration + dx * zoom, element.naturalDuration)
        );
      }

      updateElement(element.id, options);
    };
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  // 应用变更信息
  function applyTrackChange(element: IElement) {
    const { hoverTrackIdx } = useDraggerStore.getState();
    const newTrackIdx = Math.floor(hoverTrackIdx);
    const oldTrack = tracks[oldTrackIdx.current];

    // 同轨道移动不做处理
    if (oldTrackIdx.current === hoverTrackIdx) {
      return;
    }

    // 不相等说明存在小数点，即为插入新轨道
    if (newTrackIdx !== hoverTrackIdx) {
      addTrack({ id: uuidV4(), type: 'video', elementIds: [element.id] }, newTrackIdx + 1);
    }
    // 移动到另一个轨道
    else if (newTrackIdx !== oldTrackIdx.current) {
      pushElementId(tracks[newTrackIdx].id, element.id);
    }

    // 轨道发生变化时，移除旧轨道的元素
    oldTrack.elementIds = oldTrack.elementIds.filter(id => element.id !== id);
    if (oldTrack.elementIds.length === 0) {
      removeTrack(oldTrack.id);
    }
  }

  return { dragSegment, dragBar };
}
