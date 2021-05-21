import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import {  Row, Col, Form, Input, Button, AutoComplete, Checkbox  } from "antd";
import { DownOutlined, UpOutlined } from '@ant-design/icons';
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

const options = [
  {
    value: 'Seattle',
  },
  {
    value: 'Washington',
  },
  {
    value: 'Atlanta',
  },
  {
    value: 'Georgia',
  },
];

const searchQueries = (values: any) => {
  const state1 = values["field-0"];
  const city1 = values["field-3"];
  const country1 = values["field-6"];

  const state2 = values["field-1"];
  const city2 = values["field-4"];
  const country2 = values["field-7"];

  const state3 = values["field-2"];
  const city3 = values["field-5"];
  const country3 = values["field-8"];

  console.log(values);

  console.log("YOUR STARTING DESTINATION: " + state1 + ", " +  city1 + ", " + country1);
  console.log("ENDING IN: " + state2 + ", " + city2 + ", " + country2);
}
const TravelForm = () => {
  const [expand, setExpand] = useState(false);
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    searchQueries(values)
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
            {expand ? <UpOutlined /> : <DownOutlined />} Collapse
          </a>
    </Form>
)
}
export default TravelForm;






