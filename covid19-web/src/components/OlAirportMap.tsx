/* React */

import React, { useEffect, useRef, useState } from 'react';

/* Ant Design */

import 'antd/dist/antd.css';

import { Table, Layout} from "antd";

import "antd/dist/antd.css";


/* Open Layer Maps v6 */
import '../index.css';
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
import OverlayPositioning from "ol/OverlayPositioning";
import { fromLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import Select from "ol/interaction/Select";
import { pointerMove } from "ol/events/condition";
import LineString from 'ol/geom/LineString';
import Geometry from 'ol/geom/Geometry';
import { title } from 'process';


const { Sider, Content } = Layout;

interface Props {
  travelData: any;
  countriesData: any;
}

const makeTooltip = (name: string, row: any): string => {

  /* Ternary group to translate object properties to a human readable format */
  var statename = row.name;
  var iata = row.iata;
  var cases = row.confirmedcases
  var contagion = row.contagionrisk

  var stayhome;
  switch(row.c6_stay_at_home_requirements) {
      case 0:
        stayhome = "No Stay At Home Requirements"
        break;
      case 1:
        stayhome = "Recommended Stay At Home"
        break;
      case 2:
        stayhome = "Some Non-Essential Trips, Curfew In Place"
        break;
      case 3:
        stayhome = "Posted Days Only, Including Essential Travel"
        break;
      case 4:
        stayhome = "No Travel"
        break;
  }
  
  var school;
  switch(row.c1_school_closing) {
    case 0:
      school = "Schools are Open"
      break;
    case 1:
      school = "Altered School Model (Hybrid/Online Learning)"
      break;
    case 2:
      school = "Schools Closed, Childcare Remains Open"
      break;
    case 3:
      school = "All Schools in Jurisdiction Closed"
      break;
  };
  
  var masks;
  switch(row.h6_facial_coverings){
    case 0: 
      masks = "Masks Not Required";
      break;
    case 1: 
      masks = "Masks required in most places";
      break;
    case 2: 
      masks = "Compulsory To Wear Masks in Shops & Other Locations";
      break;
    case 3: 
      masks = "Mask Must Wear: Crowded Streets / Public Places";
      break;
    case 4: 
      masks = "Masks Mandatory All Times Outside of Home";
      break;
  };

  var gatherings;
  switch(row.c4_restrictions_on_gatherings){
    case 0:
     gatherings = "<b>No</b> Restrictions"
     break;
    case 1:
      gatherings = "Restriction on Gatherings"
      break;
    case 2:
      gatherings = "Gatherings of <b>2</b> or Less"
      break;
    case 3:
      gatherings = "Gatherings of 3 or Less"
      break;
    case 4:
      gatherings = "Gatherings of 4 or Less"
      break;
  }

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
    "Contagion Risk: " +
    "</td>" +
    "<td><b>" +
    contagion +
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

const colorAccessor = (num: number) => {
  let d = 0;
  
  d = num
  console.log(d);
  return d === 0 ? '#2F2F2F' :
  d <= 20 ? '#a50026' :
      d <= 40 ? '#d73027' :
          d <= 60 ? '#fdae61' :
              d <= 80 ? '#fee08b' :
                  d < 100 ? '#66bd63' :
                      '#2F2F2F';
}

function getColor(value: number){
  var hue=((1-value)*120).toString(10);
  return ["hsl(",hue,",100%,50%)"].join("");
}

const toolTipHandler = (name: string): string => {
  console.log(name);
  if (!name || name.length === 0) {
    return "";
  } else {
    let row = name;
    console.log(row);
    if (row) {
      return makeTooltip(name, row);
    } else {
      return "";
    }
  }
}

function onHoverEvent(record: any) {

  const tt = makeTooltip(record.name, record);
  console.log(record);
  return tt;

}

export const columns = [
    {
      
      title: '',
      dataIndex: 'iata',
      key: 'iata',
      render: (text: any, record: any) => (
        //change Map to the actual map item.
      <div id="getTable" onMouseEnter={(e) => onHoverEvent(record.state)}>
        <div> {record.city} {record.state} <div style={{float: 'right', color: 'lightgray'}}><b>{record.iata}</b> {Math.round(record.latitude)}&#176; {Math.round(record.longitude)}&#176;</div> <br></br> 
        <hr></hr> 
        <h3>{record.name}</h3>
        <img id="cardImage" src={`/64/${record.countrycode}.png`}/><div style={{backgroundColor: 'lightgray', textShadow: '1px 1px 3px white'}}><p id="soft-text">{record.c1_school_closing > 0 ? <div style={{color: 'red'}}> Schools Closed </div> : <div style={{color: 'green'}}> Schools Open </div>}</p></div>
        <p id="soft-text">{record.facial_coverings > 0 ? <div style={{backgroundColor: 'white',color: 'red'}}> Masks Required </div> : <div style={{color: 'green'}}> No Mask Required </div> }</p>
        <p id="soft-text"><div style={{backgroundColor: 'lightgray',color: getColor(record.contagionrisk), textShadow: '1px 1px 3px black'}}>Contagion Risk: {record.contagionrisk}</div></p>
        <p id="soft-text"><div style={{backgroundColor: 'white'}}>Total % Vaccinated: {record.vacc_complete_pct}</div></p>
        <p id="soft-text"><div style={{backgroundColor: 'lightgray', textShadow: '1px 1px 2px white'}}>Total Vaccinated People: {record.vacc_total_people}</div></p>
        <p id="soft-text"><div style={{backgroundColor: 'white'}}>New Cases: {record.new_cases}</div></p>
        <p id="soft-text"><div style={{backgroundColor: 'lightgray', textShadow: '1px 1px 2px white'}}>Deaths: {record.deaths}</div></p>
        <p id="soft-text"><div style={{backgroundColor: 'white'}}>New Deaths: {record.new_deaths}</div></p>
        </div>
        </div>
      )}
]


export default function OlAirportMap(props: Props) {

  const container = useRef<HTMLElement | null>(null);
  const popup = useRef<HTMLElement | null>(null);

  /* Primary data source for the Table object */
  const [tableData, setTableData] = useState<any>([{}]);
  const [countriesData, setCountriesData] = useState<any>([{}]);
  const [toolTipToggle, setToolTipToggle] = useState<any>([]);

  /* Global variables && map initiators */
  var coordinates: any[] = [];
  var features: any[] = [];
  var featureColors: any[] = [];
  let xAxis = 0;
  let yAxis = 0;
  let distance = 0;
  let setZoom = 0;

  const map = useRef<OlMap | null>(null);



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

    /*Set data to state then initalize Map with initMap(); */
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

  function CountryColor(feature: any, props: any) {
    if (props.countriesData !== null && props.countriesData.length > 0) {
      let i = 0;
      do {
        if (feature.get('name').toUpperCase() === props.countriesData[i].location) {
          return feature.get('name').toUpperCase() === props.countriesData[i].location ? colorAccessor(props.countriesData[i].vacc_complete_pct) : '#2F2F2F'
        }
        i += 1;
      }
      while (i < props.countriesData.length);
    }
    return '#2F2F2F';

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


      var vectorLayer = new VectorLayer({
        source: vectorSource,
        style: function (feature) {
          const style = new Style({
            fill: new Fill({
              color: CountryColor(feature, props),
            }),
            stroke: new Stroke({
              color: '#ffffff',
              width: 2,
            }),
            text: new Text({
              font: '9px Calibri,sans-serif',
              text: feature.get('name'),
              fill: new Fill({
                color: '#A9A9A9',
              }),
              stroke: new Stroke({
                color: 'gray',
                width: 1,
              }),
            }),
          });
          
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
            console.log(popup.current);
            if (popup.current) {
              // setToolTipToggle(toolTipHandler(feature.get('setId')));
              // setToolTipToggle(overlay.setPosition(e.mapBrowserEvent.coordinate));
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
        console.log(toolTipToggle);
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
    <Layout style={{height:'100%'}}>


        <Sider width={350} theme={'light'}>
      
          <Table style={{width: 450, height: "100%", paddingLeft: '10%'}} locale={{emptyText: "No Map Data Entered"}} pagination={{pageSize: 2}} columns={columns} dataSource={tableData}/>
       
        </Sider>
  
        <Content>
          <div id="map" className="map" style={{ background: '#2b2b2b', height: "100%"}} ref={(e) => (container.current = e)} />
          <div id="popup" ref={(e) => (popup.current = e)} />
        </Content>



    </Layout>
  )
}
