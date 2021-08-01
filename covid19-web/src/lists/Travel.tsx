import {Descriptions} from "antd";
import Col from "antd/es/grid/col";
import React from "react";
import "../index.css";
import  TravelForm  from "./components/TravelForm";


export default function Travel() {
    return (
        <div style={{width: 1400, height: 1000, overflow: 'auto', paddingLeft: 10, paddingRight: 10}}>
            <TravelForm></TravelForm>
        </div>
    )
}