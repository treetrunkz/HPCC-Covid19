
import React, { useState, useRef, useEffect } from 'react';

import { QueryData } from "../../components/QueryData";
import {  Row, Col, Form, Input, Button } from "antd";
import { DownOutlined, UpOutlined } from '@ant-design/icons';

import "../../index.css"

import OlAirportMap from '../../components/OlAirportMap';

import { Layout, Menu } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 12,
  },
};

const tailLayout = {
  wrapperCol: {
    layout: "Inline",
    offset: 4  ,
    span: 17 ,
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

  const onFinish = (values: any) => {

    let filters = new Map();
    for (const [key, value] of Object.entries(values)) {
      filters.set(`recs.Row.${key}`, value);
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
         <Layout id="inputform">
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
              width: "100%",
            }}
            onClick={() => {
              setExpand(!expand);
            }}
          >Collapse</a>
            {expand ? <UpOutlined /> : <DownOutlined />}
      </Form>
      </Layout>
                <OlAirportMap 
                    data = {data}
                />

    </div>

  )
}

export default TravelForm;