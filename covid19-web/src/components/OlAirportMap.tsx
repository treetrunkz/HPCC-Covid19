/* React */

import React, { useEffect, useRef, useState } from 'react';
import { QueryData } from "../components/QueryData";

/* Ant Design */

import 'antd/dist/antd.css';

import { Table, Layout, Empty } from "antd";

import "antd/dist/antd.css";


/* Open Layer Maps v6 */
import '../index.css';
import 'ol/ol.css';
import { Fill, Icon, Stroke, Style, Text } from 'ol/style';
import { Map as OlMap } from 'ol';
import { View } from 'ol';
import Feature from "ol/Feature";
import GeoJSON from 'ol/format/GeoJSON';
import Point from 'ol/geom/Point';
import { defaults as defaultInteractions } from 'ol/interaction.js';
import { getLength } from 'ol/sphere';
import { Vector as VectorLayer } from 'ol/layer';
import Overlay from "ol/Overlay";
import Catalog from "../utils/Catalog";
import OverlayPositioning from "ol/OverlayPositioning";
import { fromLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import Select from "ol/interaction/Select";
import { pointerMove } from "ol/events/condition";
import { columns } from '../../src/lists/components/TravelForm/Columns'
import { Content, Header } from 'antd/lib/layout/layout';
import LineString from 'ol/geom/LineString';
import Geometry from 'ol/geom/Geometry';
import { getCommentRange } from 'typescript';


interface Props {
  travelData: any;
  countriesData: any;
}


export default function OlAirportMap(props: Props) {

  const container = useRef<HTMLElement | null>(null);
  const popup = useRef<HTMLElement | null>(null);

  /* primary data source for the Table object */
  const [tableData, setTableData] = useState<any>([{}]);


  /* global variables && map initiators */
  var coordinates: any[] = [];
  var features: any[] = [];
  var featureColors: any[] = [];
  let xAxis = 0;
  let yAxis = 0;
  let distance = 0;
  let setZoom = 0;

  const map = useRef<OlMap | null>(null);

  const toolTipHandler = (name: string): string => {
    if (!name || name.length === 0) {
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
    //create cases to return pertinent information 3 = totally closed, etc.
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



  const colorAccessor = (props: any, num: number) => {
    let d = 0;

    d = num
    return d === 0 ? '#2b2b2b' :
    d <= 20 ? '#a50026' :
        d <= 40 ? '#d73027' :
            d <= 60 ? '#fdae61' :
                d <= 80 ? '#fee08b' :
                    d < 100 ? '#66bd63' :
                        '#1a9850';
  }

  useEffect(() => {

    if (props.travelData !== null && props.travelData.length > 0) {
      let i = 0;
      do {
        /*Each point assigned all of it's data with setId */
        features[i] = new Feature({
          setId: props.travelData[i],
          geometry: new Point(fromLonLat([props.travelData[i].longitude, props.travelData[i].latitude])),
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
        coordinates[i] = [props.travelData[i].longitude, props.travelData[i].latitude]
        i += 1;
      }
      while (i < props.travelData.length);
    }

    /*set data to state then initalize map */
    // console.log(props.data + "info");

    setTableData(props.travelData);
    initMap();
  }, [props.travelData]);

  const formatZoom: any = function (distance: number) {
    switch (true) {
      case (distance < 2500000 && distance > 0):
        return 5;
      case (distance <= 2700000 && distance > 5000000):
        return 4;
      case (distance <= 5000000 && distance > 7000000):
        return 3;
      case (distance <= 7000000 && distance > 3000000):
        return 2;
      case (distance <= 2000000000 && distance > 7000000):
        return 1;
    }
  }

  function toContryColor(feature: any, props: any) {
    console.log(feature.get('name') + "feature name");
    console.log("called country color" + props.countriesData);
    if (props.countriesData !== null && props.countriesData.length > 0) {
      let i = 0;
      do {
        console.log(colorAccessor(props, props.countriesData.vacc_complete_pct));
        if (feature.get('name').toUpperCase() === props.countriesData[i].location) {
          console.log(feature.get('name') + "feature found ***");
          return feature.get('name').toUpperCase() === props.countriesData[i].location ? colorAccessor(props, props.countriesData[i].vacc_complete_pct) : '#000000'
        }
        i += 1;
      }
      while (i < props.countriesData.length);
    }
    return '#000000';

  }

  const initMap = () => {


    if (map.current !== null) {
      map.current.dispose();
    }

    if (features !== [] || null || undefined) {
      const overlay = new Overlay({
        offset: [10, 0],
        positioning: OverlayPositioning.TOP_LEFT,
        autoPan: false
      });

      var vectorSecond = new VectorSource({
        features: features
      })


      var secondLayer = new VectorLayer({
        source: vectorSecond,
      })

      var vectorSource = new VectorSource({
        features: features,
        url: "countries.geojson",
        format: new GeoJSON()

      });

      /*enumerate lines for -> of coordinates*/
      var lines: any = {
        segments: coordinates.slice(3),
      }

      var iterations = coordinates.length

      const formatLength = function (line: Geometry) {
        const length = getLength(line);
        distance += length;
      }


      for (lines of coordinates) {

        const geom = new LineString(coordinates)
        formatLength(geom);
        geom.transform('EPSG:4326', 'EPSG:3857')
        xAxis += Number(lines[0])
        yAxis += Number(lines[1]);
        const feature = new Feature({
          type: 'line',
          geometry: geom,
          color: lines.color
        })
        distance = getLength(geom)
        feature.setStyle(new Style({
          stroke: new Stroke({
            color: '#FF0000',
            width: 3,
          })
        })
        );
        vectorSource.addFeature(feature)
      }


      xAxis = xAxis / iterations;
      yAxis = yAxis / iterations;


      const fillColor: string = '';
      var vectorLayer = new VectorLayer({
        source: vectorSource,
        style: function (feature) {
          const style = new Style({
            fill: new Fill({
              color: toContryColor(feature, props),
            }),
            stroke: new Stroke({
              color: '#ffffff',
              width: 2,
            }),
            text: new Text({
              font: '9px Calibri,sans-serif',
              fill: new Fill({
                color: '#000',
              }),
              stroke: new Stroke({
                color: 'gray',
                width: 1,
              }),
            }),
          });
          // let text = feature.get(props.selectKeyField).toUpperCase();
          // style.getText().setText(showLabel ?  text + ' ' + props.measureHandler(feature.get(props.colorKeyField)) : '');
          return style;
        },
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



      if (container.current && popup.current && map.current !== null) {


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
      if (xAxis && yAxis !== 0) {
        map.current.getView().setCenter(fromLonLat([xAxis, yAxis]))
        map.current.getView().setZoom(formatZoom(distance));

        xAxis = 0;
        yAxis = 0;
      }
    }
  })

  return (
    <Layout className="site-layout">
      <div id="table">
        <Table columns={columns} dataSource={tableData} />
      </div>


      <Content id="content">
        <div id="map">
          <div id="map" className="map" style={{ background: '#2b2b2b', bottom: 50, height: 500 }} ref={(e) => (container.current = e)} />
          <div id="popup" ref={(e) => (popup.current = e)} />
        </div>
      </Content>
    </Layout>
  )
}
