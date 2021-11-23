import React, { Component } from "react";
import ProductDataService from "../services/product.service";
import AuthService from "../services/auth.service";
import { Button, Card } from "react-bootstrap";
import { toast } from 'react-toastify';

const toastSuccessOptions = {
    autoClose: 2000,
    type: toast.TYPE.SUCCESS,
    hideProgressBar: false,
    position: toast.POSITION.TOP_LEFT
};
const toastErrorOptions = {
    autoClose: 2000,
    type: toast.TYPE.ERROR,
    hideProgressBar: false,
    position: toast.POSITION.TOP_LEFT
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

export default class ProductDiscount extends Component {
    constructor(props) {
        super(props);

        this.setProductDiscount = this.setProductDiscount.bind(this);
        this.onChangeDiscountPercentage = this.onChangeDiscountPercentage.bind(this);
        this.onBlurDiscountPercentage = this.onBlurDiscountPercentage.bind(this);


        this.state = {
            currentProduct: {
                productId: null,
                productName: "",
                price: ""
            },
            currentProductDiscount: {
                discountPercentage: "",
                discountPrice: ""
            },
            submitted: false,
            isError: {
                discountPercentage: ''
            }
        };

        // check for logged in or not,,, to prevent browser back history
        if (AuthService.getCurrentUser() === null) {
            this.props.history.push('/login');
            window.location.reload();
        }
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

    componentDidMount() {
        this.getProduct(this.props.match.params.id);     
    }

    // get product to set discount
    getProduct(id) {
        ProductDataService.get(id)
            .then(response => {
                this.setState({
                    currentProduct: response.data
                });
                console.log(response.data);
            })
            .catch(e => {
                // console.log(e);
                this.unAuthHandler401(e);
            });
    }

    onChangeDiscountPercentage = (e) => {
        let isError = { ...this.state.isError };
        const re = /^\d{1,2}$/;

        isError.discountPercentage = re.test(e.target.value) ? "" : "Must be [1 < Discount < 99] !";

        if (isError.discountPercentage == '') {
            isError.discountPercentage = e.target.value > 0 ? "" : "Must be > 0 !";
        }
        this.setState(function (prevState) {
            return {
                currentProductDiscount: {
                    ...prevState.currentProductDiscount,
                    discountPercentage: (e.target.value)
                },
                isError
            };
        });
    }
    onBlurDiscountPercentage = (e) => {     
        const currentDiscount = this.state.currentProductDiscount.discountPercentage;
        const discountedPrice = this.state.currentProduct.price-((this.state.currentProduct.price * currentDiscount) / 100);
        this.setState(function (prevState) {
            return {
                currentProductDiscount: {
                    ...prevState.currentProductDiscount,
                    discountPrice: discountedPrice
                }
            };
        });
    }
    setProductDiscount() {
        if (formValid(this.state)) {
            console.log(this.state);
        } else {
            console.log("Form is invalid!");
            return;
        }

        // check for all null values @ form
        if (this.state.currentProductDiscount.discountPercentage == '') {
            let isError = { ...this.state.isError };
            isError.discountPercentage = "Discount : is Required !";
            this.setState({
                isError
            });
            return;
        }
    
        const productDiscountDTO = {
            productId: this.state.currentProduct.productId,
            discountPercentage: Number(this.state.currentProductDiscount.discountPercentage)
        }        
        // console.log(productDiscountDTO);
        // api call
        ProductDataService.setProductDiscount(
            productDiscountDTO
        )
            .then(response => {
                console.log(response.data);
                this.setState({
                    submitted: true
                });
                if (response.data.apiResponse.responseCode == 0)
                    toast(response.data.apiResponse.responseMessage + "", toastSuccessOptions);
                else
                    toast(response.data.apiResponse.responseMessage + "", toastErrorOptions);
                // after success,,, go back to products page                
                setTimeout(() => this.props.history.push('/products'), 2000)
            })
            .catch(e => {
                console.log(e.message); // Request failed with status code 400
                console.log(e.response.status); // 400
                console.log(e.response.data);
                if (e.response.status == 400)
                    toast("Bad Request !", toastErrorOptions);

                this.unAuthHandler401(e);

                // after error,,, go back to products page
                setTimeout(() => this.props.history.push('/products'), 3000)
            });
    }

    render() {
        const { currentProduct, currentProductDiscount } = this.state;
        const { isError } = this.state;

        return (
            <div>
                <div className="row">
                    <div className="col-sm-8">
                        <form>
                            {this.state.submitted ? (
                                <div>
                                </div>
                            ) : (
                                <Card style={{ width: '50rem' }}>
                                    <Card.Header>
                                        <h4>Set-Discount [ {currentProduct.productId} ]</h4>
                                        <h4>Product Name : {currentProduct.productName} </h4>
                                        <h4>Base Price : {currentProduct.price} </h4>
                                    </Card.Header>
                                    <Card.Body>
                                        <Card.Title>Discount %</Card.Title>
                                        <Card.Text>
                                            <span className="form-group">
                                                    <input
                                                    style={{ width: 100, height: 40, borderColor: 'blue', borderWidth: 5, color: 'red' }}
                                                    type="text"
                                                    className={isError.discountPercentage.length > 0 ? "is-invalid form-control" : "form-control"}
                                                    id="discountPercentage"
                                                    value={currentProduct.discountPercentage}
                                                    onChange={this.onChangeDiscountPercentage}
                                                    onBlur={this.onBlurDiscountPercentage}
                                                    name="discountPercentage"
                                                />
                                                {isError.discountPercentage.length > 0 && (
                                                    <span className="invalid-feedback">{isError.discountPercentage}</span>
                                                )}
                                            </span>
                                        </Card.Text>
                                        <Card.Title style={{ width: 300, height: 40, borderColor: 'green', borderWidth: 2, color: 'blue' }}>Discounted Price :
                                            {this.state.currentProductDiscount.discountPrice}
                                        </Card.Title>
                                        
                                        <hr />
                                        <Button variant="info"
                                                onClick={() => this.setProductDiscount()}
                                            size="md">
                                            Apply Discount
                                        </Button>
                                    </Card.Body>
                                </Card>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
