import React, { Component } from "react";
import AuthService from "../services/auth.service";
import Chart from "react-google-charts";
import { Card } from "react-bootstrap";
import ReportDataService from "../services/report.service";
import Select from 'react-select';
import MonthlyChartReport from "./monthly-chart-report.component";
import DiscountWiseChartReport from "./discount-wise-chart-report.component";

const productImageUploadURL = {
    url: "https://localhost:44396/Files"
};

export default class ChartReport extends Component {
    constructor(props) {
        super(props);

        this.onReportOptionChange = this.onReportOptionChange.bind(this);
        this.onChangeYear = this.onChangeYear.bind(this);

        this.state = {

            title: '',
            reportOption: 'MonthlyTotalStoreWise',
            showMonthlyStoreWise: true,
            showYearlyProductWise: false,
            showProductDiscountWise: false,

            year: '',

            productId: 0,
            productName: '',
            selectedOption: null,

            years: [],
            products: [],

            submitted: false,

            isError: {
                year: '',
                productId: ''
            },

            // report data     
            chartDatas: [],
            responseMessage: '',

            salesProgressData: []
        };

        // check for logged in or not,,, to prevent browser back history
        if (AuthService.getCurrentUser() === null) {
            this.props.history.push('/login');
            window.location.reload();
        }
    }

    componentDidMount() {
        // this.getChartData();
        this.getYears();
        this.getProducts();
    }  

    getYears() {
        this.setState({
            years: [...this.state.years, ...[
                {
                    yearId: 2021, yearNumber: '2021'
                },
                {
                    yearId: 2020, yearNumber: '2020'
                }
            ]]
        });
    }
    getProducts() {
        ReportDataService.getProductsWithImage()
            .then(response => {
                // console.log(response.data);
                // x-fer
                var options1_ = [];
                response.data.map((item, i) => {
                    console.log(item.productName);
                    var option = {
                        value: item.productId + '-' + item.productName,
                        label:
                            <div>
                                <img
                                    width="35" height="35"
                                    src={`${productImageUploadURL.url}/${item.productImage}`}
                                    alt="Product Image"
                                />
                                <span> - </span>
                                <span>
                                    {item.productName}
                                </span>
                                <span> - </span>
                                <span>
                                    [ ${item.currentPrice} ]
                                </span>
                            </div>
                    }
                    options1_.push(option);
                });
                this.setState({
                    products: options1_
                });
            })
            .catch(e => {
                console.log(e);
                this.unAuthHandler401(e);
            });
    }
    // check for 401
    unAuthHandler401 = (error) => {
        if (error.response.status === 401) {
            console.log('Un-Authorized!');
            this.props.history.push('/un-auth');
            window.location.reload();
        }
        if (error.response.status === 403) {
            console.log('Un-Authorized!');
            this.props.history.push('/un-auth');
            window.location.reload();
        }
    }

    onChangeYear = (event) => {
        let isError = { ...this.state.isError };
        isError.year =
            event.target.value == '' ? "Year : Required !" : "";

        this.setState({
            year: event.target.value,
            isError
        });
    }
    handleChange = (selectedOption) => {
        var productId = (selectedOption.value).substring(0, (selectedOption.value).indexOf('-'));
        var productName = (selectedOption.value).substring((selectedOption.value).indexOf('-') + 1);

        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);

        let isError = { ...this.state.isError };
        isError.productId =
            // selectedOption.value == '' ? "Product : Required !" : "";
            productId == '' ? "Product : Required !" : "";

