import { Route } from "./route";
import { Stop } from "./stop";

export interface Point {
  id:number;
  sequenceNumber: number;
  isBusStop:boolean;
  lat:number;
  lon:number;
  route:Route;
  stop:Stop;
}
