import React, {useEffect, useRef, useState} from 'react';
import {Map, View} from 'ol';
import {Vector as VectorLayer} from 'ol/layer';

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
import {Card, Col, Modal, Row, Statistic, Table} from "antd";
import {Bar} from "@antv/g2plot";
import {Chart} from "./Chart";


interface Props {
    data: any;
}

export default function OlAirportMap(props: Props) {
    const container = useRef<HTMLElement | null>(null);
    const popup = useRef<HTMLElement | null>(null);
    const [tableData, setTableData] = useState<any>();

    const columns = [
        {
          title: 'IATA',
          dataIndex: 'iata',
          key: 'iata',
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
            dataIndex: 'state',
            key: 'state',
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
        },
        {
            title: 'Latitude',
            dataIndex: 'latitude',
            key: 'latitude',
        },
        {
            title: 'Longitude',
            dataIndex: 'longitude',
            key: 'longitude',
        },
        {
            title: 'Stay At Home Req.',
            dataIndex: 'c6_stay_at_home_requirements',
            key: 'c6_stay_at_home_requirements',
        },
        {
            title: 'School Closures',
            dataIndex: 'c1_school_closing',
            key: 'c1_school_closing',
        },
        {
            title: 'Confirmed Cases',
            dataIndex: 'confirmedcases',
            key: 'confirmedcases',
        },
        {
            title: 'Facial Coverings',
            dataIndex: 'h6_facial_coverings',
            key: 'h6_facial_coverings',
        },
        {
            title: 'Gathering Restrictions',
            dataIndex: 'c4_restrictions_on_gatherings',
            key: 'c4_restrictions_on_gatherings',
        },
        {
            title: 'State Name',
            dataIndex: 'statename',
            key: 'statename',
        }
    ]

    useEffect(() => {
        setTableData(props.data);
    },[props.data]);

    
    return (
        <div>
            <Table columns={columns} dataSource={tableData}></Table>
        </div>

    )
}