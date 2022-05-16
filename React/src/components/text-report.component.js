import React, { Component } from "react";
import ReportDataService from "../services/report.service";
import AuthService from "../services/auth.service";
import { Card } from "react-bootstrap";

import Select from 'react-select';
import MonthlyTextReport from "./monthly-text-report.component";

const productImageUploadURL = {
    url: "https://localhost:44396/Files"
};

const months_ = Array.from({ length: 12 }, (e, i) => {
    return {
        monthName: new Date(null, i + 1, null).toLocaleDateString("en", { month: "long" }),
        monthId: i + 1
    };
});

export default class TextReport extends Component {
    constructor(props) {
        super(props);
     
        this.onReportOptionChange = this.onReportOptionChange.bind(this);
        this.onChangeYear = this.onChangeYear.bind(this);
        this.onChangeMonth = this.onChangeMonth.bind(this);

        this.state = {

            reportTitle: '',
            reportOption: 'MonthlyTotalStoreWise',
            showMonthlyStoreWise: true,
            showMonthlyProductWise: false,

            year: '',
            month: '',

            productId: 0,
            productName : '',
            selectedOption: null,

            months: [],
            years: [],
            products: [],

            submitted: false,

            isError: {
                year: '',
                month: '',
                productId: ''
            },

            // report data     
            responseMessage: '',
            monthlyProductWiseSalesData: [],
            monthlyStoreWiseSalesData: [],
            yearlyProductWiseSalesData: []

        };

        // check for logged in or not,,, to prevent browser back history
        if (AuthService.getCurrentUser() === null) {
            this.props.history.push('/login');
            window.location.reload();
        }
    }

    componentDidMount() {      
        this.getMonths();
        this.getYears();
        this.getProducts();
    }
  
