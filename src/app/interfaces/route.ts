import { Bus } from './bus';
import { Point } from './point';

export interface Route {
  id: string;
  name: string;
  direction: string;
  routeBus: Bus;
  points: Point[];
  weather_point: number;
}
