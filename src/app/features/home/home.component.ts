import { Component, OnInit } from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import { BusService } from 'src/app/services/bus/bus.service';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import {Circle as CircleStyle,Fill, Stroke} from 'ol/style';
import { Route } from 'src/app/interfaces/route';
import LineString from 'ol/geom/LineString';
import Overlay from 'ol/Overlay';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title = 'WeatherBus';
  map: Map | undefined;
  container: HTMLElement | undefined;
  content: HTMLElement | undefined;
  //TODO retornar Route para tipo ROute
  routes: string[] = ["Cicero - Berwyn"];
  selectedRoute: string | undefined;
  hasToSelect: boolean = false;
  hasSelectedFirst: boolean = false;

  constructor(private bus:BusService){

  }

  ngOnInit(){
    this.container = document.getElementById('popup')!;
    this.content = document.getElementById('popup-content')!;
    this.map = new Map({
      target: 'hotel_map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: olProj.fromLonLat([-87.65708976439701,41.85950283525066]),
        zoom: 11,
      })
    });
    this.getBusLine(this.map);

    var overlay = new Overlay({
      id: 1,
      element : this.container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
    });

    this.map.addOverlay(overlay);
  }

  public getBusLine(map: Map){

  var markers = [
    new Feature({
      geometry: new Point(olProj.fromLonLat([-87.62485700000141,41.88214599999967],'EPSG:3857')),
    }),
    new Feature({
      geometry: new Point(olProj.fromLonLat([-87.62574,41.882135],'EPSG:3857')),
    }),
    new Feature({
      geometry: new Point(olProj.fromLonLat([-87.6259059999997,41.882139000001295],'EPSG:3857')),
    }),
    new Feature({
      geometry: new Point(olProj.fromLonLat([-87.627643,41.882106],'EPSG:3857')),
    }),
    new Feature({
      geometry: new Point(olProj.fromLonLat([-87.627927,41.882047],'EPSG:3857')),
    }),
    new Feature({
      geometry: new Point(olProj.fromLonLat([-87.628957,41.882022],'EPSG:3857')),
    }),
    new Feature({
      geometry: new Point(olProj.fromLonLat([-87.62909999999918,41.88202000000059],'EPSG:3857')),
    }),
    new Feature({
      geometry: new Point(olProj.fromLonLat([-87.6291,41.882],'EPSG:3857')),
    }),
    new Feature({
      geometry: new Point(olProj.fromLonLat([-87.63144,41.88197],'EPSG:3857')),
    }),
    new Feature({
      geometry: new Point(olProj.fromLonLat([-87.63236,41.88197],'EPSG:3857')),
    }),
    new Feature({
      geometry: new Point(olProj.fromLonLat([-87.63295,41.88195],'EPSG:3857')),
    }),
    new Feature({
      geometry: new Point(olProj.fromLonLat([-87.63236,41.88197],'EPSG:3857')),
    }),

    new Feature({
      geometry: new Point(olProj.fromLonLat([-87.63295,41.88195],'EPSG:3857')),
    }),
    new Feature({
      geometry: new Point(olProj.fromLonLat([-87.63478,41.88193],'EPSG:3857')),
    }),
  ];

  var lines =  this.createLine(markers);
  var styles = [
    new Style({
      image: new CircleStyle({
      radius:7,
      fill: new Fill({
        color: 'orange',
      }),
      }),
    })
  ]

  var lineStyles = [
    new Style({
      stroke : new Stroke({
        color: 'red',
        width: 3,
      })
    })
  ]

  var vectorLayer = new VectorLayer({
    source: new VectorSource({
      features: markers,
    }),
    style: function (feature) {
      return styles;
    },
  });

  var lineLayer = new VectorLayer({
    source: new VectorSource({
      features: lines,
    }),
    style: function (feature) {
      return lineStyles;
    },
  });

    map.addLayer(vectorLayer);
    map.addLayer(lineLayer);
  }

  private createLine(markers: Feature[]){
    var newFeatures : Feature[] = [];
    for (let index = 0; index < markers.length - 1; index++) {
      var p1 = <Point> markers[index].getGeometry();
      var p2 = <Point> markers[index+1].getGeometry();
      var line = new LineString([p1.getCoordinates(),p2.getCoordinates()])

      newFeatures.push(new Feature({
          geometry: line,
        })
      );
    }
    return newFeatures;
  }


  public getRoutes(){
     this.bus.getBusLines()
     .subscribe((data:Route) => {
       //this.routes.push();
      });
  }

  public getAny(){
  }

  public teste(ev: MouseEvent){
    this.map?.on('singleclick',  (evt) => {
      var feature = this.map?.forEachFeatureAtPixel(evt.pixel, function(mapFeature){
        return mapFeature;
      })
      if (feature && this.map != null) {
        var point = <Point> feature.getGeometry();
        var coordinates = point.getCoordinates();
        var mapView = this.map.getView();
        mapView.animate({zoom: 17, center: evt.coordinate})
        //mapView.setZoom(15);
        this.map?.getOverlayById(1).setPosition(coordinates);
        if(this.content){
        this.content.innerHTML = 'Texto de Exemplo'
        }        
      }
    });
  }

}
