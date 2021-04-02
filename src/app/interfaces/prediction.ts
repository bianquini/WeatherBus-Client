import { Bus } from "./bus";
import { Stop } from "./stop";

export interface Prediction{
  id: number;
  timestamp: Date;
  distanceToDestination: number;
  bus: Bus;
  stop: Stop;

}
