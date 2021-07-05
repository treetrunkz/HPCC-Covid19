import React, { useState, useRef } from 'react';
import ReactDOM from 'react';
import { MutableRefObject } from 'react';
import { QueryData } from "../../components/QueryData";
import {  Row, Col, Form, Input, Button, AutoComplete, Checkbox  } from "antd";
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import OlAirportMap from '../../components/OlAirportMap';


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


const TravelForm = (values: any) => {
  const [expand, setExpand] = useState(false);
  const [data, setData] = useState<any>([]);

  const queryDestination = useRef(new QueryData('hpccsystems_covid19_query_travel_form'));
  let filters = new Map();
  console.log(queryDestination)

  const objectSetter = (values: any) => {
    
  for (const [key, value] of Object.entries(values)) {
    filters.set(`recs.Row.${key}`, `${value}`);
  }
  filters.set('recs.itemcount%21', "1");
  console.log(filters);

  queryDestination.current.initData(filters).then(() => {
    let data = queryDestination.current.getData('outDataset');
    data.forEach((item: any) => {
      setData(item);
    })
  })
}




  const onFinish = (values: any) => {
    objectSetter(values)
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
          ></OlAirportMap>
    </div>
)
}

export default TravelForm;