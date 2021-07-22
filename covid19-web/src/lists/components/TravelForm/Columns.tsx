import {Card} from 'antd';
import React from 'react';

// var statename = record.name;
// var iata = record.iata;
// var cases = record.confirmedcases
// var stayhome = record.c6_stay_at_home_requirements > 0 ? "Stay at Home" : "Free to Roam"
// var school = record.c1_school_closing > 0 ? "Schools Closed" : "Schools Open"
// var masks = record.facial_coverings > 0 ? "Masks Required" : "No Mask Required"
// var gatherings = record.c4_restrictions_on_gatherings > 0 ? "Gatherings Prohibited" : "Groups allowed (Check size)"
export const columns = [
    {
      
      title: '',
      dataIndex: 'iata',
      key: 'iata',
      render: (text: any, record: any) => (
        
        <Card id="cardStyle"> {record.city} {record.state} <div style={{float: 'right', color: 'lightgray'}}><b>{record.iata}</b> {record.latitude}&#176; {record.longitude}&#176;</div> <br></br> 
        <hr></hr> 
        <h3>{record.name}</h3>
        <img id="cardImage" src={record.iata + ".jpg"}></img><p id="soft-text">{record.c1_school_closing > 0 ? "Schools Closed" : "Schools Open"}</p>
        <p id="soft-text">{record.facial_coverings > 0 ? "Masks Required" : "No Mask Required"}</p>
        <p id="soft-text">{record.confirmedcases}</p>
        <p id="soft-text">{}</p><br></br>
        <p id="soft-text">{}</p><br></br>
        </Card>
      )}
]