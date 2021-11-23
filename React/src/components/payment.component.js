import React, { Component } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import ProductSellDataService from "../services/product-sell.service";
import AuthService from "../services/auth.service";
import { Card, Button, Table } from "react-bootstrap";
import { toast } from 'react-toastify';
import { FaLightbulb, FaHighlighter, FaRegLightbulb } from "react-icons/fa"

const productImageUploadURL = {
    url: "https://localhost:44396/Files"
};

const toastSuccessOptions = {
    autoClose: 2000,
    type: toast.TYPE.SUCCESS,
    hideProgressBar: false,
    position: toast.POSITION.TOP_RIGHT
};
const toastErrorOptions = {
    autoClose: 2000,
    type: toast.TYPE.ERROR,
    hideProgressBar: false,
    position: toast.POSITION.TOP_RIGHT
};

// check for form is valid or not,,, @ form-submit event
const formValid = ({ isError, ...rest }) => {
    let isValid = true;
    Object.values(isError).forEach(val => {
        if (val.length > 0) {
            isValid = false
        }
    });
    return isValid;
};

const creditCardTypes = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
    amex: /^3[47][0-9]{13}$/,
    discover: /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/,
    diners_club: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    jcb: /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/
};

const checkCVV = (creditCardNumber, cvvNumber) => {
    // american express and cvv is 4 digits
    if ((creditCardTypes.amex).test(creditCardNumber)) {
        if ((/^\d{4}$/).test(cvvNumber))
            return true;
    } else if ((/^\d{3}$/).test(cvvNumber)) { // other card & cvv is 3 digits
        return true;
    }
};

const handleModelState = (error) => {
    var errors = [];
    if (error.response.status === 400) {
        console.log(error.response.status);
        console.log(error.response.data);
        // console.log(error.response.data.errors);
        // for (let prop in error.response.data.errors) {
        for (let prop in error.response.data) {
            // console.log(prop + ' : ' + error.response.data[prop]);
            errors.push(prop + ' : ' + error.response.data[prop]);
        }
    }
    else {
        console.log(error);
    }
   
    console.log(errors);
    return errors;
};

const months_ = Array.from({ length: 12 }, (e, i) => {
    return {
        monthNumber: (i+1)<10 ? ('0'+(i+1)) : ((i+1)+'') ,
        monthId: i + 1
    };
});

const years_ = Array.from([2021,2022,2023,2024,2025], (e) => {
    return {
        yearNumber: ((e+'').substring(2)),
        yearId: e
    };
});

export default class Payment extends Component {
    constructor(props) {
        super(props);

        this.onChangeYear = this.onChangeYear.bind(this);
        this.onChangeMonth = this.onChangeMonth.bind(this);
        this.onChangeCardCVV = this.onChangeCardCVV.bind(this);
        this.onChangeCardNumber = this.onChangeCardNumber.bind(this);
        this.onChangePayBy = this.onChangePayBy.bind(this);
        this.onChangeAmount = this.onChangeAmount.bind(this);

        this.state = {
            modelErrors: [],
            
            cartTotal: 0,

            displayCC: false,
            year: '',
            month: '',
            cardNumber: '',
            cardType: '',
            cardCVV: '',

            amount: '',
            paymentType: '',
            payBy: [],
            months: [],
            years: [],

            submitted: false,

            isError: {
                year: '',
                month: '',
                cardCVV: '',
                cardNumber: '',
                cartType: '',
                amount: '',
                paymentType: ''
            },

            bill: {
                billRefCode: '',
                billAmount: '',
                paymentType: '',
                cart: []
            }
        };

        // check for logged in or not,,, to prevent browser back history
        if (AuthService.getCurrentUser() === null) {
            this.props.history.push('/login');
            window.location.reload();
        }
    }

    componentDidMount() {
        this.checkForCartExists();        
        this.getCartTotal();
        this.getPayBy();
        this.getMonths();
        this.getYears();
    }
    componentWillUnmount() {
        // reset payment/bill
        this.resetPaymentState();
        this.resetBillState();

        // remove my-cart and cart-total from browser/local storage
        localStorage.removeItem("my-cart");
        localStorage.removeItem("cart-total");
    }
    getPayBy() {
        this.setState({
            payBy: [...this.state.payBy, ...[
                {
                    paymentType: 1, paymentMethod: 'CASH'
                }, {
                    paymentType: 2, paymentMethod: 'CREDIT-CARD'
                }
            ]]
        });
    }
    getMonths() {      
        this.setState({
            months : months_
        });
    }
    getYears() {       
        this.setState({
            years: years_
        });
    }

