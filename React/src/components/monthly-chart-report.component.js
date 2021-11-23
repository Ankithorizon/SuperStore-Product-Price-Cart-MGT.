import React, { Component } from "react";
import Chart from "react-google-charts";

export default class MonthlyChartReport extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        const { title, chartDatas, year} = this.props;
        return (
            <div className="container">
                <div className="monthlyStoreWiseTextHeader">
                    <h2>Sales Report [ {year} ]</h2>
                    {title}
                </div>
                <p></p>
                <div style={{ display: 'flex' }}>
                    <Chart
                        width={700}
                        height={500}
                        chartType="ColumnChart"
                        loader={<div>Loading Chart</div>}
                        data={chartDatas}
                        options={{
                            title: title,
                            chartArea: { width: '70%' },
                            hAxis: {
                                title: 'Month',
                                minValue: 0,
                            },
                            vAxis: {
                                title: 'Sales',
                            },
                        }}
                        legendToggle
                    />
                </div>              
            </div>
        );
    }
}