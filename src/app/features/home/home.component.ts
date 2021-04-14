import { Component, OnInit } from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import { BusService } from 'src/app/services/bus/bus.service';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import { Circle as CircleStyle, Fill, Stroke } from 'ol/style';
import { Route } from 'src/app/interfaces/route';
import LineString from 'ol/geom/LineString';
import Overlay from 'ol/Overlay';
import BaseLayer from 'ol/layer/Base';
import { Coordinate } from 'ol/coordinate';
import { Prediction } from 'src/app/interfaces/prediction';

import * as moment from 'moment';
import { Weather } from 'src/app/interfaces/weather';
import { WeatherService } from 'src/app/services/weather/weather.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  title = 'WeatherBus';
  map: Map | undefined;
  container: HTMLElement | undefined;
  content: HTMLElement | undefined;
  routes: Route[] = [];
  weather: Weather | undefined;
  yesterdayWeather: Weather | undefined;
  selectedRoute: Route | undefined;
  hasToSelect: boolean = false;
  hasSelectedFirst: boolean = false;
  date: Date = new Date();

  constructor(
    private busService: BusService,
    private weatherService: WeatherService
  ) {}

  ngOnInit() {
    this.getRoutes();
    this.container = document.getElementById('popup')!;
    this.content = document.getElementById('popup-content')!;
    this.map = new Map({
      target: 'hotel_map',
      layers: [
        new TileLayer({
          source: new OSM(),
          className: 'mapLayer',
        }),
      ],
      view: new View({
        projection: 'EPSG:4326',
        center: [-87.61439, 41.73271],
        zoom: 11,
      }),
    });

    var overlay = new Overlay({
      id: 1,
      element: this.container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
    });

    this.map.addOverlay(overlay);
  }

  public getBusLine() {
    var markers: Feature[] = [];

    this.selectedRoute?.points.forEach((point) => {
      markers.push(
        new Feature({
          geometry: new Point([point.lon, point.lat]),
        })
      );
    });

    var initialBorder = [markers[0]];

    var finalBorder = [markers[markers.length - 1]];

    var lines = this.createLine(markers);

    var styles = [
      new Style({
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: 'orange',
          }),
        }),
      }),
    ];

    var lineStyles = [
      new Style({
        stroke: new Stroke({
          color: 'black',
          width: 3,
        }),
      }),
    ];

    var initialBorderStyles = [
      new Style({
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: 'DodgerBlue',
          }),
        }),
      }),
    ];

    var finalBorderStyles = [
      new Style({
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: 'red',
          }),
        }),
      }),
    ];
    var points = this.selectedRoute?.points;
    var vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: markers,
      }),
      style: function (feature) {
        var point = <Point>feature.getGeometry();
        var coordinates = point.getCoordinates();
        if (points) {
          for (let index = 0; index < points.length; index++) {
            if (points[index].stopName) {
              var pointCD = [points[index].lon, points[index].lat];
              if (
                pointCD[0] === coordinates[0] &&
                pointCD[1] === coordinates[1]
              ) {
                return styles;
              }
            }
          }
        }
        return new Style();
      },
      className: 'vectorLayer',
    });

    var initialMarkersLayer = new VectorLayer({
      source: new VectorSource({
        features: initialBorder,
      }),
      style: function () {
        return initialBorderStyles;
      },
      className: 'initialMarkersLayer',
    });

    var finalMarkersLayer = new VectorLayer({
      source: new VectorSource({
        features: finalBorder,
      }),
      style: function () {
        return finalBorderStyles;
      },
      className: 'finalMarkersLayer',
    });

    var lineLayer = new VectorLayer({
      source: new VectorSource({
        features: lines,
      }),
      style: function () {
        return lineStyles;
      },
      className: 'lineLayer',
    });

    if (this.map) {
      this.map.addLayer(vectorLayer);
      this.map.addLayer(initialMarkersLayer);
      this.map.addLayer(finalMarkersLayer);
      this.map.addLayer(lineLayer);
    }
  }

  private getWeather() {
    this.weatherService.getCurrentWeather().subscribe((data: Weather) => {
      this.weather = data;
    });
  }
  private getYesterdayWeather() {
    this.weatherService.getYesterdayWeather().subscribe((data: Weather) => {
      this.yesterdayWeather = data;
    });
  }

  private createLine(markers: Feature[]) {
    var newFeatures: Feature[] = [];
    for (let index = 0; index < markers.length - 1; index++) {
      var p1 = <Point>markers[index].getGeometry();
      var p2 = <Point>markers[index + 1].getGeometry();
      var line = new LineString([p1.getCoordinates(), p2.getCoordinates()]);

      newFeatures.push(
        new Feature({
          geometry: line,
        })
      );
    }
    return newFeatures;
  }

  public getRoutes() {
    this.busService.getRoutes().subscribe((data: Route[]) => {
      data.forEach((x) => this.routes.push(x));
    });
  }

  public getFullRoute(route: Route) {
    var reverse: BaseLayer[] = [];
    for (let index = 0; index < this.map?.getLayers().getLength()!; index++) {
      reverse[index] = this.map
        ?.getLayers()
        .item(this.map?.getLayers().getLength() - index)!;
    }

    reverse.forEach((layer: BaseLayer) => {
      if (layer != undefined) {
        if (layer.getClassName() != 'mapLayer') {
          this.map?.removeLayer(layer);
        }
      }
    });
    this.selectedRoute = route;
    this.getWeather();
    this.getYesterdayWeather();
    this.getBusLine();
  }

  public getSelectedPoint(ev: MouseEvent) {
    this.map?.on('singleclick', async (evt) => {
      var feature = this.map?.forEachFeatureAtPixel(
        evt.pixel,
        function (mapFeature) {
          return mapFeature;
        }
      );
      if (feature && this.map != null) {
        var point = <Point>feature.getGeometry();
        var coordinates = point.getCoordinates();
        var prediction = await this.getBusStopPrediction(coordinates);
        var predictionTime = moment(prediction?.timestamp.toString()).format(
          'hh:mm DD/MM/yyyy'
        );
        var predictionTimeYesterday = moment(prediction?.timestamp.toString())
          .subtract(1, 'd')
          .format('hh:mm DD/MM/yyyy');

        var yesterdayDate = moment(new Date())
          .subtract(1, 'day')
          .format('DD/MM')
          .toString();

        var mapView = this.map.getView();
        mapView.animate({ zoom: 17, center: evt.coordinate });
        this.map.getOverlayById(1).setPosition(coordinates);
        if (this.content) {
          this.content.innerHTML = `
          <h2 class="popup_data">Parada: ${prediction?.stopName}</h3>
          <h2 class="popup_data">Hoje</h2>
          <h3 class="popup_data">Clima: ${this.weather?.WeatherText}</h3>
          <h3 class="popup_data">Precipitação: ${
            this.weather?.HasPrecipitation
              ? this.weather?.PrecipitationType
              : 'Não há precipitação'
          }</h3>
          <h3 class="popup_data">Temperatura: ${
            this.weather?.celsiusTemperature
          } C° </h3>
          <h3 class="popup_data">Possível horário de chegada: ${predictionTime}</h3>
          <h2 class="popup_data">${yesterdayDate}</h2>
          <h3 class="popup_data">Clima: ${
            this.yesterdayWeather?.WeatherText
          }</h3>
          <h3 class="popup_data">Precipitação: ${
            this.yesterdayWeather?.HasPrecipitation
              ? this.yesterdayWeather?.PrecipitationType
              : 'Não há precipitação'
          }</h3>
          <h3 class="popup_data">Temperatura: ${
            this.yesterdayWeather?.celsiusTemperature
          } C° </h3>
          <h3 class="popup_data">Horário de chegada: ${predictionTimeYesterday}  </h3>`;
        }
      } else {
        this.map?.getOverlayById(1).setPosition(undefined);
      }
    });
  }

  private async getBusStopPrediction(
    coordinates: Coordinate
  ): Promise<Prediction | null> {
    var points = this.selectedRoute?.points;
    if (points) {
      for (let index = 0; index < points.length!; index++) {
        if (
          points[index].stopName &&
          points[index].lon == coordinates[0] &&
          points[index].lat == coordinates[1]
        ) {
          return await this.busService
            .getPredictionByStopId(points[index].stopId)
            .toPromise();
        }
      }
    }
    return null;
  }
}
