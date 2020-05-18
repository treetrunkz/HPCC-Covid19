import React, {useEffect, useRef} from 'react';
import {Map, View} from 'ol';
import {Vector as VectorLayer} from 'ol/layer';
import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from "ol/source/Vector";
import Select from "ol/interaction/Select";
import {click, pointerMove} from "ol/events/condition";
import {Style, Fill, Stroke, Text} from 'ol/style';
import {FeatureLike} from "ol/Feature";
import Overlay from "ol/Overlay";
import {fromLonLat} from "ol/proj";


interface Props {
    toolTipHandler: (name: string) => string;
    colorHandler: (name: string) => string;
    selectHandler: (name: string) => void;
    geoFile: string;
    geoLat: number;
    geoLong: number;
    geoKeyField: string;
    zoom: number;
}

export default function OlMap(props: Props) {
    const container = useRef<HTMLElement|null>(null);
    const popup = useRef<HTMLElement|null>(null);

    const selectSingleClick = useRef<Select>(new Select({
        condition: click,
        style: selectFunction
    }));

    const selectPointerMove = useRef<Select>(new Select({
        condition: pointerMove,
        style: selectFunction
    }));

    function selectFunction(feature: FeatureLike) {
        const style = new Style({
            fill: new Fill({
                color: getColor(feature),
            }),
            stroke: new Stroke({
                color: 'black',
                width: 3,
            }),
            text: new Text({
                font: '11px Calibri,sans-serif',
                fill: new Fill({
                    color: '#fff',
                }),
                stroke: new Stroke({
                    color: 'gray',
                    width: 1,
                }),
            }),
        });

        style.getText().setText(feature.get('name').toUpperCase());
        return style;
    }

    function getColor(feature: any) {
        return props.colorHandler(feature.get(props.geoKeyField));
    }

    const overlay = new Overlay({
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });

    const map = useRef<Map>(new Map({
        overlays: [overlay],
        view: new View({
            center: [0, 0],
            zoom: 2
        })
    }));

    function colorLayer(geoJsonFileName: string, geoKeyField: string) {
        return new VectorLayer({
            source: new VectorSource({
                // url: 'us-states.json',
                url: geoJsonFileName,
                format: new GeoJSON()
            }),
            style: function (feature) {
                const style = new Style({
                    fill: new Fill({
                        color: props.colorHandler(feature.get(geoKeyField)),
                    }),
                    stroke: new Stroke({
                        color: '#319FD3',
                        width: 1,
                    }),
                    text: new Text({
                        font: '11px Calibri,sans-serif',
                        fill: new Fill({
                            color: '#fff',
                        }),
                        stroke: new Stroke({
                            color: 'gray',
                            width: 1,
                        }),
                    }),
                });

                style.getText().setText(feature.get('name').toUpperCase());
                return style;
            },
        });
    }

    const mount = () => {

        if (container.current && popup.current) {
            let layer: VectorLayer = colorLayer(props.geoFile, props.geoKeyField);

            map.current.addLayer(layer);
            map.current.getView().setCenter(fromLonLat([props.geoLong, props.geoLat]))
            map.current.getView().setZoom(props.zoom);

            overlay.setElement(popup.current);
            map.current.setTarget(container.current);

            map.current.addInteraction(selectSingleClick.current);
            map.current.addInteraction(selectPointerMove.current);

            selectPointerMove.current.on('select', function(e:any) {
                if (e.selected.length > 0) {
                    let feature = e.selected[0];
                    if (popup.current) {
                        popup.current.innerHTML = props.toolTipHandler(feature.get(props.geoKeyField));
                        overlay.setPosition(e.mapBrowserEvent.coordinate);
                    }
                } else {
                    if (popup.current) {
                        popup.current.innerHTML = '';
                    }
                }
            });

            selectSingleClick.current.on('select', function(e:any) {
                if (e.selected.length > 0) {
                    let feature = e.selected[0];
                    props.selectHandler(feature.get(props.geoKeyField));
                } else {
                    props.selectHandler('');
                }
            });

            map.current.render();


        }


        const unmount = () => {
            console.log('unmounted')
            // ...
        }
        return unmount
    }

    useEffect((mount),[]);

    useEffect(() => {
        map.current.getLayers().forEach((layer) => {
            (layer as VectorLayer).getSource().changed();
        })
    })

    return (
        <div>
        <div style={{ height: `74vh`, margin: `1em 0`, borderRadius: `0.5em`, background: '#2b2b2b' }} ref={(e) => (container.current= e)}/>
        <div ref={(e) => (popup.current= e)}/>
        </div>

    )
}