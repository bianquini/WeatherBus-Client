import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Weather } from 'src/app/interfaces/weather';

const url = 'http://localhost:8080';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  public getCurrentWeather(): Observable<Weather> {
    var response = this.http.get<Weather>(`${url}/weather/getCurrentWeather`);
    return response;
  }

  public getYesterdayWeather(): Observable<Weather> {
    var response = this.http.get<Weather>(`${url}/weather/getYesterdayWeather`);
    return response;
  }
}
