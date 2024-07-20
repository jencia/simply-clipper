export interface IElement {
  id: string;
  /** 元素类型 */
  type: string;
  /** 元素地址 */
  url: string;
  /** 元素名称 */
  name: string;

  /** 资源原始宽度 */
  naturalWidth: number;
  /** 资源原始高度 */
  naturalHeight: number;
  /** 资源原始时长 */
  naturalDuration: number;

  /** 当前宽度 */
  width: number;
  /** 当前高度 */
  height: number;

  /** 开始时间 */
  delay: number;
  /** 时长 */
  duration: number;
  
  /** 媒体开始时间 */
  startTime: number;
  /** 媒体结束时间 */
  endTime: number;
}