        this.setState({
            // productId: selectedOption.value,
            productId: productId,
            productName: productName,
            isError,
            selectedOption,
        });
    }
    onReportOptionChange(event) {
        this.setState({
            reportOption: event.target.value,
            chartDatas: [],
            productName: '',
            productId: 0,
            responseMessage: '',
            salesProgressData: []
        });
        console.log(this.state.reportOption);
    }

    initChartDatasArray = () => {
        var chartDatas_ = [];
        var firstItem = ['Month', 'Sales'];
        chartDatas_.push(firstItem);
        return chartDatas_;
    }
    initDiscountChartDatasArray = () => {
        var chartDatas_ = [];
        var firstItem = ['DiscountPercentage', 'Sales'];
        chartDatas_.push(firstItem);
        return chartDatas_;
    }
    onSubmit = e => {
        e.preventDefault();

        // un-touched and null form check
        if (this.state.reportOption == 'MonthlyTotalStoreWise') {
            console.log('Store-Wise');
            // need only year
            if (this.state.year == '') {
                let isError = { ...this.state.isError };
                isError.year = "YY : Required !";

                this.setState({
                    isError
                });
                return;
            }
            else {
                // prepare object for api call
                var monthlyTotalSalesData = {
                    selectedYear: this.state.year // ip
                    // selectedYear: 'invalid-year' // ip
                };
                // api call
                ReportDataService.textReportMonthly(monthlyTotalSalesData)
                    .then(response => {
                        console.log(response);
                        if (response.data.length > 0) {
                            var chartDatas_ = this.initChartDatasArray();
                            response.data.map((item, i) => {
                                // console.log(item.monthName + ' : ' + item.totalSales);
                                chartDatas_.push([item.monthName, item.totalSales])
                            });
                            this.setState({
                                chartDatas: chartDatas_,
                                title: 'Monthly Store - Wise [Chart Report]'
                            });
                        }
                        else {
                            this.setState({
                                chartDatas: [],
                                responseMessage: '[Yearly/Monthly]-Store Data Not Found !',
                                title: ''
                            });
                        }
                    })
                    .catch(error => {
                        if (error.response.status == 500) {
                            console.log("FAIL : Server Error !");
                        }
                        else if (error.response.status == 400) {
                            console.log("FAIL : Bad Request !");
                        }
                        else {
                            this.unAuthHandler401(error);
                        }
                    });
            }
        }
        else if (this.state.reportOption == 'YearlyProductWise') {
            console.log('Product-Wise-Yearly');
            // need year and productId
            if (this.state.year == '' || this.state.productId == '') {
                if (this.state.year == '') {
                    let isError = { ...this.state.isError };
                    isError.year = "Year : Required !";
                    this.setState({
                        isError
                    });
                }
                if (this.state.productId == '') {
                    let isError = { ...this.state.isError };
                    isError.productId = "Product : Required !";
                    this.setState({
                        isError
                    });
                }
                return;
            }
            else {
                // prepare object for api call
                var yearlyProductWiseSalesData = {
                    selectedYear: this.state.year, // ip
                    selectedProductId: Number(this.state.productId) // ip
                };
                ReportDataService.textReportYearlyProductWise(yearlyProductWiseSalesData)
                    .then(response => {
                        console.log(response);
                        if (response.data.length > 0) {
                            var chartDatas_ = this.initChartDatasArray();
                            response.data.map((item, i) => {
                                chartDatas_.push([item.monthName, item.totalSales])
                            });
                            this.setState({
                                chartDatas: chartDatas_,
                                title: 'Monthly Product # [ ' + this.state.productName + '] - Wise [Chart Report]'
                            });
                        }
                        else {
                            this.setState({
                                chartDatas: [],
                                responseMessage: '[Yearly/Monthly]-Product Data Not Found !',
                                title: ''
                            });
                        }
                    })
                    .catch(error => {
                        if (error.response.status == 500) {
                            console.log("FAIL : Server Error !");
                        }
                        else if (error.response.status == 400) {
                            console.log("FAIL : Bad Request !");
                        }
                        else {
                            this.unAuthHandler401(error);
                        }
                    });
            }
        }
        else if (this.state.reportOption == 'ProductDiscountWise') {
            console.log('Product-Discount-Wise-Yearly');
            // need year and productId
            if (this.state.year == '' || this.state.productId == '') {
                if (this.state.year == '') {
                    let isError = { ...this.state.isError };
                    isError.year = "Year : Required !";
                    this.setState({
                        isError
                    });
                }
                if (this.state.productId == '') {
                    let isError = { ...this.state.isError };
                    isError.productId = "Product : Required !";
                    this.setState({
                        isError
                    });
                }
                return;
            }
            else {
                // prepare object for api call
                var productDiscountWiseSalesData = {
                    selectedYear: this.state.year, // ip
                    selectedProductId: Number(this.state.productId) // ip
                };
                ReportDataService.textReportProductDiscountWise(productDiscountWiseSalesData)
                    .then(response => {
                        if (response.data.length > 0) {


                            // process sales data

                            // dummy data for check
                            /*
                            var data1 = [];
                            var dataIn1 = {
                                discountPercentage: 5,
                                totalSales: 500
                            };
                            var dataIn2 = {
                                discountPercentage: 10,
                                totalSales: 800
                            };
                            var dataIn3 = {
                                discountPercentage: 13,
                                totalSales: 900
                            };
                            var dataIn4 = {
                                discountPercentage: 15,
                                totalSales: 1100
                            };
                            var dataIn5 = {
                                discountPercentage: 20,
                                totalSales: 1500
                            };
                            var dataIn6 = {
                                discountPercentage: 25,
                                totalSales: 2500
                            };
                            var dataIn7 = {
                                discountPercentage: 3,
                                totalSales: 400
                            };
                            var dataIn8 = {
                                discountPercentage: 18,
                                totalSales: 1000
                            };
                            var dataIn9 = {
                                discountPercentage: 2,
                                totalSales: 200
                            };
                            data1.push(dataIn1);
                            data1.push(dataIn2);
                            data1.push(dataIn3);
                            data1.push(dataIn4);
                            data1.push(dataIn5);
                            data1.push(dataIn6);
                            data1.push(dataIn7);
                            data1.push(dataIn8);
                            data1.push(dataIn9);
                            this.processSales(this.state.year, data1);                            
                            var chartDatas_ = this.initDiscountChartDatasArray();
                            data1.map((item, i) => {
                                chartDatas_.push([item.discountPercentage + '%', item.totalSales])
                            });
                            this.setState({
                                chartDatas: chartDatas_
                            });
                            */

                            
                            this.processSales(this.state.year, response.data);
                            var chartDatas_ = this.initDiscountChartDatasArray();
                            response.data.map((item, i) => {
                                chartDatas_.push([item.discountPercentage + '%', item.totalSales])
                            });
                            this.setState({
                                chartDatas: chartDatas_
                            });
                            
                        }
                        else {
                            this.setState({
                                chartDatas: [],
                                responseMessage: 'Product-Discount Data Not Found !',
                                salesProgressData: []
                            });
                        }
                    })
                    .catch(error => {
                        if (error.response.status == 500) {
                            console.log("FAIL : Server Error !");
                        }
                        else if (error.response.status == 400) {
                            console.log("FAIL : Bad Request !");
                        }
                        else {
                            this.unAuthHandler401(error);
                        }
                    });
            }
        }
    }

    processSales = (year, data) => {
        var salesInfo = {
            discountPercentage: 0,
            totalSales: 0,
            salesEffect: '',
            effectInPercentage: 0.00
        };
        var discount = [];

        data.map((item, i) => {
            if (i == 0) {
                salesInfo = {
                    discountPercentage: item.discountPercentage,
                    totalSales: item.totalSales,
                    salesEffect: '-',
                    effectInPercentage: 0
                };
                discount.push(salesInfo);
            }
            else {
                let lastSalesInfo = data[0];
                var diff = item.totalSales - lastSalesInfo.totalSales;
                if (diff >= 0) {
                    // UP
                    var diffPercentage_ = Number((100 * diff) / lastSalesInfo.totalSales);
                    salesInfo = {
                        discountPercentage: item.discountPercentage,
                        totalSales: item.totalSales,
                        salesEffect: 'UP',
                        effectInPercentage: Math.round(diffPercentage_)
                    };
                    discount.push(salesInfo);
                }
                else {
                    // DOWN
                    var diffPercentage_ = Number((100 * diff) / lastSalesInfo.totalSales);
                    salesInfo = {
                        discountPercentage: item.discountPercentage,
                        totalSales: item.totalSales,
                        salesEffect: 'DOWN',
                        effectInPercentage: Math.round(diffPercentage_)
                    };
                    discount.push(salesInfo);
                }
            }

        });
        console.log(discount);

        this.setState({
            salesProgressData: discount
        });
    }

    render() {
        const { title, productName,  salesProgressData, chartDatas, responseMessage, selectedOption, reportOption, productId, products, year, years, isError } = this.state;

        let yearList = years.length > 0
            && years.map((item, i) => {
                return (
                    <option key={i} value={item.yearId} >
                        {item.yearNumber}
                    </option>
                )
            }, this);  

        return (
            <div>
                <h3>Chart-Report Options!</h3>
                <p></p>
                <div className="row">
                    <div className="col-sm-5">
                        <form onSubmit={this.onSubmit} noValidate>
                            <Card>
                                <Card.Body>
                                    <div className="col-sm-8">
                                        <div className="radio">
                                            <label>
                                                <input
                                                    type="radio"
                                                    value="ProductDiscountWise"
                                                    checked={this.state.reportOption === "ProductDiscountWise"}
                                                    onChange={this.onReportOptionChange}
                                                />
                                                &nbsp;&nbsp;&nbsp;Product-Discount-Wise
                                            </label>
                                        </div>
                                        <div className="radio">
                                            <label>
                                                <input
                                                    type="radio"
                                                    value="YearlyProductWise"
                                                    checked={this.state.reportOption === "YearlyProductWise"}
                                                    onChange={this.onReportOptionChange}
                                                />
                                                &nbsp;&nbsp;&nbsp;[Monthly]-Product-Wise
                                            </label>
                                        </div>
                                        <div className="radio">
                                            <label>
                                                <input
                                                    type="radio"
                                                    value="MonthlyTotalStoreWise"
                                                    checked={this.state.reportOption === "MonthlyTotalStoreWise"}
                                                    onChange={this.onReportOptionChange}
                                                />
                                                &nbsp;&nbsp;&nbsp;[Monthly]-Store-Wise
                                            </label>
                                        </div>
                                    </div>
                                    <p></p>
                                    <div className="col-sm-10">
                                        <div>
                                            <Select
                                                className={isError.productId.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder='---Product---'
                                                value={selectedOption}
                                                onChange={this.handleChange}
                                                options={products}
                                                hideSelectedOptions={false}
                                            />
                                        </div>
                                        <p></p>

                                        <Card.Text>
                                            <select
                                                className={isError.year.length > 0 ? "is-invalid form-control" : "form-control"}
                                                style={{ width: 150, height: 40, borderColor: 'green', borderWidth: 3, color: 'blue' }}
                                                id="year"
                                                value={year}
                                                name="year"
                                                onChange={this.onChangeYear}
                                            >
                                                <option value=''>
                                                    ---Year---
                                                </option>
                                                {yearList}
                                            </select>
                                        </Card.Text>
                                    </div>
                                    <p></p>

                                    <div>
                                        <button
                                            type="submit"
                                            className="btn btn-block btn-success">
                                            Get Chart Report !
                                        </button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </form>
                    </div>
                    <div className="col-sm-7">
                        <div className="row">                                           
                            <div className="col-sm-11">
                                {chartDatas.length > 0 && reportOption != 'ProductDiscountWise' && (
                                    <div>
                                        <div style={{ display: 'flex' }}>
                                            <MonthlyChartReport
                                                chartDatas={chartDatas}
                                                title={title}                                              
                                                year={year}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>                     
                    </div>
                </div>
                <hr />
                
                <div className="row">
                    <DiscountWiseChartReport
                        chartDatas={chartDatas}
                        title={title}
                        reportOption={reportOption}
                        productId={productId}
                        productName={productName}
                        year={year}
                        responseMessage={responseMessage}
                        salesProgressData={salesProgressData}
                    />
                </div>           
            </div>
        );
    }
}