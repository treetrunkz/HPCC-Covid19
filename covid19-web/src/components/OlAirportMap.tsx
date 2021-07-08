import React, {useEffect, useRef, useState} from 'react';
import {Map, View} from 'ol';
import {Vector as VectorLayer} from 'ol/layer';
import ReactDOM from 'react-dom';
import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from "ol/source/Vector";
import Select from "ol/interaction/Select";
import {pointerMove} from "ol/events/condition";
import {Fill, Stroke, Style, Text} from 'ol/style';
import {FeatureLike} from "ol/Feature";
import Feature from "ol/Feature";
import Overlay from "ol/Overlay";
import {fromLonLat} from "ol/proj";
import {defaults as defaultInteractions} from 'ol/interaction.js'
import OverlayPositioning from "ol/OverlayPositioning";
import {Card, Col, Modal, Row, Statistic, Table, Tag, Space } from "antd";
import {Bar} from "@antv/g2plot";
import {Chart} from "./Chart";
import 'ol/ol.css';
import Point from 'ol/geom/Point';
import TileJSON from 'ol/source/TileJSON';
import {Icon} from 'ol/style';
import {Tile as TileLayer} from 'ol/layer';
import { features } from 'process';

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
    
    useEffect(() => {
      console.log(props.data.length)
      if(props.data != null && props.data.length > 0){
        let i = 0;
        do {

          features[i] = new Feature({
            geometry: new Point([props.data[i].longitude, props.data[i].latitude]),
            anchor:[0, 25],
            name: props.data[i].name,
            iata: props.data[i].iata,
            cases: props.data[i].confirmedcases,
          });

          var iconStyle = new Style({
            image: new Icon({
              anchor: [0.5, 46],
              src: "https://a.fsdn.com/allura/p/hpccsystems/icon?1493723487",
            }),
          });

          features[i].setStyle(iconStyle);

          coordinates[i] = ([props.data[i].longitude, props.data[i].latitude]);
          i += 1;
        } while (i < props.data.length);
      }
        setTableData(props.data);
        initMap();
    },[props.data]);

    const initMap = () => {

      if ( map.current !== null){
          map.current.dispose();
      }
      if(features !== []){
          const overlay = new Overlay({
            offset: [10, 0],
            positioning: OverlayPositioning.TOP_LEFT,
            autoPan: false
          });
          console.log(features)
          console.log(props.data)
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
            
            map.current.setTarget(container.current);
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