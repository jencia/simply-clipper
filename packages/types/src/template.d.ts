import { IElement } from './element';

export interface ITemplate {
  elements: IElement[];
  tracks: ITrack[];
  version: string;
}
