import { Bus } from "./bus";
import { Point } from "./point";

export interface Route {
  id: number;
  name:string;
  direction:string;
  buses: Bus[];
  points: Point[];
}