    checkForCartExists() {
        if (JSON.parse(localStorage.getItem("cart-total") || 0) == 0) {
            this.props.history.push('/shopping');
            window.location.reload();
        }
        var myCart = JSON.parse(localStorage.getItem("my-cart"));
        if (myCart == null || myCart.length < 1) {
            this.props.history.push('/shopping');
            window.location.reload();
        }
    }

    getCartTotal() {
        var cartTotal_ = JSON.parse(localStorage.getItem("cart-total") || 0);     
        console.log(cartTotal_ + '' + '--->' + (Math.round(cartTotal_ * 20) / 20).toFixed(2));

        // round up/down to nearest 0.05
        this.setState({
            cartTotal: parseFloat((Math.round(cartTotal_ * 20) / 20).toFixed(2))
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
    onChangeCardCVV = (event) => {
        let isError = { ...this.state.isError };

        // remove all non digit characters
        var creditCardNumber = this.state.cardNumber.replace(/\D/g, '');
        var cvvNumber = event.target.value.replace(/\D/g, '');

        isError.cardCVV =
            checkCVV(creditCardNumber, cvvNumber) ? "" : "Invalid CVV Number !";

        this.setState({
            cardCVV: cvvNumber,
            isError
        });
    }
    onChangeCardNumber = (event) => {
        let isError = { ...this.state.isError };

        var value = event.target.value.replace(/\D/g, '');
        var accepted = false;
        var ccType = '';

        // loop through the keys (visa, mastercard, amex, etc.)
        Object.keys(creditCardTypes).forEach(function (key) {
            var regex = creditCardTypes[key];
            if (regex.test(value)) {
                accepted = true;
                ccType = key;
            }
        });

        isError.cardNumber =
            accepted ? "" : "Invalid Credit Card Number !";

        this.setState({
            cardType: ccType,
            cardNumber: event.target.value,
            isError
        });
    }
    onChangeAmount = (e) => {
        const re = /^\d*\.?\d*$/;

        const amountValue = e.target.value;
        this.setState({
            amount: amountValue
        });

        let isError = { ...this.state.isError };

        if (e.target.value != '') {
            if ((re.test(e.target.value)) && (e.target.value == this.state.cartTotal)) {
                // ok
                isError.amount =
                    e.target.value <= 0 ? "Amount : Numbers Only & Equal To " + this.state.cartTotal + " !" : "";
                this.setState({
                    isError
                });
            }
            else {
                // not a number
                isError.amount = "Amount : Numbers Only & Equal To " + this.state.cartTotal + " !";
                this.setState({
                    isError
                });
            }
        }
    }
    onChangePayBy = (event) => {
        let isError = { ...this.state.isError };
        isError.paymentType =
            event.target.value == '' ? "Pay By : Required !" : "";

        if (event.target.value == 2) {
            // display cc panel
            this.setState({
                displayCC: true,
                paymentType: event.target.value,
                isError
            });
        }
        else {
            this.setState({
                displayCC: false,
                paymentType: event.target.value,
                isError
            });
        }
    }
  
    onSubmit = e => {
        e.preventDefault();

        var paymentDTO = {
        };
        var cartProductDTO = {
            productId: '',
            qtyBuy: '',
            currentPrice: '',
            productImage: ''
        };
        var cartDTO = {
            products: [] // cartProductDTO[]
        };
        var billDTO = {
            billRefCode: '',
            payment: null,
            cart: null
        };

        if (formValid(this.state)) {
            console.log(this.state);
        } else {
            console.log("Form is invalid!");
            return;
        }

        if (this.state.displayCC) {
            // prepare for cc
            if (this.state.paymentType == '' || this.state.month == '' || this.state.year == '' || this.state.cardNumber == '' || this.state.cardCVV == '') {
                if (this.state.paymentType == '') {
                    let isError = { ...this.state.isError };
                    isError.paymentType = "Pay By : Required !";
                    this.setState({
                        isError
                    });
                }
                if (this.state.month == '') {
                    let isError = { ...this.state.isError };
                    isError.month = "MM : Required !";
                    this.setState({
                        isError
                    });
                }
                if (this.state.year == '') {
                    let isError = { ...this.state.isError };
                    isError.year = "YY : Required !";
                    this.setState({
                        isError
                    });
                }
                if (this.state.cardNumber == '') {
                    let isError = { ...this.state.isError };
                    isError.cardNumber = "Card Number : Required !";
                    this.setState({
                        isError
                    });
                }
                if (this.state.cardCVV == '') {
                    let isError = { ...this.state.isError };
                    isError.cardCVV = "CVV : Required !";
                    this.setState({
                        isError
                    });
                }
                return;
            }
            else {
                // prepare payment obj
                // cc
                paymentDTO = {
                    /*
                    paymentType: Number(this.state.paymentType),  // 1=cash/2=cc
                    amountPaid: Number(this.state.cartTotal),
                    cardNumber: null,
                    cardType: this.state.cardType,
                    cardCVV: 0,
                    validMonth: 0,
                    validYear: 0
                    */
                    
                    paymentType: Number(this.state.paymentType),  // 1=cash/2=cc
                    amountPaid: Number(this.state.cartTotal),
                    cardNumber: this.state.cardNumber,
                    cardType: this.state.cardType,
                    cardCVV: Number(this.state.cardCVV),
                    validMonth: Number(this.state.month),
                    validYear: Number(this.state.year)
                };
            }
        }
        else {
            // prepare for cash
            if (this.state.paymentType == '' || this.state.amount == '') {
                if (this.state.paymentType == '') {
                    let isError = { ...this.state.isError };
                    isError.paymentType = "Pay By : Required !";
                    this.setState({
                        isError
                    });
                }
                if (this.state.amount == '') {
                    let isError = { ...this.state.isError };
                    isError.amount = "Amount : Required !";
                    this.setState({
                        isError
                    });
                }
                return;
            }
            else {
                // prepare payment obj
                // cash
                paymentDTO = {
                    paymentType: Number(this.state.paymentType),  // 1=cash/2=cc
                    amountPaid: Number(this.state.amount),
                    // amountPaid: 0,
                    cardNumber: null,
                    cardType: null,
                    cardCVV: 0,
                    validMonth: 0,
                    validYear: 0
                };
            }
        }
        // bill - payement
        billDTO.payment = paymentDTO;

        // bill - cart
        // retrive cart from local storage
        cartDTO.products = JSON.parse(localStorage.getItem("my-cart") || null);
        billDTO.cart = cartDTO;

        // bill 
        console.log(billDTO);

        // api call
        ProductSellDataService.billCreate(billDTO)
            .then(response => {
                // console.log(response);
                
                if (response.data.billRefCode == '' || response.data.billRefCode == null) {                    
                    console.log('bill can not create...');
                    toast("Server Error - Payment : Fail !", toastErrorOptions);                    
                }
                else {
                    // display bill when bill-create-success
                    var billCustomerCopy = {
                        billRefCode: response.data.billRefCode,
                        billAmount: response.data.payment.amountPaid,
                        paymentType: response.data.payment.paymentType,
                        cart : response.data.cart.products
                    };
                    this.setState({
                        bill: billCustomerCopy
                    });
                    // reset payment
                    this.resetPaymentState();

                    toast("Payment : Success !", toastSuccessOptions);
                }
            })
            .catch(error => {
                if (error.response.status === 400) {
                    toast("Bad Request ! / Server Error - Payment : Fail !", toastErrorOptions);
                }                 
                else {
                    this.setState({
                        modelErrors: handleModelState(error)
                    });
                }                    
            });
    }

    // reset payment after success payment
    resetPaymentState() {
        // remove my-cart and cart-total from browser/local storage
        localStorage.removeItem("my-cart");
        localStorage.removeItem("cart-total");

        this.setState({
            modelErrors: [],

            cartTotal: 0,

            displayCC: false,
            year: '',
            month: '',
            cardNumber: '',
            cardType: '',
            cardCVV: '',

            amount: '',
            paymentType: '',

            submitted: false,

            isError: {
                year: '',
                month: '',
                cardCVV: '',
                cardNumber: '',
                cartType: '',
                amount: '',
                paymentType: ''
            }
        });
    }
    // reset bill after user redirect to other component
    resetBillState() {
        this.setState({
            bill: {
                billRefCode: '',
                billAmount: '',
                paymentType: ''
            }
        });
    }

    moreShopping = () => {
        // reset bill
        this.resetBillState();

        // remove my-cart and cart-total from browser/local storage
        localStorage.removeItem("my-cart");
        localStorage.removeItem("cart-total");

        // redirect to products component
        setTimeout(() => this.props.history.push('/shopping'), 1000)
    }

    render() {
        const { bill, modelErrors, displayCC, cartTotal, payBy, paymentType, amount, cardNumber, cardType, cardCVV, month, months, year, years, isError, submitted } = this.state;
        const billPaymentType = (paymentType) => {
            if (paymentType == 1) {
                return "CASH"
            } else {
                return "CREDIT-CARD"
            }
        }
        let payByList = payBy.length > 0
            && payBy.map((item, i) => {
                return (
                    <option key={i} value={item.paymentType} >
                        {item.paymentMethod}
                    </option>
                )
            }, this);

        let monthList = months.length > 0
            && months.map((item, i) => {
                return (
                    <option key={i} value={item.monthId} >
                        {item.monthNumber}
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

        let modelErrorList = modelErrors.length > 0
            && modelErrors.map((item, i) => {
                return (
                    <ul key={i} value={item} >
                        <li>{item}</li>
                    </ul>
                )
            }, this);
        
        let cartList = (bill.cart!=null && bill.cart.length > 0)
            && bill.cart.map((item, i) => {
                return (
                    <tr key={i} value={item.productId} >
                        {item.productImage ? (
                            <td>
                                <img
                                    width="50" height="50"
                                    src={`${productImageUploadURL.url}/${item.productImage}`}
                                    alt="Product Image"
                                />
                            </td>
                        ) :
                            (
                                <td>
                                    NO IMAGE
                                </td>
                            )}
                        <td>
                            {item.currentPrice} *  {item.qtyBuy}
                        </td>
                        <td>
                            {parseFloat((item.qtyBuy * item.currentPrice).toFixed(2))}
                        </td>                     
                    </tr>
                )
            }, this);

        return (
            <div>
                <div className="row">
                    <div className="col-sm-6">

                        <form onSubmit={this.onSubmit} noValidate>
                            <Card style={{ width: '30rem' }}>
                                <Card.Header>
                                    <h3>
                                        Payment &nbsp;&nbsp;&nbsp;&nbsp;
                                        <span
                                            className="paymentCartTotal">$ {parseFloat((cartTotal).toFixed(2))}
                                        </span>
                                    </h3>
                                    {modelErrors.length > 0 ? (
                                        <span style={{ color: 'red' }}>
                                            {modelErrorList}
                                        </span>
                                    ) : (
                                        <span></span>
                                    )}
                                </Card.Header>
                                <Card.Body>
                                    <Card.Title>Pay By </Card.Title>
                                    <Card.Text>
                                        <select
                                            disabled={(bill.billRefCode) ? "disabled" : ""}
                                            className={isError.paymentType.length > 0 ? "is-invalid form-control" : "form-control"}
                                            style={{ width: 300, height: 40, borderColor: 'green', borderWidth: 3, color: 'blue' }}
                                            id="paymentType"
                                            value={paymentType}
                                            name="paymentType"
                                            onChange={this.onChangePayBy}
                                        >
                                            <option value=''>
                                                --- select pay-by ---
                                            </option>
                                            {payByList}
                                        </select>
                                        {isError.paymentType.length > 0 && (
                                            <span className="invalid-feedback">{isError.paymentType}</span>
                                        )}
                                    </Card.Text>

                                    {displayCC ? (
                                        <div>
                                            <Card.Title>Credit Card Number</Card.Title>
                                            <Card.Text>
                                                <span className="form-group">
                                                    <input
                                                        disabled={(bill.billRefCode) ? "disabled" : ""}
                                                        style={{ width: 200, height: 40, borderColor: 'blue', borderWidth: 3, color: 'green' }}
                                                        type="text"
                                                        className={isError.cardNumber.length > 0 ? "is-invalid form-control" : "form-control"}
                                                        id="cardNumber"
                                                        value={cardNumber}
                                                        onChange={this.onChangeCardNumber}
                                                        name="cardNumber"
                                                        maxLength={16}
                                                    />
                                                    <span>{cardType} </span>
                                                    {isError.cardNumber.length > 0 && (
                                                        <span className="invalid-feedback">{isError.cardNumber}</span>
                                                    )}
                                                </span>
                                            </Card.Text>
                                            <Card.Title>CVV Number</Card.Title>
                                            <Card.Text>
                                                <span className="form-group">
                                                    <input
                                                        disabled={(bill.billRefCode) ? "disabled" : ""}
                                                        style={{ width: 100, height: 40, borderColor: 'blue', borderWidth: 3, color: 'green' }}
                                                        type="text"
                                                        className={isError.cardCVV.length > 0 ? "is-invalid form-control" : "form-control"}
                                                        id="cardCVV"
                                                        value={cardCVV}
                                                        onChange={this.onChangeCardCVV}
                                                        name="cardCVV"
                                                        maxLength={4}
                                                    />
                                                    {isError.cardCVV.length > 0 && (
                                                        <span className="invalid-feedback">{isError.cardCVV}</span>
                                                    )}
                                                </span>
                                            </Card.Text>
                                            <div className="row">
                                                <div className="col-sm-2">
                                                    <Card.Title>MM</Card.Title>
                                                    <Card.Text>
                                                        <select
                                                            disabled={(bill.billRefCode) ? "disabled" : ""}
                                                            className={isError.month.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            style={{ width: 60, height: 40, borderColor: 'green', borderWidth: 3, color: 'blue' }}
                                                            id="month"
                                                            value={month}
                                                            name="month"
                                                            onChange={this.onChangeMonth}
                                                        >
                                                            <option value=''>
                                                                MM
                                                            </option>
                                                            {monthList}
                                                        </select>
                                                    </Card.Text>
                                                </div>
                                                <div className="col-sm-1">
                                                    /
                                                </div>
                                                <div className="col-sm-2">
                                                    <Card.Title>YY</Card.Title>
                                                    <Card.Text>
                                                        <select
                                                            disabled={(bill.billRefCode) ? "disabled" : ""}
                                                            className={isError.year.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            style={{ width: 60, height: 40, borderColor: 'green', borderWidth: 3, color: 'blue' }}
                                                            id="year"
                                                            value={year}
                                                            name="year"
                                                            onChange={this.onChangeYear}
                                                        >
                                                            <option value=''>
                                                                YY
                                                            </option>
                                                            {yearList}
                                                        </select>
                                                    </Card.Text>
                                                </div>

                                                <div>
                                                    {isError.month.length > 0 && (
                                                        <span style={{ color: 'red' }} >{isError.month}</span>
                                                    )}
                                                    {isError.year.length > 0 && (
                                                        <span style={{ color: 'red' }} >{isError.year}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                    ) : (
                                        <div>
                                            <Card.Title>Amount</Card.Title>
                                            <Card.Text>
                                                <span className="form-group">
                                                    <input
                                                        disabled={(bill.billRefCode) ? "disabled" : ""}
                                                        style={{ width: 100, height: 40, borderColor: 'blue', borderWidth: 3, color: 'green' }}
                                                        type="text"
                                                        className={isError.amount.length > 0 ? "is-invalid form-control" : "form-control"}
                                                        id="amount"
                                                        value={amount}
                                                        onChange={this.onChangeAmount}
                                                        name="amount"
                                                    />
                                                    {isError.amount.length > 0 && (
                                                        <span className="invalid-feedback">{isError.amount}</span>
                                                    )}
                                                </span>
                                            </Card.Text>
                                        </div>
                                    )}

                                    <p></p>
                                    <div>
                                        <button
                                            type="submit"
                                            disabled={paymentType ? false : true}
                                            className="btn btn-block btn-success">
                                            Proceed Payment !
                                        </button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </form>

                    </div>
                    <div className="col-sm-6">
                        {bill.billRefCode && (
                            <div>
                                <Card>
                                    <Card.Header>
                                        <Button variant="info"
                                            className="moreShoppingButton"
                                            onClick={() => this.moreShopping()}
                                            size="md">
                                            <b><FaRegLightbulb /> More Shopping !</b>
                                        </Button>                                      
                                    </Card.Header>
                                    <p></p>
                                    <Card.Header as="h5">Bill - Customer Copy</Card.Header>
                                    <Card.Body>
                                        <Card.Title>Ref Code</Card.Title>
                                        <Card.Text>
                                            {bill.billRefCode}
                                        </Card.Text>
                                        <Card.Title>Bill Amount</Card.Title>
                                        <Card.Text>
                                            {bill.billAmount}
                                        </Card.Text>
                                        <Card.Title>Payment Type</Card.Title>
                                        <Card.Text>
                                            {billPaymentType(bill.paymentType)}
                                        </Card.Text>                                      
                                    </Card.Body>
                                </Card>
                                {bill.billRefCode ? (
                                    <div>
                                        <Table striped hover variant="dark">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Price * QTY</th>
                                                    <th>TOTAL</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cartList}
                                            </tbody>
                                        </Table>
                                    </div>
                                ) : (
                                        <div>
                                        </div>
                                )}
                              </div>
                        )}
                    </div>
                </div>
             </div>
        );
    }
}