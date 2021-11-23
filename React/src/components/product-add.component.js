import React, { Component } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import ProductDataService from "../services/product.service";
import AuthService from "../services/auth.service";
import { Card } from "react-bootstrap";
import { toast } from 'react-toastify';

import axios from 'axios';
import authHeader from '../services/auth-header';

import { FaArrowRight, FaLightbulb } from "react-icons/fa";

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

const toastProductSuccessOptions = {
    autoClose: 2000,
    type: toast.TYPE.SUCCESS,
    hideProgressBar: false,
    position: toast.POSITION.TOP_LEFT
};
const toastProductErrorOptions = {
    autoClose: 2000,
    type: toast.TYPE.ERROR,
    hideProgressBar: false,
    position: toast.POSITION.TOP_LEFT
};

const productImageUploadURL = {
    url: "https://localhost:44396/Files"
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

export default class ProductAdd extends Component {
    constructor(props) {
        super(props);
        this.onChangeProductName = this.onChangeProductName.bind(this);
        this.onChangeProductDesc = this.onChangeProductDesc.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.newProduct = this.newProduct.bind(this);
        this.onChangeCategory = this.onChangeCategory.bind(this);

        this.state = {
            categories: [],

            categoryId: '',
            id: null,
            productName: "",
            productDesc: "",
            price: "",
            productFileId: null,
            productImage: null,

            submitted: false,

            isError: {
                categoryId: '',
                productName: '',
                productDesc: '',
                price: ''
            },            

            // file upload
            selectedFile: null,
            status: '',
            progress: 0,
            statusFlag: 0   // 0 = success, 1 = fail
        };

        // check for logged in or not,,, to prevent browser back history
        if (AuthService.getCurrentUser() === null) {
            this.props.history.push('/login');
            window.location.reload();
        }
    }

    // loading category select list
    componentDidMount() {
        this.getCategories();
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

    //#region file upload
    onFileChange = event => {
        this.setState({ selectedFile: event.target.files[0] });
        event.target.value = null;
    };
    // upload product image
    uploadHandler = (event) => {
        if (this.state.selectedFile == null)
            return;

        const formData = new FormData();
        formData.append(
            "myFile",
            this.state.selectedFile,
            this.state.selectedFile.name
        );
        console.log(this.state.selectedFile);

        axios.post("https://localhost:44396/api/Product/productFileUpload", formData, { headers: authHeader() }, {
            onUploadProgress: progressEvent => {
                this.setState({
                    progress: (progressEvent.loaded / progressEvent.total * 100)
                })
            }
        })
            .then((response) => {
                console.log(' Uploaded ProductFile # ' + response.data.productFileId);
                // success
                if (response.data.responseCode == 0) {
                    // this.setState({ status: `${response.data.responseMessage} ` });
                    // this.setState({ statusFlag: 0 });
                    toast("" + response.data.responseMessage, toastSuccessOptions);
                    this.setState({ productFileId: response.data.productFileId });
                    this.setState({ productImage: response.data.productImage });
                }
                // fail
                else {
                    this.setState({ status: `${response.data.responseMessage} ` });
                    this.setState({ statusFlag: 1 });
                    toast("" + response.data.responseMessage, toastErrorOptions);
                }
                this.setState({ selectedFile: null });
                // this.setState({ selectedFile: '' });
            })
            .catch((error) => {
                this.setState({ selectedFile: null });
                if (error.response.status == 500) {
                    this.setState({ status: `FAIL : Server Error !` });
                    this.setState({ statusFlag: 1 });
                    toast("FAIL : Server Error !", toastErrorOptions);
                }
                else {
                    this.unAuthHandler401(error);
                }
            })
    }
    // display file info
    fileData = () => {
        if (this.state.selectedFile) {
            return (
                <Card>
                    <Card.Header>                        
                        File Details
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>
                            <span>File Name: {this.state.selectedFile.name}</span>
                        </Card.Text>
                        <Card.Text>
                            <span>File Type: {this.state.selectedFile.type}</span>
                        </Card.Text>
                        <Card.Text>
                            <span>
                                Last Modified:{" "}
                                {this.state.selectedFile.lastModifiedDate.toDateString()}
                            </span>
                        </Card.Text>
                    </Card.Body>
                </Card>
            );
        } else {
            return (
                <span>
                </span>
            );
        }
    };
    //#endregion

    onChangeProductName(e) {
        let isError = { ...this.state.isError };
        isError.productName =
            e.target.value.length < 4 ? "Product Name : Atleast 4 characaters required" : "";
        if (isError.productName == '') {
            isError.productName = e.target.value.length > 100 ? "Titile : Maximum 100 characaters required" : "";
        }
        this.setState({
            productName: e.target.value,
            isError
        });
    }

    onChangeProductDesc(e) {
        let isError = { ...this.state.isError };
        isError.productDesc =
            e.target.value.length < 4 ? "Description : Atleast 4 characaters required" : "";
        this.setState({
            productDesc: e.target.value,
            isError
        });
    }

    onChangePrice(e) {
        const re = /^\d*\.?\d*$/;

        const priceValue = e.target.value;
        this.setState({
            price: priceValue
        });

        let isError = { ...this.state.isError };
        
        if (e.target.value != '') {
            if (re.test(e.target.value)) {
                // ok
                isError.price =
                    e.target.value <= 0 ? "Price : Should be greater than 0" : "";
                this.setState({
                    isError
                });
            }
            else {
                // not a number
                isError.price = "Price : Enter only Numbers !";
                this.setState({
                    isError
                });
            }
        }
    }

    onChangeCategory = (event) => {
        let isError = { ...this.state.isError };
        isError.categoryId =
            event.target.value == '' ? "Category : is required" : "";

        this.setState({
            categoryId: event.target.value,
            isError
        });
    }

    onSubmit = e => {
        e.preventDefault();

        if (formValid(this.state)) {
            console.log(this.state);
        } else {
            console.log("Form is invalid!");
            return;
        }

        // check for all null values @ form
        if (this.state.categoryId == '' || this.state.productName == '' || this.state.productDesc == '' || this.state.price == '') {
            if (this.state.categoryId == '') {
                let isError = { ...this.state.isError };
                isError.categoryId = "Category : Required !";
                this.setState({
                    isError
                });
            }            
            if (this.state.productName == '') {
                let isError = { ...this.state.isError };
                isError.productName = "Product Name : Required !";
                this.setState({
                    isError
                });
            }
            if (this.state.productDesc == '') {
                let isError = { ...this.state.isError };
                isError.productDesc = "Product Description : Required !";
                this.setState({
                    isError
                });
            }
            if (this.state.price == '') {
                let isError = { ...this.state.isError };
                isError.price = "Price : Required !";
                this.setState({
                    isError
                });                
            }           
            return;
        }     

        // prepare data for api call
        var data = {
            categoryId: Number(this.state.categoryId),
            productName: this.state.productName,
            productDesc: this.state.productDesc,
            price: Number(this.state.price),
            productFileId: Number(this.state.productFileId)
        };

        // api call
        ProductDataService.create(data)
            .then(response => {
                console.log(response);
                this.newProduct();
                toast("Product Added Successfully !", toastProductSuccessOptions);
            })
            .catch(e => {
                // console.log(e);
                toast("Adding Product Fail !", toastProductErrorOptions);

                this.unAuthHandler401(e);
            });  
    }

    // reset product object state
    newProduct() {
        this.setState({
            categoryId: '',
            id: null,
            productName: "",
            productDesc: "",
            price: "",
            productFileId: null,
            productImage: null,

            submitted: false,

            isError: {
                categoryId: '',
                productName: '',
                productDesc: '',
                price: ''
            }
        });
    }

    render() {
        const { categoryId, categories , isError, productName, productDesc,price, productFileId, submitted } = this.state;
      
        let categoryList = categories.length > 0
            && categories.map((item, i) => {
                return (
                    <option key={i} value={item.categoryId} >
                        {item.categoryName}
                    </option>
                )
            }, this);        
        return (            
            <div>
                <div className="row">
                    <div className="col-sm-6">
                        <form onSubmit={this.onSubmit} noValidate>
                            <div>
                                <Card style={{ width: '30rem' }}>
                                    <Card.Header><h3>Add Product</h3></Card.Header>
                                    <Card.Body>
                                        <Card.Title>Category</Card.Title>
                                        <Card.Text>
                                            <select
                                                className={isError.categoryId.length > 0 ? "is-invalid form-control" : "form-control"}
                                                style={{ width: 300, height: 40, borderColor: 'green', borderWidth: 3, color: 'blue' }}
                                                id="categoryId"
                                                value={categoryId}
                                                name="categoryId"
                                                onChange={this.onChangeCategory}
                                                disabled={(productFileId) ? "" : "disabled"}
                                            >
                                                <option value=''>
                                                    ---select category---
                                                </option>
                                                {categoryList}
                                            </select>
                                            {isError.categoryId.length > 0 && (
                                                <span className="invalid-feedback">{isError.categoryId}</span>
                                            )}
                                        </Card.Text>
                                        <Card.Title>Product Name</Card.Title>
                                        <Card.Text>
                                            <span className="form-group">
                                                <input
                                                    type="text"
                                                    className={isError.productName.length > 0 ? "is-invalid form-control" : "form-control"}
                                                    id="productName"
                                                    value={productName}
                                                    onChange={this.onChangeProductName}
                                                    name="productName"
                                                    disabled={(productFileId) ? "" : "disabled"}
                                                />
                                                {isError.productName.length > 0 && (
                                                    <span className="invalid-feedback">{isError.productName}</span>
                                                )}
                                            </span>
                                        </Card.Text>
                                        <Card.Title>Product Description</Card.Title>
                                        <Card.Text>
                                            <span className="form-group">
                                                <textarea                                                    
                                                    className={isError.productDesc.length > 0 ? "is-invalid form-control" : "form-control"}
                                                    id="productDesc"
                                                    value={productDesc}
                                                    onChange={this.onChangeProductDesc}
                                                    name="productDesc"
                                                    disabled={(productFileId) ? "" : "disabled"}
                                                />
                                                {isError.productDesc.length > 0 && (
                                                    <span className="invalid-feedback">{isError.productDesc}</span>
                                                )}
                                            </span>
                                        </Card.Text>
                                        <Card.Title>Price</Card.Title>
                                        <Card.Text>
                                            <span className="form-group">
                                                <input
                                                    style={{ width: 100, height: 40, borderColor: 'blue', borderWidth: 3, color: 'green' }}
                                                    type="text"
                                                    className={isError.price.length > 0 ? "is-invalid form-control" : "form-control"}
                                                    id="price"
                                                    value={price}
                                                    onChange={this.onChangePrice}
                                                    name="price"
                                                    disabled={(productFileId) ? "" : "disabled"}
                                                />
                                                {isError.price.length > 0 && (
                                                    <span className="invalid-feedback">{isError.price}</span>
                                                )}
                                            </span>
                                        </Card.Text>
                                        {this.state.productFileId ? (
                                            <div>
                                                <button
                                                    type="submit"
                                                    className="btn btn-block btn-success">
                                                    Create Product
                                                </button>
                                            </div>
                                        ) : (
                                                <div className="uploadProductImageFirst">
                                                    <h3>Upload Product Image First! <FaArrowRight /></h3>
                                                </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </div>
                        </form>
                     </div>
                    <div className="col-sm-6">
                        <div>
                            <h3>Upload Product Image</h3>
                            <input type="file"
                                onChange={this.onFileChange} />

                            <button className="btn btn-block btn-info"
                                onClick={this.uploadHandler}>
                                Upload Image Now!
                            </button>
                        </div>
                        <p></p>
                        {this.fileData()}
                        
                        <p></p>
                        {this.state.progress > 0 ? (
                            <div className={this.state.progress < 100 ? "progressRunning" : "progressComplete"}>
                                <h3>File Upload Status</h3>
                                <p></p>
                                {this.state.progress}
                            </div>
                        ) : (
                            <div>
                            </div>
                        )}
                        <p></p>
                        <div className={this.state.statusFlag > 0 ? "errorClass" : "successClass"}>
                            {this.state.status}
                        </div>

                        <p></p>
                        <div>                            
                            {this.state.productFileId ? (
                                <div>
                                    <img
                                        height="300"
                                        width="300"
                                        src={`${productImageUploadURL.url}/${this.state.productImage}`}
                                        alt="Product Image" />
                                </div>
                            ) : (
                                    <div>
                                        
                                    </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
