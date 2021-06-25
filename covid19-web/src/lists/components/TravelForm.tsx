/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef } from 'react';
import ReactDOM from 'react';
import { MutableRefObject } from 'react';
import { QueryData } from "../../components/QueryData";
import {  Row, Col, Form, Input, Button, AutoComplete, Checkbox  } from "antd";
import { DownOutlined, UpOutlined } from '@ant-design/icons';

import internal from 'stream';


interface Travel {
  city: string;
  state: string;
  country: string;
  itemCount: number;
}

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 32,
  },
};

const tailLayout = {
  wrapperCol: {
    layout: "Inline",
    offset: 15  ,
    span: 32 ,
  },
};


const searchQueries = (values: any, queryDestination: any) => {

  
  //Destination #1
  const state1 = values["field-0"];
  const city1 = values["field-3"];
  const country1 = values["field-6"];

  //Destination #2
  const state2 = values["field-1"];
  const city2 = values["field-4"];
  const country2 = values["field-7"];
  const itemCount = 1;

  //#1
  const source = {
    city: city1,
    state: state1,
    country: country1,
    itemCount: itemCount
  }

  //#2
  const destination = {
    city: city2,
    state: state2,
    country: country2,
    itemCount: itemCount
  }

  TravelMapper(source, queryDestination);
  TravelMapper(destination, queryDestination);

  console.log("YOUR STARTING DESTINATION: " + state1 + ", " +  city1 + ", " + country1);
  console.log("ENDING IN: " + state2 + ", " + city2 + ", " + country2);

}


const TravelMapper = (travel: Travel, queryDestination: any) => {

  let filters = new Map();

  filters.set('recs.Row.0.city', travel.city);//R user input of city
  filters.set('recs.Row.0.state', travel.state); //R user input of state
  filters.set('recs.Row.0.country', travel.country); //R country input of state
  filters.set('recs.itemcount%21', "1"); //arjuna line
  
  queryDestination.current.initData(filters).then(() => {
    let city = queryDestination.current.getData('');
    let mapData = new Map();
    city.forEach((item: any) => {
      console.log(item.compareRecs);
      mapData.set(item.city, item.state);
    })
    return mapData;
    });
}

const TravelForm = () => {

  const queryDestination = useRef(new QueryData('hpccsystems_covid19_query_travel_form'));
  let rr = queryDestination.current.getJSONData;
  console.log(rr + "answer");
  const returnData = new Map();
  queryDestination.current.getJSONData((item: any) => {
      returnData.set(item.state, item.city);
  })
  console.log(returnData);
  const [expand, setExpand] = useState(false);

  const onFinish = (values: any) => {
    searchQueries(values, queryDestination)
  }

  const onFail = (errorInfo: any) => {
    console.log("failed:", errorInfo);
  };

  const getFields = () => {
    const count = expand ? 3 : 2;
    const children = [];

    for (let i = 0; i < count; i++) {
      children.push(
        <Col key={i}>
          <label>Destination</label>
          
        <Row key={i}>
      <Form.Item
            name={`field-${i}`}
            label={`State`}
        rules={[
          {
            required: true,
            message: "Input your State Before Submitting",
          },
        ]}
      >
        
        <Input />
      </Form.Item>
     
      <Form.Item
            name={`field-${i + 3}`}
            label={`City`}
      rules={[
        {
          required: true,
          message: 'Input the Desired City..',
        }
      ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
            name={`field-${i + 6}`}
            label={`Country`}
      rules={[
        {
          required: true,
          message: 'Input Country Before Submitting',
        }
      ]}
      >
        <Input />
      </Form.Item>
      </Row>
        </Col>
      
      );
    }
    return children;
  };
  return (
    <Form
    {...layout}
    name="basic"
    initialValues={{
      remember: true,
    }}
    onFinish={onFinish}
    onFinishFailed={onFail}
    >
      {getFields()}
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Go
        </Button>
      </Form.Item>
      <a
            style={{
              fontSize: 12,
            }}
            onClick={() => {
              setExpand(!expand);
            }}
          >
            <div>
             
              </div>
            {expand ? <UpOutlined /> : <DownOutlined />} Collapse
          </a>
    </Form>
)
}

export default TravelForm;