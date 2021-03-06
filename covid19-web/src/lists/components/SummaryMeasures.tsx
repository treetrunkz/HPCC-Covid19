import React from 'react';
import {Card, Col, Layout, Row, Statistic} from "antd";
import {Chart} from "../../components/Chart";
import {Bar} from "@antv/g2plot";

interface SummaryMeasuresProps {
    summaryData: any;
}

const SummaryMeasures = (props: SummaryMeasuresProps) => {


    const renderCommaFormattedValue= (value: any) => {
        if (value) {
            return Math.trunc(value).toLocaleString()
        } else {
            return ''
        }
    }
    const renderOptionalValue= (value: any) => {
        if (value) {
            return '  (' + value + ' per 100K)'
        } else {
            return ''
        }
    }

    const chartModelData = [{"name": "Contagion Risk", "value": props.summaryData.contagion_risk},
        {"name": "Infection Rate (R)", "value": props.summaryData.r},
        {"name": "Cases Rate (cR)", "value": props.summaryData.cr},
        {"name": "Mortality Rate (mR)", "value": props.summaryData.mr},
        {"name": "Social Distance Indicator", "value": props.summaryData.sd_indicator},
        {"name": "Medical Indicator", "value": props.summaryData.med_indicator},
        {"name": "Case Fatality Rate", "value": props.summaryData.cfr},
        {"name": "Infection Fatality Rate", "value": props.summaryData.ifr},
        {"name": "Heat Index", "value": props.summaryData.heat_index},
        {"name": "Short Term Indicator", "value": props.summaryData.sti},
        {"name": "Early Warning Indicator", "value": props.summaryData.ewi},
        {"name": "Immune Percent", "value": props.summaryData.immune_pct/100.0},
    ];

    const chartModel = {
        padding: 'auto',
        title: {
            text: 'Weekly Metrics ' + props.summaryData.period_string,
            visible: false,
            style: {fontSize: 14, fontWeight: 'bold'}
        },
        forceFit: true,
        label: {
            visible: true,
            style: {
                strokeColor: 'black'
            }
        },
        xAxis: {
            title: {visible: false}
        },
        color: (d: any) => {
            return d === 'Infection Rate (R)' ? '#6394f8' :
                d === 'Case Rate (cR)' ? '#61d9aa' :
                    d === 'Mortality Rate (mR)' ? '#657797' :
                        d === 'Social Distance Indicator' ? '#f6c02c' :
                            d === 'Medical Indicator' ? '#7a4e48' :
                                d === 'Case Fatality Rate' ? '#6dc8ec' :
                                    d === 'Short Term Indicator' ? 'gray':
                                        d === 'Infection Fatality Rate' ? 'red':
                                            d === 'Early Warning Indicator' ? 'cyan':
                                                d === 'Immune Percent' ? 'lightgray': '#9867bc'
        },
        colorField: 'name',
        data: [],
        xField: 'value',
        yField: 'name',

    }

        return (
        <Layout style={{width:"100%"}}>

            <Row>
                <Col span={12}>
                    <div style={{fontSize: 16, fontWeight: 'bold', paddingBottom: 10, paddingTop: 10}}>Cases Data
                    </div>
                    <Card>
                        <Statistic
                            title={"Infection State"}
                            value={props.summaryData.status}
                            valueStyle={{color: '#cf1322'}}
                        />
                    </Card>
                    <Card>
                        <Statistic
                            title={"New Cases on " + props.summaryData.date_string}
                            value={props.summaryData.new_cases}
                            valueStyle={{color: '#cf1322'}}
                        />
                    </Card>
                    <Card>
                        <Statistic
                            title={"New Deaths on " + props.summaryData.date_string}
                            value={props.summaryData.new_deaths}
                            valueStyle={{color: '#cf1322'}}
                        />
                    </Card>
                    <Card>
                        <Statistic
                            title={"Total Active as of " + props.summaryData.date_string}
                            value={props.summaryData.active}
                            valueStyle={{color: '#cf1322'}}
                        />
                    </Card>
                    <Card>
                        <Statistic
                            title={"Total Recovered as of " + props.summaryData.date_string}
                            value={props.summaryData.recovered}
                            valueStyle={{color: '#cf1322'}}
                        />
                    </Card>
                    <Card>
                        <Statistic
                            title={"Total Cases as of " + props.summaryData.date_string}
                            value={renderCommaFormattedValue(props.summaryData.cases) + renderOptionalValue(props.summaryData.cases_per_capita)}
                            valueStyle={{color: '#cf1322'}}
                        />
                    </Card>
                    <Card>
                        <Statistic
                            title={"Total Deaths as of " + props.summaryData.date_string}
                            value={renderCommaFormattedValue(props.summaryData.deaths) + renderOptionalValue(props.summaryData.deaths_per_capita)}
                            valueStyle={{color: '#cf1322'}}
                        />
                    </Card>
                    <Card>
                        <Statistic
                            title={"Weekly New Cases - " + props.summaryData.period_string}
                            value={props.summaryData.period_new_cases}
                            valueStyle={{color: '#cf1322'}}
                        />
                    </Card>
                    <Card>
                        <Statistic
                            title={"Weekly New Deaths - " + props.summaryData.period_string}
                            value={props.summaryData.period_new_deaths}
                            valueStyle={{color: '#cf1322'}}
                        />
                    </Card>
                </Col>
                <Col span={12} style={{paddingLeft: 25}}>
                    <Row>
                        <div style={{fontSize: 16, fontWeight: 'bold', paddingBottom: 10, paddingTop: 10}}>
                            {'Weekly Metrics ' + props.summaryData.period_string}
                        </div>
                        <Col span={24}>
                            <Chart chart={Bar} config={chartModel} data={chartModelData}/>
                        </Col>
                    </Row>

                </Col>

            </Row>



        </Layout>
    );


}

export default SummaryMeasures;