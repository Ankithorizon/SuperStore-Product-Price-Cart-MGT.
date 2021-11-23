import React, { Component } from "react";
import ProductDataService from "../services/product.service";
import AuthService from "../services/auth.service";
import { Button, Card } from "react-bootstrap";
import { FaLightbulb } from "react-icons/fa"

const productImageUploadURL = {
    url: "https://localhost:44396/Files"
};

export default class Shopping extends Component {
    constructor(props) {
        super(props);
        this.retrieveProducts = this.retrieveProducts.bind(this);
        this.setActiveProduct = this.setActiveProduct.bind(this);
        this.onChangeProductName = this.onChangeProductName.bind(this);
        this.onChangeCategory = this.onChangeCategory.bind(this);
        this.onAddToCart = this.onAddToCart.bind(this);
        this.seeMyCart = this.seeMyCart.bind(this);

        this.state = {
            cartTotal : 0,
            cart : [], // array of products,,, productId, quantity, currentPrice
            categories: [],
            categoryId: '',
            products: [],
            currentProduct: null,
            currentIndex: -1,
            searchProductName: ""
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
        this.retrieveProducts();
        this.getCategories();
        this.retrieveMyCart();
    }
    retrieveMyCart() {
        this.setState({
            cart: JSON.parse(localStorage.getItem("my-cart") || "[]")
        });
    }
    getCategories() {
        ProductDataService.getCategories()
            .then(response => {
                this.setState({
                    categories: response.data
                });
            })
            .catch(e => {
                if (e.response.status === 400) {
                    console.log('Bad Request!');
                }
                else {
                    this.unAuthHandler401(e);
                }
            });
    }
    retrieveProducts() {
        ProductDataService.getAll()
            .then(response => {
                this.setState({
                    products: response.data
                });
                console.log(response.data);
            })
            .catch(e => {
                this.unAuthHandler401(e);
            });
    }

    setActiveProduct(product, index) {
        this.setState({
            currentProduct: product,
            currentIndex: index
        });
        console.log(product);
    }   
    onChangeCategory = (selectedCategoryId)  => {
        
        console.log('category selected...' + selectedCategoryId);
        this.setState({
            categoryId: selectedCategoryId
        });
        this.searchingProduct(this.state.searchProductName, selectedCategoryId);
    }
    onChangeProductName(e) {
        const searchProductName = e.target.value;
        this.setState({
            searchProductName: searchProductName
        });
        this.searchingProduct(e.target.value, this.state.categoryId);
    }

    searchingProduct(searchValue, categoryId) {
        this.setState({
            currentProduct: null,
            currentIndex: -1
        });
        ProductDataService.findingProduct(searchValue, categoryId)
            .then(response => {
                this.setState({
                    products: response.data
                });
            })
            .catch(e => {
                console.log(e);
                this.unAuthHandler401(e);
            });
    }

    onAddToCart(product) {
        var cartItem = {
            productId: product.productId,
            qtyBuy: 1,
            currentPrice: product.currentPrice,
            productImage: product.productImage
        };
        let currentCart = this.state.cart;

        const found = currentCart.filter(entry => entry.productId == product.productId);
        if (found.length > 0) {
            this.setState(state => {
                const cart = state.cart.map(item => {
                    if (item.productId == product.productId) {
                        item.qtyBuy = item.qtyBuy + 1;
                    }
                    else {
                        item = item;
                    }
                });
            });
        }
        else {
            currentCart.push(cartItem);
            this.setState({
                cart: currentCart
            });            
        }          
        this.updateCart(this.state.cart);
    }
    updateCart(cart) {     
        this.setState({
            cart: cart
        });
        console.log(this.state.cart);
    }

    seeMyCart() {
        localStorage.setItem("my-cart", JSON.stringify(this.state.cart));
        setTimeout(() => this.props.history.push('/my-cart'), 2000)
    }
  
    render() {
        const { cartTotal, cart, categoryId, categories, searchProductName, products, currentProduct, currentIndex } = this.state;
       
        const total = (cart.reduce((total, currentItem) => total = total + parseFloat(((currentItem.currentPrice * currentItem.qtyBuy).toFixed(2))), 0));

        let categoryList = categories.length > 0
            && categories.map((item, i) => {
                return (                    
                    <Button variant="info"
                        style={{ marginRight: 15, width: 110, height:70, borderColor: 'green', borderWidth: 2, color: 'black' }}

                        onClick={() => this.onChangeCategory(item.categoryId)}
                        key={i} value={item.categoryId}                        
                        size="md">
                        {item.categoryName}
                    </Button>
                )
            }, this);
        
        let productList = products.length > 0
            && products.map((item, i) => {
                return (
                    <Button variant="success"
                        style={{ marginRight: 15, width: 150, height: 100, borderColor: 'black', borderWidth: 2, color: 'white' }}

                        onClick={() => this.setActiveProduct(item, i)}
                        key={i} value={item.productId}
                        size="md">
                        <div style={{ width: 25, height: 25}}>
                            <img
                                width="25" height="25"
                                src={`${productImageUploadURL.url}/${item.productImage}`}
                                alt="Product Image"
                            />
                        </div>
                        <div>
                            {item.productName}
                        </div>
                    </Button>
                )
            }, this);

        let cartList = cart.length > 0
            && cart.map((item, i) => {
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
                        <td>&nbsp;&nbsp;&nbsp;</td>
                        <td>
                            {item.qtyBuy}
                        </td>
                        <td>&nbsp;&nbsp;&nbsp;</td>
                        <td>
                            {item.currentPrice}
                        </td>
                        <td>&nbsp;&nbsp;&nbsp;</td>
                        <td>
                            {(item.qtyBuy * item.currentPrice).toFixed(2)}
                        </td>
                    </tr>
                )
            }, this);      

        return (
            <div className="row">      
                <div className="col-sm-9" >
                    <div className="col-md-12">                      
                        <div className="input-group mb-3">
                            <div className="col-md-7">
                                <input
                                    style={{ width: 300, height: 40, borderColor: 'green', borderWidth: 5, color: 'blue' }}
                                    type="text"
                                    className="form-control"
                                    placeholder="Search By Product Name/Desc..."
                                    value={searchProductName}
                                    onChange={this.onChangeProductName}
                                />
                            </div>         
                        </div>
                    </div>
                    <hr />
                    <p></p>
                    <div>
                        <p></p>
                        <div >
                            {categoryList}
                        </div>
                        <p></p>
                        <hr />
                        <p></p>
                        <div >
                            {productList}
                        </div>
                        <p></p>
                        <hr />
                    </div>
                </div>
                <div className="col-md-3">
                    <div>
                        {currentProduct ? (
                            <div>
                                <Card>
                                    <Card.Body>
                                        <div>
                                            {currentProduct.productImage ? (
                                                <span>
                                                    <img
                                                        width="100" height="100"
                                                        src={`${productImageUploadURL.url}/${currentProduct.productImage}`}
                                                        alt="Product Image"
                                                    />
                                                </span>
                                            ) :
                                                (
                                                    <span>
                                                        {currentProduct.productFileId} :
                                                        NO IMAGE
                                                    </span>
                                                )}
                                        </div>
                                        <p></p>
                                        <div>
                                            <label>
                                                <strong>{currentProduct.productName}</strong>
                                            </label>
                                        </div>                                     
                                        <p></p>
                                        <div>
                                            <label className="displayPrice">
                                                <strong>$ {currentProduct.price} </strong>
                                            </label>
                                        </div>
                                        <p></p>
                                        {currentProduct.price != currentProduct.currentPrice && (
                                            <div>
                                                <label className="displayCurrentPrice">
                                                    <FaLightbulb />
                                                    <strong>Current Price $ {currentProduct.currentPrice}  </strong>
                                                </label>
                                            </div>
                                        )}
                                       
                                        <p></p>
                                        <div>
                                            <Button variant="success"
                                                onClick={() => this.onAddToCart(currentProduct)}
                                                size="md">
                                                Add To Cart
                                            </Button>
                                            <span>    </span>
                                            <Button variant="danger"
                                                onClick={() => this.setActiveProduct(null, -1)}
                                                size="md">
                                                Cancel
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        ) : (
                            <div>
                            </div>
                        )}
                    </div>                
                    <p></p>
                    {cart.length > 0 ? (
                        <div className="col-md-10">
                            <div>
                                <div>
                                    <h4>$ {total}</h4>
                                </div>
                                <p></p>
                                <table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th></th>
                                            <th>QTY</th>
                                            <th></th>                                            
                                            <th>$</th>
                                            <th></th>
                                            <th>TOTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartList}
                                    </tbody>                                    
                                </table>
                            </div>
                            <p></p>
                            <hr />
                            <Button variant="success"
                                onClick={() => this.seeMyCart()}
                                size="md">
                                Edit / View Cart
                            </Button>
                        </div>
                    ) : (
                        <div></div>
                    )}                  
                 
                </div>
            </div>
        );
    }
}