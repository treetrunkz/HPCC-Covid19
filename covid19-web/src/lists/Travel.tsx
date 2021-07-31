import {Descriptions} from "antd";
import Col from "antd/es/grid/col";
import React from "react";
import "../index.css";
import  TravelForm  from "./components/TravelForm";


export default function Travel() {
    return (
            <div id="travel-window">
            <TravelForm></TravelForm>
            </div>
    )
}