    getMonths() {
        this.setState({
            months: months_
        });
    }
    getYears() {
        this.setState({
          years: [
            ...this.state.years,
            ...[
              {
                yearId: 2022,
                yearNumber: "2022",
              },
              {
                yearId: 2021,
                yearNumber: "2021",
              },
              {
                yearId: 2020,
                yearNumber: "2020",
              },
            ],
          ],
        });
    }
    getProducts() {
        ReportDataService.getProductsWithImage()
            .then(response => {
                console.log(response.data);

                // x-fer
                var options1_ = [];
                response.data.map((item, i) => {
                    console.log(item.productName);
                    var option = {
                        value: item.productId+'-'+item.productName,
                        label:
                            <div>
                                <img
                                    width="35" height="35"
                                    src={`${productImageUploadURL.url}/${item.productImage}`}
                                    alt="N/A"
                                />
                                <span> - </span>
                                <span>
                                    {item.productName}
                                </span>
                                <span> - </span>
                                <span>
                                    [ $ {item.currentPrice} ]
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
    onChangeMonth = (event) => {
        let isError = { ...this.state.isError };
        isError.month =
            event.target.value == '' ? "Month : Required !" : "";

        this.setState({
            month: event.target.value,
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
  
    onSubmit = e => {
        e.preventDefault();
        
        // un-touched and null form check
        // monthly - Store wise
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
                        if (response.data.length > 0)
                            this.setState({
                                monthlyStoreWiseSalesData: response.data,
                                reportTitle: 'Monthly Store - Wise [Text Report]'
                            });
                        else
                            this.setState({
                                monthlyStoreWiseSalesData: [],
                                responseMessage: '[Yearly/Monthly]-Store Data Not Found !',
                                reportTitle: ''
                            });
                    })
                    .catch(error => {
                        if (error.response.status === 400) {
                            console.log("Bad Request !");
                        }
                        else {
                            console.log("Server Error !");
                        }
                    });
            }
        }
        // selected Month - Product wise
        else if(this.state.reportOption == 'MonthlyTotalProductWise') {
            console.log('Product-Wise-Monthly');
            // need year, month and productId
            if (this.state.year == '' || this.state.month == '' || this.state.productId == '') {
                if (this.state.month == '') {
                    let isError = { ...this.state.isError };
                    isError.month = "Month : Required !";
                    this.setState({
                        isError
                    });
                }
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
                var monthlyProductWiseSalesData = {
                    selectedYear: this.state.year, // ip
                    selectedMonth: Number(this.state.month), // ip
                    // selectedMonth: 'invalid-month', // ip
                    selectedProductId: Number(this.state.productId) // ip
                };
                ReportDataService.textReportMonthlyProductWise(monthlyProductWiseSalesData)
                    .then(response => {
                        console.log(response);
                        if(response.data.length>0)
                            this.setState({
                                monthlyProductWiseSalesData: response.data
                            });
                        else
                            this.setState({
                                monthlyProductWiseSalesData: [],
                                responseMessage: 'Selected Product - Month Data Not Found !'
                            });
                    })
                    .catch(error => {
                        if (error.response.status === 400) {
                            console.log("Bad Request !");
                        }
                        else {
                            console.log("Server Error !");
                        }
                    });
            }
        }
        // monthly Product wise    
        else {
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
                        if (response.data.length > 0)
                            this.setState({
                                yearlyProductWiseSalesData: response.data,
                                reportTitle: 'Monthly Product # [ '+ this.state.productName +' ] - Wise [Text Report]'
                            });
                        else
                            this.setState({
                                yearlyProductWiseSalesData: [],
                                responseMessage: '[Yearly/Monthly]-Product Data Not Found !',
                                reportTitle: ''
                            });
                    })
                    .catch(error => {
                        if (error.response.status === 400) {
                            console.log("Bad Request !");
                        }
                        else {
                            console.log("Server Error !");
                        }
                    });
            }
        }  
    }
    
    onReportOptionChange(event) {
        this.setState({
            reportOption: event.target.value,
            monthlyProductWiseSalesData: [],
            monthlyStoreWiseSalesData: [],
            yearlyProductWiseSalesData: []
        });
        console.log(this.state.reportOption);
    }

    render() {
        const { reportTitle, yearlyProductWiseSalesData, monthlyStoreWiseSalesData, responseMessage,  monthlyProductWiseSalesData, selectedOption, reportOption, products, month, months, year, years, isError } = this.state;
         
        let selectedProductMonthWiseReportDataList = monthlyProductWiseSalesData.length > 0
            && monthlyProductWiseSalesData.map((item, i) => {
                return (
                    <Card key={i}>                        
                        <Card.Body>
                            <Card.Title>Product #  {item.selectedProductId}  [ {item.selectedProductName} ]</Card.Title>
                            <p></p>
                            <Card.Title>{item.selectedMonthName} / {item.selectedYear} </Card.Title>                       
                            <p></p>
                            <h2>Total Sales $ { item.totalSales}</h2>
                        </Card.Body>
                    </Card>
                )
            }, this);
        
        let monthList = months.length > 0
            && months.map((item, i) => {
                return (
                    <option key={i} value={item.monthId} >
                        {item.monthName}
                    </option>
                )
            }, this);
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
                <h3>Text-Report Options!</h3>
                <p></p>
                <div className="row">
                    <div className="col-md-5">
                        <form onSubmit={this.onSubmit} noValidate>
                            <Card>                              
                                <Card.Body>
                                    <div className="col-sm-8">
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
                                        <div className="radio">
                                            <label>
                                                <input
                                                    type="radio"
                                                    value="MonthlyTotalProductWise"
                                                    checked={this.state.reportOption === "MonthlyTotalProductWise"}
                                                    onChange={this.onReportOptionChange}
                                                />
                                                &nbsp;&nbsp;&nbsp;Selected Product-Month-Wise
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
                                    <div className="col-sm-4">
                                        <Card.Text>
                                            <select
                                                disabled={reportOption == "MonthlyTotalStoreWise" || reportOption == "YearlyProductWise"}
                                                className={isError.month.length > 0 ? "is-invalid form-control" : "form-control"}
                                                style={{ width: 200, height: 40, borderColor: 'green', borderWidth: 3, color: 'blue' }}
                                                id="month"
                                                value={month}
                                                name="month"
                                                onChange={this.onChangeMonth}
                                            >
                                                <option value=''>
                                                    ---Month---
                                                </option>
                                                {monthList}
                                            </select>
                                        </Card.Text>
                                    </div>
                                    <p></p>

                                    <div>
                                        <button
                                            type="submit"
                                            className="btn btn-block btn-success">
                                            Get Text Report !
                                        </button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </form>
                    </div>
                    <div className="col-md-7">
                        {monthlyProductWiseSalesData.length > 0 ? (
                            <div>
                                <div className="monthlyStoreWiseTextHeader">
                                    <h2>Sales Report</h2>
                                    Selected Product - Month - Wise [Text Report]
                                </div>
                                <p></p>                               
                                {selectedProductMonthWiseReportDataList}
                            </div>
                        ) : (                                
                                <div>
                                    {reportOption == "MonthlyTotalProductWise" && responseMessage ? (
                                        <div className="chartDataErrorMessage">
                                            <h5>{responseMessage}</h5>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}
                                </div>
                        )}
                        
                        {monthlyStoreWiseSalesData.length > 0 ? (
                            <div>
                                <MonthlyTextReport
                                    data={monthlyStoreWiseSalesData}
                                    title={reportTitle}
                                />
                            </div>                      
                        ) : (
                            <div>                         
                            </div>
                        )}

                        {yearlyProductWiseSalesData.length > 0 ? (
                            <div>
                                <MonthlyTextReport
                                    data={yearlyProductWiseSalesData}
                                    title={reportTitle}
                                />
                            </div>
                        ) : (
                                <div>
                                </div>
                        )}
                    </div>
                </div>
             </div>
        );
    }
}