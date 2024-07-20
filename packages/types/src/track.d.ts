export interface ITrack {
  id: string;

  /** 元素类型 */
  type: string;

  /** 存放在当前轨道下的元素 id */
  elementIds: string[];
}
