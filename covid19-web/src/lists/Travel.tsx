import {Descriptions} from "antd";
import React from "react";

import  TravelForm  from "./components/TravelForm";


export default function Travel() {
    return (
        <div style={{width: 1200, height: 795, overflow: 'auto', paddingLeft: 10, paddingRight: 10}}>
            <TravelForm></TravelForm>
        </div>
    )
}