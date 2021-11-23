import React, { Component } from "react";
import AuthService from "../services/auth.service";
import { Table, Button } from "react-bootstrap";
import { FaLightbulb, FaHighlighter, FaRegLightbulb } from "react-icons/fa"

const productImageUploadURL = {
    url: "https://localhost:44396/Files"
};

export default class MyCart extends Component {
    constructor(props) {
        super(props);
    
        this.updateQty = this.updateQty.bind(this);
        this.startPayment = this.startPayment.bind(this);

        this.state = {
            myCart: [],
            cartTotal : 0
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
        this.retrieveMyCart();
    }

    componentWillUnmount() {
        localStorage.removeItem("my-cart");
        localStorage.setItem("my-cart", JSON.stringify(this.state.myCart));
    }

    retrieveMyCart() {
        this.setState({
            myCart: JSON.parse(localStorage.getItem("my-cart") || "[]")
        });
    }

    updateQty(product, itemAttributes) {
      
        var index = this.state.myCart.findIndex(x => x.productId === product.productId);
        if (index === -1)
            // handle error
            console.log('error');
        else
            this.setState({
                myCart: [
                    ...this.state.myCart.slice(0, index),
                    Object.assign({}, this.state.myCart[index], itemAttributes),
                    ...this.state.myCart.slice(index + 1)
                ]
            });
    }  

    startPayment() {
        const total = (this.state.myCart.reduce((total, currentItem) => total = total + (currentItem.currentPrice * currentItem.qtyBuy ), 0));
        
        localStorage.removeItem("cart-total");
        localStorage.setItem("cart-total", JSON.stringify(total));
        this.props.history.push('/payment');
    }
    
    doMoreShopping = () => {
        this.props.history.push('/shopping');
    }

    render() {
        const { myCart, cartTotal } = this.state;
       
        const total = (myCart.reduce((total, currentItem) => total = total + parseFloat(((currentItem.currentPrice * currentItem.qtyBuy).toFixed(2))), 0));

        let cartList = myCart.length > 0
            && myCart.map((item, i) => {
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
                            <Button variant="danger"
                                onClick={() => this.updateQty(item, { qtyBuy: (item.qtyBuy - 1) })}
                                size="md">
                                - QTY
                            </Button>
                        </td>
                        <td>
                            {item.qtyBuy }
                        </td>
                        <td>
                            <Button variant="info"
                                onClick={() => this.updateQty(item, { qtyBuy: (item.qtyBuy + 1) })}
                                size="md">
                                + QTY
                            </Button>
                        </td>
                        <td>
                            {item.currentPrice}
                        </td>
                        <td>
                            {parseFloat(((item.qtyBuy * item.currentPrice).toFixed(2)))}
                        </td>
                      
                      
                    </tr>
                )
            }, this);
        
        return (
            <div>
                <div className="row">
                    <div className="col-sm-2 myCartHeader">
                        <h3>
                            My Cart                          
                        </h3>
                        <hr />
                    </div>                 
                </div>
                <p></p>
                <div className="row">
                    <div className="col-sm-3" >
                        <h3>TOTAL $ {total}</h3>
                    </div>
                    <div className="col-sm-9" >
                        <Button variant="success"
                            className="paymentButton"
                            onClick={() => this.startPayment()}
                            size="md">
                            Payment
                        </Button>&nbsp;&nbsp;&nbsp;
                        <Button variant="info"
                            className="moreShoppingButton"
                            onClick={() => this.doMoreShopping()}
                            size="md">
                            <b><FaRegLightbulb /> More Shopping !</b>
                        </Button>
                    </div>
                </div>
                <p></p>
                <div className="row">
                    <div className="col-sm-8" >
                        <Table striped hover variant="dark">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th></th>
                                    <th>QTY</th>
                                    <th></th>
                                    <th>Price</th>
                                    <th>TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartList}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>          
        );
    }
}