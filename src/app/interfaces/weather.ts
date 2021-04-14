export interface Weather {
  id: number;
  celsiusTemperature: number;
  HasPrecipitation: boolean;
  isDayTime: boolean;
  local_observation_date_time: Date;
  PrecipitationType: string;
  WeatherText: string;
}
