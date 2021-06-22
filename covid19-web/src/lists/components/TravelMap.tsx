import React, {useEffect, useRef, useState} from "react";
import { QueryData } from "../../components/QueryData";

const TravelMap = () => {
    const queryDestination = useRef(new QueryData('hpccsystems_covid19_query_travel_form'));

    const [source, setSource] = useState<string>('');
    const [destination, setDestination] = useState<string>(''); 
    const mapArray = useRef<any>([]);

    // useEffect(() => {
    //     setSource("USA");
    //     setDestination("USA");
    // })

    let filters = new Map();

    filters.set('recs.Row.city', "SEATTLE");//R user input of city
    filters.set('recs.Row.state', "WA"); //R user input of state
    filters.set('recs.Row.country', "USA"); //R country input of state

    queryDestination.current.initData(filters).then(() => {
        let currentcity = '';
        let currentstate = '';
        let currentcountry = '';

        let destinationcity = '';
        let destinationstate = '';
        let destinationcountry = '';

        let city = queryDestination.current.getData('');

        let mapData = new Map();
        city.forEach((item: any) => {
            let cityData = mapData.get(item.city);
            let stateData = mapData.get(item.state);
            let countryData = mapData.get(item.country);
            console.log(cityData);
            console.log(stateData);
            console.log(countryData);
        })

        });
    
    return (
        <div>
            <p>This is a test</p>
            
        </div>
    )


    };
export default TravelMap;