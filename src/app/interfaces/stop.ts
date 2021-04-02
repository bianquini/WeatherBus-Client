import { Bus } from "./bus";
import { Point } from "./point";
import { Prediction } from "./prediction";

export interface Stop{
  id:number;
  name:string;
  lat:number;
  lon:number;
  bus:Bus;
  point:Point;
  prediction:Prediction;
}
