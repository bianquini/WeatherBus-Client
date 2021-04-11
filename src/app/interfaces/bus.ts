import { Prediction } from "./prediction";

export interface Bus {

  Id: number;

  Timestamp: Date;

  Lat: number;

  Lon: number;

  Destination: string;

  IsDelayed: boolean;

  predictions: Prediction[];
}
