import { Prediction } from "./prediction";
import { Stop } from "./stop";

export interface Bus {

  Id: number;

  Timestamp: Date;

  Lat: number;

  Lon: number;

  Destination: string;

  IsDelayed: boolean;

  Stops: Stop[];

  Predictions: Prediction[];
}
