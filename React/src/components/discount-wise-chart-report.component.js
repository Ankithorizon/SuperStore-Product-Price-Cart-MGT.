import React, { Component } from "react";
import Chart from "react-google-charts";

export default class DiscountWiseChartReport extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {

        const { salesProgressData, reportOption, chartDatas, productId, productName, year, responseMessage } = this.props;
     
        let salesProgressDataList = salesProgressData.length > 0
            && salesProgressData.map((item, i) => {
                return (
                    <div key={i} value={item.discountPercentage} >
                        {item.salesEffect === "UP" ? (
                            <span
                                className="salesProgressDataList_UP">
                                {item.discountPercentage}%
                                &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;[{item.salesEffect}] &nbsp;
                                {item.effectInPercentage}%
                            </span>
                        ) : (
                            <span>
                                {item.salesEffect === "DOWN" ? (
                                    <span
                                        className="salesProgressDataList_DOWN">
                                        {item.discountPercentage}%
                                        &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;[{item.salesEffect}] &nbsp;
                                        {item.effectInPercentage}%
                                    </span>
                                ) : (
                                    <span
                                        className="salesProgressDataList_REF">
                                        Ref [{item.discountPercentage}%]
                                        &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;Ref Sales [${item.totalSales}]
                                    </span>
                                )}
                            </span>

                        )}
                    </div>
                )
            }, this);
        
        return (
            <div className="container">
                {reportOption == 'ProductDiscountWise' ? (
                    <div>
                        <div className="monthlyStoreWiseTextHeader">
                            <h2>Product - Discount Wise Sales Report [ {year} ]</h2>
                            <b><h4>Product # {productId} [{productName}]</h4></b>
                        </div>
                        <p></p>

                        <div className="row">
                            <div className="col-sm-8">
                                <div style={{ display: 'flex' }}>
                                    {chartDatas.length > 0 ? (
                                        <Chart
                                            width={700}
                                            height={500}
                                            chartType="ColumnChart"
                                            loader={<div>Loading Chart</div>}
                                            data={chartDatas}
                                            options={{
                                                title: productName +' - Discount Wise Sales Report [ ' + year + ' ]',
                                                chartArea: { width: '70%' },
                                                hAxis: {
                                                    title: 'DiscountPercentage',
                                                    minValue: 0,
                                                },
                                                vAxis: {
                                                    title: 'Sales',
                                                },
                                            }}
                                            legendToggle
                                        />
                                    ) : (
                                        <div>
                                            {responseMessage ? (
                                                <div>
                                                    <p></p>
                                                    <div className="chartDataErrorMessage">
                                                        <h5>{responseMessage}</h5>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div></div>
                                            )}
                                        </div>
                                    )
                                    }
                                </div>
                            </div>
                            <div className="col-sm-1">
                            </div>
                            <div className="col-sm-3">
                                <div className="row salesProgressHeader">
                                    <div className="col-5">
                                        Discount %
                                    </div>
                                    <div className="col-7">
                                        Sales Progress %
                                    </div>
                                </div>
                                {salesProgressDataList}
                            </div>
                        </div>
                       
                    </div>
                ): (
                    <span></span>
                )
            }               
            </div>
        );
    }
}