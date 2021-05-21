import React, {useEffect, useRef, useState} from "react";
import {Button, Layout, Popover, Radio, Select as DropdownSelect, Skeleton, Space, Spin, Tabs} from "antd";
import {QueryData} from "../components/QueryData";
import Catalog from "../utils/Catalog";
import useStateRef from "../utils/UseStateRef";
import OlRangeMap from "../components/OlRangeMap";
import TextArea from "antd/es/input/TextArea";


// const FormDetail = () => {
//     const [location, setLocation] = useState<string>('');
//     const locationStack = useRef<any>([]);
//     const formLocation = useRef(new QueryData(''))
//     const [locationUUID, setLocationUUID] = useState<string>('');
//     const [loading, setLoading] = useState<boolean>(true);


// // useEffect(() => {
// //     function getFormLocationUUID() {
// //         let uuid: string = ":";
// //         uuid += locationStack.current;
// //     }
// // return null;
// // }
// }

