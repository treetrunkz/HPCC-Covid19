/* React */

import React, { useEffect, useRef, useState } from 'react';

/* Ant Design */

import 'antd/dist/antd.css';

import { Table, Layout } from "antd";

import "antd/dist/antd.css";


/* Open Layer Maps v6 */

import 'ol/ol.css';
import { Icon, Stroke, Style } from 'ol/style';
import { Map as OlMap } from 'ol';
import { View } from 'ol';
import Feature from "ol/Feature";
import GeoJSON from 'ol/format/GeoJSON';
import Point from 'ol/geom/Point';
import { defaults as defaultInteractions } from 'ol/interaction.js';
import { Vector as VectorLayer } from 'ol/layer';
import Overlay from "ol/Overlay";
import OverlayPositioning from "ol/OverlayPositioning";
import { fromLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import Select from "ol/interaction/Select";
import { pointerMove } from "ol/events/condition";
import { columns } from '../../src/lists/components/TravelForm/Columns'
import { Content, Header } from 'antd/lib/layout/layout';
import LineString from 'ol/geom/LineString';


interface Props {
    data: any;
}


export default function OlAirportMap(props: Props) {

    const container = useRef<HTMLElement | null>(null);
    const popup = useRef<HTMLElement | null>(null);

    /* primary data source for the Table object */
    const [tableData, setTableData] = useState<any>([{}]);

    /* global variables && map initiators */
    var coordinates: any[] = [];
    var features: any[] = [];
    let xAxis = 0;
    let yAxis = 0;
    
    const map = useRef<OlMap | null>(null);

    const toolTipHandler = (name: string): string => {
      if (!name || name.length === 0) {
        console.log("no name")
          return "";
      } else {
          let row = name;
          if (row) {
              return makeTooltip(name, row);
          } else {
              return "";
          }
      }
  }

  const makeTooltip = (name: string, row: any): string => {
    
    /* ternary group to translate object properties to a human readable format */
    var statename = row.name;
    var iata = row.iata;
    var cases = row.confirmedcases
    var stayhome = row.c6_stay_at_home_requirements > 0 ? "Stay at Home" : "Free to Roam"
    var school = row.c1_school_closing > 0 ? "Schools Closed" : "Schools Open"
    var masks = row.facial_coverings > 0 ? "Masks Required" : "No Mask Required"
    var gatherings = row.c4_restrictions_on_gatherings > 0 ? "Gatherings Prohibited" : "Groups allowed (Check size)"

    return "<div style='padding: 5px; border: 2px solid black; background: darkslategray'><table style='color: whitesmoke;'>" +
        "<tr>" +
        "<td colspan='2' style='font-weight: bold'>"
        + statename +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "Airport ID# " +
        "</td>" +
        "<td><b>" +
        iata +
        "</b></td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "Confirmed Cases: " +
        "</td>" +
        "<td><b>" +
        cases +
        "</b></td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "Stay at home requirements: " +
        "</td>" +
        "<td><b>" +
        stayhome +
        "</b></td>" +
        "</tr>" +
        "<tr>" +
        "<td >" +
        "School Closures: " +
        "</td>" +
        "<td><b>" +
        school +
        "</b></td>" +
        "</tr>" +
        "<tr>" +
        "<td style='padding-right: 10px'>" +
        "Facial Coverings: " +
        "</td>" +
        "<td><b>" +
        masks +
        "</b></td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "Gathing Restrictions: " +
        "</td>" +
        "<td><b>" +
        gatherings +
        "</b></td>" +
        "</tr>" +
        "</tr>" +
        "<tr>" +
        "<tr>" +
        "<td colspan='2' style='font-style: italic;color: black'>" +
        "</td>" +
        "</tr>" +
        "</table></div>"
  }

    useEffect(() => {
      if(props.data !== null && props.data.length > 0){
        let i = 0;
        do {
          /*Each point assigned all of it's data with setId */        
          features[i] = new Feature({
            setId: props.data[i],
            geometry: new Point(fromLonLat([props.data[i].longitude, props.data[i].latitude])),
          });
          features[i].setStyle(
            new Style({
              image: new Icon({
                crossOrigin: 'anonymous',
                imgSize: [40, 90],
                src: 'gdop.png',
              }),
            })
          );
          coordinates[i] = [props.data[i].longitude, props.data[i].latitude]
          i += 1;
        }
        while (i < props.data.length);
      }
      /*set data to state then initalize map */
        setTableData(props.data);
        initMap();
    },[props.data]);

    const initMap = () => {
      
      if ( map.current !== null){
          map.current.dispose();
      }

      if(features !== [] || null || undefined){
          const overlay = new Overlay({
            offset: [10, 0],
            positioning: OverlayPositioning.TOP_LEFT,
            autoPan: false
          });

          var vectorSecond = new VectorSource({
            features: features
          })

          var secondLayer = new VectorLayer({
            source: vectorSecond
          })

          /* optional features */
          const randomColor=()=> {
            return '#' + ('000000' + Math.floor(Math.random() * 16777215).toString(16)).slice(-6)
          }

          var vectorSource = new VectorSource({
            features: features,
            url: "countries.geojson",
            format: new GeoJSON()
          });
          
          /*enumerate lines for -> of coordinates*/
          var lines: any = {
            segments: coordinates.slice(3),
            color: randomColor,
          }

          var iterations = coordinates.length
          for (lines of coordinates) {
            const geom = new LineString(coordinates)
            geom.transform('EPSG:4326', 'EPSG:3857')
            xAxis += Number(lines[0])
            yAxis += Number(lines[1]);
            const feature = new Feature({
              type: 'line',
              geometry: geom,
              color: lines.color
            })
      
            feature.setStyle(new Style({
              stroke: new Stroke({
                color: '#FF0000',
                width: 3,
              })
            })
          );
            vectorSource.addFeature(feature)
          }
          
          xAxis = xAxis/iterations;
          yAxis = yAxis/iterations;

          console.log(xAxis + "x" + yAxis + "y"); 
          
          var vectorLayer = new VectorLayer({
            source: vectorSource,
          });

            map.current = new OlMap({
                overlays: [overlay],
                view: new View({
                    center: fromLonLat([0, 0]),
                    zoom: 2
                }),
                interactions: defaultInteractions({
                    doubleClickZoom: false,
                    dragPan: true,
                    mouseWheelZoom: false
                }),
            });

            if(container.current && popup.current && map.current !== null){
             
              map.current.addLayer(vectorLayer);
              map.current.addLayer(secondLayer);
              
              map.current.setTarget(container.current);
              overlay.setElement(popup.current);

              let selectMouseMove = new Select({
                layers: [secondLayer],
                condition: pointerMove,
                });

          selectMouseMove.on('select', function (e: any,) {
              e.offsetX = 10;
              e.offsetY = 10;
              if (e.selected.length > 0) {
                  let feature = e.selected[0];
                  if (popup.current) {
                      popup.current.innerHTML = toolTipHandler(feature.get('setId'));
                      overlay.setPosition(e.mapBrowserEvent.coordinate);
                  }
                } else {
                  toolTipHandler('');
                  if (popup.current) {
                      popup.current.innerHTML = '';
                  }
              }
          });

          map.current.addInteraction(selectMouseMove);
            map.current.setTarget(container.current);
            map.current.render();
            }
          }
        } /* End of InitMap() */

        /* Any change to Form / Map */
          useEffect(() => {
            if (map.current !== null) {
                if(xAxis && yAxis != 0){
                  map.current.getView().setCenter(fromLonLat([xAxis, yAxis]))
                  map.current.getView().setZoom(3);
                  console.log("triggered");
                  xAxis = 0;
                  yAxis = 0;
                  }
            }
        })
        
    return (
      <Layout className="site-layout">
          <Header className="site-layout-background">
          <div id="table">
          <Table columns={columns} dataSource={tableData}  />
          </div>
          </Header>
       
          <Content>
          <div id="map">
            <div id="map" className="map" style={{background: '#2b2b2b', bottom: 50, height: 640}} ref={(e) => (container.current = e)}/>
            <div id="popup" ref={(e) => (popup.current = e)}/>
          </div>
          </Content>
          </Layout>
    )
}