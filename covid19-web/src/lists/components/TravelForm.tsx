
import React, { useState, useRef, useEffect } from 'react';
import { QueryData } from "../../components/QueryData";
import {  Row, Col, Form, Input, Button, Select } from "antd";
import { DownOutlined, UpOutlined } from '@ant-design/icons';

import "../../index.css"

import OlAirportMap from '../../components/OlAirportMap';

import { Layout, Menu } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import { Filters } from '../../utils/Filters';
const optionArray = [];
const { Option } = Select;

const layout = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
  },
};

const tailLayout = {
  wrapperCol: {
    layout: "Inline",
    offset: 4,
    span: 30,
  },
};

const TravelForm = () => {

interface Travel {
  city: string;
  state: string;
  country: string;
  itemCount: number;
}

  const queryDestination = useRef(new QueryData('hpccsystems_covid19_query_travel_form'));
  const queryCountries = useRef(new QueryData('hpccsystems_covid19_query_travel_countries'));
  
  const [expand, setExpand] = useState(false);
  const [travelData, setTravelData] = useState<any>([]);
  const [countriesData, setCountriesData] = useState<any>([]);
    
  useEffect(() => {
    let filters = new Map();
    console.log("useeffect travelform");
    queryCountries.current.initData(filters).then(() => {
        let data = queryCountries.current.getData('countries_metrics');  
        console.log(data);
        setCountriesData(data);
    })
  }, [])


  const onFinish = (values: any) => {
    console.log(values);
    let filters = new Map();
    for (const [key, value] of Object.entries(values)) {
      filters.set(`recs.Row.${key}`, value);
      };
    filters.set('recs.itemcount%21', "1");

    queryDestination.current.initData(filters).then(() => {
      let data = queryDestination.current.getData('travel_search');  
      setTravelData(data);
      console.log(data);
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
      
            name={`${i}.countryCode`}
            label={`Country`}
      rules={[
        {
          required: true,
          message: 'Input Country Before Submitting',
        }
      ]}
      >
        <Select
          style={{width: '150px'}}
          placeholder="Select"
          showSearch 
          optionFilterProp="children"
        >
          <Option value="AF"> Afghanistan </Option>
          <Option value="AX"> Aland Islands </Option>
          <Option value="AL"> Albania </Option>
          <Option value="DZ"> Algeria </Option>
          <Option value="AS"> American Samoa </Option>
          <Option value="AD"> Andorra </Option>
          <Option value="AO"> Angola </Option>
          <Option value="AI"> Anguilla</Option>
          <Option value="AQ"> Antarctica</Option>
          <Option value="AG"> Antigua And Barbuda</Option>
          <Option value="AR"> Argentina</Option>
          <Option value="AM"> Armenia</Option>
          <Option value="AW"> Aruba</Option>
          <Option value="AU"> Australia</Option>
          <Option value="AT"> Austria</Option>
          <Option value="AZ"> Azerbaijan</Option>
          <Option value="BS"> Bahamas</Option>
          <Option value="BH"> Bahrain</Option>
          <Option value="BD"> Bangladesh</Option>
          <Option value="BB"> Barbados</Option>
          <Option value="BY"> Belarus</Option>
          <Option value="BE"> Belgium</Option>
          <Option value="BZ"> Belize</Option>
          <Option value="BJ"> Benin</Option>
          <Option value="BM"> Bermuda</Option>
          <Option value="BT"> Bhutan</Option>
          <Option value="BO"> Bolivia</Option>
          <Option value="BA"> Bosnia And Herzegovina</Option>
          <Option value="BW"> Botswana</Option>
          <Option value="BV"> Bouvet Island</Option>
          <Option value="BR"> Brazil</Option>
          <Option value="IO"> British Indian Ocean Territory</Option>
          <Option value="BN"> Brunei Darussalam</Option>
          <Option value="BG"> Bulgaria</Option>
          <Option value="BF"> Burkina Faso</Option>
          <Option value="BI"> Burundi</Option>
          <Option value="KH"> Cambodia</Option>
          <Option value="CM"> Cameroon</Option>
          <Option value="CA"> Canada</Option>
          <Option value="CV"> Cape Verde</Option>
          <Option value="KY"> Cayman Islands</Option>
          <Option value="CF"> Central African Republic</Option>
          <Option value="TD"> Chad</Option>
          <Option value="CL"> Chile</Option>
          <Option value="CN"> China</Option>
          <Option value="CX"> Christmas Island</Option>
          <Option value="CC"> Cocos (Keeling) Islands</Option>
          <Option value="CO"> Colombia</Option>
          <Option value="KM"> Comoros</Option>
          <Option value="CG"> Congo</Option>
          <Option value="CD"> Congo, Democratic Republic</Option>
          <Option value="CK"> Cook Islands</Option>
          <Option value="CR"> Costa Rica</Option>
          <Option value="CI"> Cote D"Ivoire', </Option>
          <Option value="HR"> Croatia</Option>
          <Option value="CU"> Cuba</Option>
          <Option value="CY"> Cyprus</Option>
          <Option value="CZ"> Czech Republic</Option>
          <Option value="DK"> Denmark</Option>
          <Option value="DJ"> Djibouti</Option>
          <Option value="DM"> Dominica</Option>
          <Option value="DO"> Dominican Republic</Option>
          <Option value="EC"> Ecuador</Option>
          <Option value="EG"> Egypt</Option>
          <Option value="SV"> El Salvador</Option>
          <Option value="GQ"> Equatorial Guinea</Option>
          <Option value="ER"> Eritrea</Option>
          <Option value="EE"> Estonia</Option>
          <Option value="ET"> Ethiopia</Option>
          <Option value="FK"> Falkland Islands (Malvinas)</Option>
          <Option value="FO"> Faroe Islands</Option>
          <Option value="FJ"> Fiji</Option>
          <Option value="FI"> Finland</Option>
          <Option value="FR"> France</Option>
          <Option value="GF"> French Guiana</Option>
          <Option value="PF"> French Polynesia</Option>
          <Option value="TF"> French Southern Territories</Option>
          <Option value="GA"> Gabon</Option>
          <Option value="GM"> Gambia</Option>
          <Option value="GE"> Georgia</Option>
          <Option value="DE"> Germany</Option>
          <Option value="GH"> Ghana</Option>
          <Option value="GI"> Gibraltar</Option>
          <Option value="GR"> Greece</Option>
          <Option value="GL"> Greenland</Option>
          <Option value="GD"> Grenada</Option>
          <Option value="GP"> Guadeloupe</Option>
          <Option value="GU"> Guam</Option>
          <Option value="GT"> Guatemala</Option>
          <Option value="GG"> Guernsey</Option>
          <Option value="GN"> Guinea</Option>
          <Option value="GW"> Guinea-Bissau</Option>
          <Option value="GY"> Guyana</Option>
          <Option value="HT"> Haiti</Option>
          <Option value="HM"> Heard Island & Mcdonald Islands</Option>
          <Option value="VA"> Holy See (Vatican City State)</Option>
          <Option value="HN"> Honduras</Option>
          <Option value="HK"> Hong Kong</Option>
          <Option value="HU"> Hungary</Option>
          <Option value="IS"> Iceland</Option>
          <Option value="IN"> India</Option>
          <Option value="ID"> Indonesia</Option>
          <Option value="IR"> Iran, Islamic Republic Of</Option>
          <Option value="IQ"> Iraq</Option>
          <Option value="IE"> Ireland</Option>
          <Option value="IM"> Isle Of Man</Option>
          <Option value="IL"> Israel</Option>
          <Option value="IT"> Italy</Option>
          <Option value="JM"> Jamaica</Option>
          <Option value="JP"> Japan</Option>
          <Option value="JE"> Jersey</Option>
          <Option value="JO"> Jordan</Option>
          <Option value="KZ"> Kazakhstan</Option>
          <Option value="KE"> Kenya</Option>
          <Option value="KI"> Kiribati</Option>
          <Option value="KR"> Korea</Option>
          <Option value="KP"> North Korea</Option>
          <Option value="KW"> Kuwait</Option>
          <Option value="KG"> Kyrgyzstan</Option>
          <Option value="LA"> Lao People"s Democratic Republic' </Option>
          <Option value="LV"> Latvia</Option>
          <Option value="LB"> Lebanon</Option>
          <Option value="LS"> Lesotho</Option>
          <Option value="LR"> Liberia</Option>
          <Option value="LY"> Libyan Arab Jamahiriya</Option>
          <Option value="LI"> Liechtenstein</Option>
          <Option value="LT"> Lithuania</Option>
          <Option value="LU"> Luxembourg</Option>
          <Option value="MO"> Macao</Option>
          <Option value="MK"> Macedonia</Option>
          <Option value="MG"> Madagascar</Option>
          <Option value="MW"> Malawi</Option>
          <Option value="MY"> Malaysia</Option>
          <Option value="MV"> Maldives</Option>
          <Option value="ML"> Mali</Option>
          <Option value="MT"> Malta</Option>
          <Option value="MH"> Marshall Islands</Option>
          <Option value="MQ"> Martinique</Option>
          <Option value="MR"> Mauritania</Option>
          <Option value="MU"> Mauritius</Option>
          <Option value="YT"> Mayotte</Option>
          <Option value="MX"> Mexico</Option>
          <Option value="FM"> Micronesia, Federated States Of</Option>
          <Option value="MD"> Moldova</Option>
          <Option value="MC"> Monaco</Option>
          <Option value="MN"> Mongolia</Option>
          <Option value="ME"> Montenegro</Option>
          <Option value="MS"> Montserrat</Option>
          <Option value="MA"> Morocco</Option>
          <Option value="MZ"> Mozambique</Option>
          <Option value="MM"> Myanmar</Option>
          <Option value="NA"> Namibia</Option>
          <Option value="NR"> Nauru</Option>
          <Option value="NP"> Nepal</Option>
          <Option value="NL"> Netherlands</Option>
          <Option value="AN"> Netherlands Antilles</Option>
          <Option value="NC"> New Caledonia</Option>
          <Option value="NZ"> New Zealand</Option>
          <Option value="NI"> Nicaragua</Option>
          <Option value="NE"> Niger</Option>
          <Option value="NG"> Nigeria</Option>
          <Option value="NU"> Niue</Option>
          <Option value="NF"> Norfolk Island</Option>
          <Option value="MP"> Northern Mariana Islands</Option>
          <Option value="NO"> Norway</Option>
          <Option value="OM"> Oman</Option>
          <Option value="PK"> Pakistan</Option>
          <Option value="PW"> Palau</Option>
          <Option value="PS"> Palestinian Territory, Occupied</Option>
          <Option value="PA"> Panama</Option>
          <Option value="PG"> Papua New Guinea</Option>
          <Option value="PY"> Paraguay</Option>
          <Option value="PE"> Peru</Option>
          <Option value="PH"> Philippines</Option>
          <Option value="PN"> Pitcairn</Option>
          <Option value="PL"> Poland</Option>
          <Option value="PT"> Portugal</Option>
          <Option value="PR"> Puerto Rico</Option>
          <Option value="QA"> Qatar</Option>
          <Option value="RE"> Reunion</Option>
          <Option value="RO"> Romania</Option>
          <Option value="RU"> Russian Federation</Option>
          <Option value="RW"> Rwanda</Option>
          <Option value="BL"> Saint Barthelemy</Option>
          <Option value="SH"> Saint Helena</Option>
          <Option value="KN"> Saint Kitts And Nevis</Option>
          <Option value="LC"> Saint Lucia</Option>
          <Option value="MF"> Saint Martin</Option>
          <Option value="PM"> Saint Pierre And Miquelon</Option>
          <Option value="VC"> Saint Vincent And Grenadines</Option>
          <Option value="WS"> Samoa</Option>
          <Option value="SM"> San Marino</Option>
          <Option value="ST"> Sao Tome And Principe</Option>
          <Option value="SA"> Saudi Arabia</Option>
          <Option value="SN"> Senegal</Option>
          <Option value="RS"> Serbia</Option>
          <Option value="SC"> Seychelles</Option>
          <Option value="SL"> Sierra Leone</Option>
          <Option value="SG"> Singapore</Option>
          <Option value="SK"> Slovakia</Option>
          <Option value="SI"> Slovenia</Option>
          <Option value="SB"> Solomon Islands</Option>
          <Option value="SO"> Somalia</Option>
          <Option value="ZA"> South Africa</Option>
          <Option value="GS"> South Georgia And Sandwich Isl</Option>
          <Option value="ES"> Spain</Option>
          <Option value="LK"> Sri Lanka</Option>
          <Option value="SD"> Sudan</Option>
          <Option value="SR"> Suriname</Option>
          <Option value="SJ"> Svalbard And Jan Mayen</Option>
          <Option value="SZ"> Swaziland</Option>
          <Option value="SE"> Sweden</Option>
          <Option value="CH"> Switzerland</Option>
          <Option value="SY"> Syrian Arab Republic</Option>
          <Option value="TW"> Taiwan</Option>
          <Option value="TJ"> Tajikistan</Option>
          <Option value="TZ"> Tanzania</Option>
          <Option value="TH"> Thailand</Option>
          <Option value="TL"> Timor-Leste</Option>
          <Option value="TG"> Togo</Option>
          <Option value="TK"> Tokelau</Option>
          <Option value="TO"> Tonga</Option>
          <Option value="TT"> Trinidad And Tobago</Option>
          <Option value="TN"> Tunisia</Option>
          <Option value="TR"> Turkey</Option>
          <Option value="TM"> Turkmenistan</Option>
          <Option value="TC"> Turks And Caicos Islands</Option>
          <Option value="TV"> Tuvalu</Option>
          <Option value="UG"> Uganda</Option>
          <Option value="UA"> Ukraine</Option>
          <Option value="AE"> United Arab Emirates</Option>
          <Option value="GB"> United Kingdom</Option>
          <Option value="US"> United States</Option>
          <Option value="UY"> Uruguay</Option>
          <Option value="UZ"> Uzbekistan</Option>
          <Option value="VU"> Vanuatu</Option>
          <Option value="VE"> Venezuela</Option>
          <Option value="VN"> Vietnam</Option>
          <Option value="VG"> Virgin Islands, British</Option>
          <Option value="VI"> Virgin Islands, U.S.</Option>
          <Option value="WF"> Wallis And Futuna</Option>
          <Option value="EH"> Western Sahara</Option>
          <Option value="YE"> Yemen</Option>
          <Option value="ZM"> Zambia</Option>
          <Option value="ZW"> Zimbabwe</Option>
        </Select>
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
                    travelData = {travelData}
                    countriesData = {countriesData}                
                />

    </div>

  )
}

export default TravelForm;