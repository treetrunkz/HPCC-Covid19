import {Descriptions} from "antd";
import React from "react";
//form component in antd already with dynamic fields just use this instead of hand coding the form
//takes cares of state and all of this

import  TravelForm  from "./components/TravelForm";


export default function Travel() {
    return (
        <div style={{width: 1400, height: 1200, overflow: 'auto', paddingLeft: 10, paddingRight: 10}}>
            {/* <TravelForm></TravelForm> */}
            <TravelForm></TravelForm>
        </div>
    )
}