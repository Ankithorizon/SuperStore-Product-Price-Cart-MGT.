import React, { Component } from "react";
import ProductDataService from "../services/product.service";
import AuthService from "../services/auth.service";
import { Link } from "react-router-dom";
import { Table, Button, Card } from "react-bootstrap";

const productImageUploadURL = {
    url: "https://localhost:44396/Files"
};

export default class Products extends Component {
    constructor(props) {
        super(props);
        this.retrieveProducts = this.retrieveProducts.bind(this);
        this.setActiveProduct = this.setActiveProduct.bind(this);
        this.onChangeProductName = this.onChangeProductName.bind(this);
        this.onChangeCategory = this.onChangeCategory.bind(this);

        this.state = {
            userRole: '',
            
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
        this.checkUserRole();
    }

    checkUserRole = () => {
        const user = AuthService.getCurrentUser();
        const role = AuthService.getCurrentUserRole();
        if (user && role) {
            this.setState({
                userRole: role,
                currentUser: user,
                currentRole: role,
                showAdminBoard: role == 'Admin' ? true : false,
                showManagerBoard: role == 'Manager' ? true : false,
                showCSUserBoard: role == 'CSUser' ? true : false
            });
        }
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

    onChangeCategory = (event) => {
        this.setState({
            categoryId: event.target.value
        });
        this.searchingProduct(this.state.searchProductName, event.target.value);
    }
    onChangeProductName(e) {
        const searchProductName = e.target.value;
        this.setState({
            searchProductName: searchProductName
        });

        // check if length is more than 3 characters, then call api
        // otherwise wait until user press search button for api call
        /*
        if (searchProductName.length >= 3) {
            this.searchProductName();
        }
        */
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

    render() {
        const { userRole, categoryId, categories, searchProductName, products, currentProduct, currentIndex } = this.state;

        let categoryList = categories.length > 0
            && categories.map((item, i) => {
                return (
                    <option key={i} value={item.categoryId} >
                        {item.categoryName}
                    </option>
                )
            }, this);
        
        return (            
            <div className="row">
                <div className="col-sm-8 productsTable" >
                    <div className="col-md-12">
                        <Card.Title>Category</Card.Title>
                        <Card.Text>
                            <select
                                style={{ width: 200, height: 40, borderColor: 'green', borderWidth: 5, color: 'blue' }}
                                id="categoryId"
                                value={categoryId}
                                name="categoryId"
                                onChange={this.onChangeCategory}
                            >
                                <option value=''>
                                    ---Search By Category---
                                </option>
                                {categoryList}
                            </select>
                        </Card.Text>
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
                    <p></p>
                    <h4>Products</h4>
                    <p></p>
                    <div>
                        <Table striped  hover variant="dark">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>$ Price</th>
                                    <th>Image</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products &&
                                    products.map((product, index) => (
                                        <tr className={
                                            (index === currentIndex ? "active" : "")
                                        }
                                            onClick={() => this.setActiveProduct(product, index)}
                                            key={index}
                                        >
                                            <td>
                                                {product.productId}
                                            </td>
                                            <td>
                                                {product.productName}
                                            </td>
                                            <td>
                                                ${product.price}
                                                {product.price != product.currentPrice ? (
                                                    <span className="displayCurrentPriceInTable">
                                                        &nbsp;<u>[ NOW:  ${product.currentPrice} ]</u>
                                                    </span>
                                                ): (
                                                        <span>
                                                        </span>
                                                )}
                                            </td>
                                            {product.productImage ? (
                                                <td>
                                                    {/* {product.productFileId} : */}
                                                    <img
                                                        width="50" height="50"
                                                        src={`${productImageUploadURL.url}/${product.productImage}`}
                                                        alt="Product Image"
                                                    />
                                                </td>
                                            ) : (
                                                <td>
                                                    {product.productFileId} :
                                                    NO IMAGE
                                                </td>
                                            )}

                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                    </div>
                  </div>
                <div className="col-md-4">
                    {currentProduct ? (
                        <div className="productDetails">
                            <Card>
                                <Card.Header>
                                    <h4>Selected Product</h4>
                                </Card.Header>
                                <Card.Body>
                                    <div>
                                        <label>
                                            <strong>Name</strong>
                                        </label>{" "}
                                        {currentProduct.productName}
                                    </div>
                                    <p></p>
                                    <div>
                                        <label>
                                            <strong>Description</strong>
                                        </label>{" "}
                                        {currentProduct.productDesc}
                                    </div>
                                    <p></p>
                                    <div>
                                        <label>
                                            <strong>Price </strong>
                                        </label>{" "}
                                        <span className="displayPrice">$ {currentProduct.price}</span>
                                    </div>
                                    <p></p>
                               
                                    {currentProduct.price == currentProduct.currentPrice ? (                                      
                                        <span>
                                        </span>
                                    ) : (
                                            <div>
                                                <label>
                                                    <strong>Discounted Price </strong>
                                                </label>{" "}
                                                <span className="displayCurrentPrice">$ {currentProduct.currentPrice}
                                                    <br />
                                                    [Discount {currentProduct.currentDiscountPercentage}%]
                                                </span>
                                            </div>
                                    )}
                                  
                                    <p></p>
                                    <div>
                                        {currentProduct.productImage ? (
                                            <span>
                                                {/* {currentProduct.productFileId} */}
                                                <img
                                                    width="200" height="200"
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
                                        <Link hidden={userRole != 'Admin'} to={"/product/" + currentProduct.productId}>
                                            <Button variant="info" size="md">
                                                Edit
                                            </Button>
                                        </Link>
                                        <span>   </span>
                                        {/*
                                        visible only to manager
                                        */}
                                        <Link hidden={userRole!='Manager'} to={"/product-discount/" + currentProduct.productId}>
                                            <Button variant="success" size="md">
                                                Set Discount
                                            </Button>
                                        </Link>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    ) : (
                        <div>
                            {/*
                            <br />
                                <p>Please click on a Product...</p>
                            */}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}