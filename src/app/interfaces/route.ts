import { Bus } from './bus';
import { Point } from './point';

export interface Route {
  id: string;
  name: string;
  direction: string;
  bus: Bus;
  points: Point[];
}
