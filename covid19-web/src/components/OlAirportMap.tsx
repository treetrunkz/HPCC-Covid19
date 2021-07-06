import React, {useEffect, useRef, useState} from 'react';
import {Map, View} from 'ol';
import {Vector as VectorLayer} from 'ol/layer';
import ReactDOM from 'react-dom';
import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from "ol/source/Vector";
import Select from "ol/interaction/Select";
import {pointerMove} from "ol/events/condition";
import {Fill, Stroke, Style, Text} from 'ol/style';
import {FeatureLike} from "ol/Feature";
import Overlay from "ol/Overlay";
import {fromLonLat} from "ol/proj";
import {defaults as defaultInteractions} from 'ol/interaction.js'
import OverlayPositioning from "ol/OverlayPositioning";
import {Card, Col, Modal, Row, Statistic, Table, Tag, Space } from "antd";
import {Bar} from "@antv/g2plot";
import {Chart} from "./Chart";


interface Props {
    data: any;
}

const columns = [
    {
      title: 'IATA',
      dataIndex: 'iata',
      key: 'iata',
    //   render: text => <a>{text}</a>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'State',
      key: 'state',
      dataIndex: 'state',
    },
    {
        title: 'Country',
        key: 'country',
        dataIndex: 'country',
    },
    {
        title: 'Latitude',
        key: 'latitude',
        dataIndex: 'latitude',
    },
    {
        title: 'Longitude',
        key: 'longitude',
        dataIndex: 'longitude',
    },
    {
      title: 'School Closing',
      key: 'c1_school_closing',
      dataIndex: 'c1_school_closing',
    },
    {
      title: 'Gathering Restrictions',
      key: 'c4_restrictions_on_gatherings',
      dataIndex: 'c4_restrictions_on_gatherings',
    },
    {
      title: 'Stay At Home Requirements',
      key: 'c6_stay_at_home_requirements',
      dataIndex: 'c6_stay_at_home_requirements',
    },
    {
      title: 'Confirmed Cases',
      key: 'confirmedcases',
      dataIndex: 'confirmedcases',
    },
    {
      title: 'Required Facial Coverings',
      key: 'h6_facial_coverings',
      dataIndex: 'h6_facial_coverings',
    }
]

export default function OlAirportMap(props: Props) {
    const container = useRef<HTMLElement | null>(null);
    const popup = useRef<HTMLElement | null>(null);
    const [tableData, setTableData] = useState<any>([{}]);

    useEffect(() => {
        setTableData(props.data);
    },[props.data]);

    console.log(tableData);
    return (
        <div>
            <Table dataSource={tableData} columns={columns} ></Table>
        </div>

    )
}