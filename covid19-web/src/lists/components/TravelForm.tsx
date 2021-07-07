
import React, { useState, useRef, useEffect } from 'react';
import {Map as OlMap} from 'ol';
import { QueryData } from "../../components/QueryData";
import {  Row, Col, Form, Input, Button } from "antd";
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import OverlayPositioning from "ol/OverlayPositioning";
import Overlay from "ol/Overlay";
import OlAirportMap from '../../components/OlAirportMap';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Travel from '../Travel';
import { compose } from 'ol/transform';

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

const TravelForm: React.FC = () => {
  
interface Travel {
  city: string;
  state: string;
  country: string;
  itemCount: number;
}


  const queryDestination = useRef(new QueryData('hpccsystems_covid19_query_travel_form'));
  
  const [expand, setExpand] = useState(false);
  const [data, setData] = useState<any>([]);
  const [length, setLength] = useState<any>();
  const [lat, setLat] = useState<any>([]);
  const [long, setLong] = useState<any>([])

  const onFinish = (values: any) => {
    let filters = new Map();

    for (const [key, value] of Object.entries(values)) {
    filters.set(`recs.Row.${key}`, value);//R user input of city
    setLength(`${key}`);
     };
    filters.set('recs.itemcount%21', "1");
    queryDestination.current.initData(filters).then(() => {
      let data2 = queryDestination.current.getData('outDataset');
      setData(data2);
    })
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
            name={`${i}.state`}
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
            name={`${i}.city`}
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
            name={`${i}.country`}
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
    <div>
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
    <OlAirportMap 
        data = {data}
    />
    </div>
)
}

export default TravelForm;