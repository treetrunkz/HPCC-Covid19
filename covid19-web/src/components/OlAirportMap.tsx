import { Bar } from "@antv/g2plot";
import { Card, Col, Modal, Row, Space, Statistic, Table, Tag } from "antd";
import { Map, View } from 'ol';
import { pointerMove } from "ol/events/condition";
import Feature, { FeatureLike } from "ol/Feature";
import GeoJSON from 'ol/format/GeoJSON';
import Point from 'ol/geom/Point';
import { defaults as defaultInteractions } from 'ol/interaction.js';
import Select from "ol/interaction/Select";
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import 'ol/ol.css';
import Overlay from "ol/Overlay";
import OverlayPositioning from "ol/OverlayPositioning";
import { fromLonLat } from "ol/proj";
import TileJSON from 'ol/source/TileJSON';
import VectorSource from "ol/source/Vector";
import { Fill, Icon, Stroke, Style, Text } from 'ol/style';
import IconAnchorUnits from "ol/style/IconAnchorUnits";
import { features } from 'process';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Chart } from "./Chart";

interface Props {
  /* filtered data from our api called via the parent component TravelForm  */
    data: any;
}

const columns = [
    {
      title: 'IATA',
      dataIndex: 'iata',
      key: 'iata',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'State',
      key: 'state',
      dataIndex: 'state',
    },
    {
        title: 'Country',
        key: 'country',
        dataIndex: 'country',
    },
    {
        title: 'Latitude',
        key: 'latitude',
        dataIndex: 'latitude',
    },
    {
        title: 'Longitude',
        key: 'longitude',
        dataIndex: 'longitude',
    },
    {
      title: 'School Closing',
      key: 'c1_school_closing',
      dataIndex: 'c1_school_closing',
    },
    {
      title: 'Gathering Restrictions',
      key: 'c4_restrictions_on_gatherings',
      dataIndex: 'c4_restrictions_on_gatherings',
    },
    {
      title: 'Stay At Home Requirements',
      key: 'c6_stay_at_home_requirements',
      dataIndex: 'c6_stay_at_home_requirements',
    },
    {
      title: 'Confirmed Cases',
      key: 'confirmedcases',
      dataIndex: 'confirmedcases',
    },
    {
      title: 'Required Facial Coverings',
      key: 'h6_facial_coverings',
      dataIndex: 'h6_facial_coverings',
    }
]

export default function OlAirportMap(props: Props) {
    const container = useRef<HTMLElement | null>(null);
    const popup = useRef<HTMLElement | null>(null);

    const [tableData, setTableData] = useState<any>([{}]);
    const coordinates: number[][] = [];
    var features: any[] = [];
    const map = useRef<Map | null>(null);
  
    let one: any = 'fraction';
    let two: any = 'pixel';
    var iconStyle: any | any = new Style({
      image: new Icon({
        anchor: [0, 0],
        src: "/icon.png",
        anchorXUnits: one,
        anchorYUnits: two,
      })
    });

    useEffect(() => {
      if(props.data !== null && props.data.length > 0){
        let i = 0;

        do {
          // let one: any = 'fraction';
          // let two: any = 'pixel';
          // var iconStyle: any | any = new Style({
          //   image: new Icon({
          //     anchor: [props.data[i].longitude, props.data[i].latitude],
          //     src: "/icon.png",
          //     anchorXUnits: one,
          //     anchorYUnits: two,
          //   })
          // });
          features[i] = new Feature({
            geometry: new Point([props.data[i].longitude, props.data[i].latitude]),
            anchor:[0, 0],
            name: props.data[i].name,
            iata: props.data[i].iata,
            cases: props.data[i].confirmedcases,
          });
          features[i].setStyle(iconStyle);
          coordinates[i] = ([props.data[i].longitude, props.data[i].latitude]);
          i += 1;
        }
        while (i < props.data.length);
      }
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
          console.log(features);

          //test//
          var vectorSecond = new VectorSource({
            features: features
          })
          var secondLayer = new VectorLayer({
            source: vectorSecond
          })

          // var iconFeature = new Feature({
          //   geometry: new Point([0, 0]),
          //   name: 'Null Island',
          //   population: 4000,
          //   rainfall: 500,
          // });

          // iconFeature.setStyle(iconStyle);
            
          //test//

          var vectorSource = new VectorSource({
            features: features,
            url: "countries.geojson",
            format: new GeoJSON()
          });
        
          var vectorLayer = new VectorLayer({
            source: vectorSource,
          });
            map.current = new Map({
                overlays: [overlay],
                view: new View({
                    center: [0, 0],
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

            overlay.setElement(popup.current);
            map.current.setTarget(container.current);
            console.log(map.current.render());
            map.current.render();

            
            //center view on element
            // map.current.getView().setCenter(fromLonLat([x,y]))
            }
          }
          
          }
        

       
  
        
    return (
        <div>
          <p></p>
            <Table dataSource={tableData} columns={columns} ></Table>
            <div id="map" className="map" style={{background: '#2b2b2b', height: 500}} ref={(e) => (container.current = e)}/>
            <div id="popup" ref={(e) => (popup.current = e)}/>
        </div>

    )
}