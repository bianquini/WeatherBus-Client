import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Route } from 'src/app/interfaces/route';

@Injectable({
  providedIn: 'root'
})
export class BusService {

  constructor(private http: HttpClient) { }

  public getBusLines(): Observable<Route>{
    return this.http.get<Route>('https://buses/bus/getRoutes');
  }
}
