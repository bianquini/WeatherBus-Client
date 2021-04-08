import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Route } from 'src/app/interfaces/route';

const url = 'http://localhost:8080';

@Injectable({
  providedIn: 'root',
})
export class BusService {
  constructor(private http: HttpClient) {}

  public getRoutes(): Observable<Route[]> {
    var response = this.http.get<Route[]>(`${url}/bus/getRoutes`);
    return response;
  }

  public getFullRoute(routeId: string): Observable<Route> {
    return this.http.get<Route>(`${url}/bus/getFullRoute/${routeId}`);
  }
}
