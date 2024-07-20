import { IElement } from '@app/types';

export function test(el: Partial<IElement>) {
  return el.delay;
}
