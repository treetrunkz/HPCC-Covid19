import {Card} from 'antd';
import React from 'react';

/*0 is good, 1.0 is bad */
function getColor(value: number){
  var hue=((1-value)*120).toString(10);
  return ["hsl(",hue,",100%,50%)"].join("");
}

/* 0 is bad, 100 is good */
function getColorReverse(value: number){
  var hue=(100 - ((1-value)*120)).toString(10);
  return ["hsl(",hue,",100%,50%)"].join("");
}

/*colums returns data for each Card in response to the user input
the data must be able to render as dataSource={dataSource} to be usable
this comes with several restrictions */
export const columns = [
    {
      
      title: '',
      dataIndex: 'iata',
      key: 'iata',
      render: (text: any, record: any) => (
      
        <Card id="cardStyle"> {record.city} {record.state} <div style={{float: 'right', color: 'lightgray'}}><b>{record.iata}</b> {Math.round(record.latitude)}&#176; {Math.round(record.longitude)}&#176;</div> <br></br> 
        <hr></hr> 
        <h3>{record.name}</h3>
        <img id="card-image" src={`/64/${record.countrycode}.png`}/><p id="soft-text">{record.c1_school_closing > 0 ? <div style={{color: 'red'}}> Schools Closed </div> : <div style={{color: 'green'}}> Schools Open </div>}</p>
        <p id="soft-text">{record.facial_coverings > 0 ? <div style={{color: 'red'}}> Masks Required </div> : <div style={{color: 'green'}}> No Mask Required </div> }</p>
        <p id="soft-text">Contagion Risk:<div style={{color: getColor(record.contagionrisk)}}>{record.contagionrisk}</div></p>
        <p id="soft-text">Total % Vaccinated: <div style={{color: getColorReverse(record.vacc_complete_pct)}}> {record.vacc_complete_pct}</div></p>
        <p id="soft-text">Total Vaccinated People: <b>{record.vacc_total_people}</b></p>
        <p id="soft-text">New Cases: <b>{record.new_cases}</b></p>
        <p id="soft-text">Deaths: <b>{record.deaths}</b></p>
        <p id="soft-text">New Deaths: <b>{record.new_deaths}</b></p>
        </Card>

      )
    }
]