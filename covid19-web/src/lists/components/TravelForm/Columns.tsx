import {Card} from 'antd';
import { getCiphers } from 'crypto';
import React from 'react';
function getColor(value: number){
  var hue=((1-value)*120).toString(10);

  return ["hsl(",hue,",100%,50%)"].join("");
}

export const columns = [
    {
      
      title: '',
      dataIndex: 'iata',
      key: 'iata',
      render: (text: any, record: any) => (
      
        <Card id="cardStyle"> {record.city} {record.state} <div style={{float: 'right', color: 'lightgray'}}><b>{record.iata}</b> {Math.round(record.latitude)}&#176; {Math.round(record.longitude)}&#176;</div> <br></br> 
        <hr></hr> 
        {console.log(record)}
        <h3>{record.name}</h3>
        <img id="cardImage" src={`/64/${record.countrycode}.png`}/><p id="soft-text">{record.c1_school_closing > 0 ? <div style={{color: 'red'}}> Schools Closed </div> : <div style={{color: 'green'}}> Schools Open </div>}</p>
        <p id="soft-text">{record.facial_coverings > 0 ? <div style={{color: 'red'}}> Masks Required </div> : <div style={{color: 'green'}}> No Mask Required </div> }</p>
        <p id="soft-text"><div style={{color: getColor(record.contagionrisk)}}>{record.contagionrisk}</div></p>
        <p id="soft-text">Total % Vaccinated: {record.vacc_complete_pct}</p>
        <p id="soft-text">Total Vaccinated People: {record.vacc_total_people}</p>
        <p id="soft-text">New Cases: {record.new_cases}</p>
        <p id="soft-text">Deaths: {record.deaths}</p>
        <p id="soft-text">New Deaths: {record.new_deaths}</p>
        </Card>
      )}
]