import React, { Component } from "react";
import ProductDataService from "../services/product.service";
import AuthService from "../services/auth.service";
import { Button, Card } from "react-bootstrap";
import { toast } from 'react-toastify';
import axios from 'axios';
import authHeader from '../services/auth-header';

const productImageUploadURL = {
    url: "https://localhost:44396/Files"
};

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

export default class ProductEdit extends Component {
    constructor(props) {
        super(props);
        this.onChangeProductName = this.onChangeProductName.bind(this);
        this.onChangeProductDesc = this.onChangeProductDesc.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.onChangeCategory = this.onChangeCategory.bind(this);

        this.state = {
            categories: [],

            currentProduct: {
                categoryId: '',
                productId: null,
                productName: "",
                productDesc: "",
                price: "",
                productFileId: null,
                productImage: null
            },
       
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

    componentDidMount() {
        this.getProduct(this.props.match.params.id);

        this.getCategories();
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

        let formData = new FormData();
        formData.append(
            "myFile",
            this.state.selectedFile,
            this.state.selectedFile.name
        );
        // formData.append("productId", JSON.stringify(this.state.currentProduct.productId));
        formData.append("productId", this.state.currentProduct.productId);
        formData.append("productFileId", this.state.currentProduct.productFileId);
       
        axios.post("https://localhost:44396/api/Product/editProductFileUpload", formData, { headers: authHeader(), "Content-Type": "multipart/form-data" }, {
            onUploadProgress: progressEvent => {
                this.setState({
                    progress: (progressEvent.loaded / progressEvent.total * 100)
                })
            }
        })
            .then((response) => {             
                // success
                if (response.data.responseCode == 0) {                
                    toast("" + response.data.responseMessage, toastSuccessOptions);
                    this.setState(function (prevState) {
                        return {
                            currentProduct: {
                                ...prevState.currentProduct,
                                productFileId: response.data.productFileId,
                                productImage: response.data.productImage
                            }
                        };
                    });
                }
                // fail
                else {                 
                    toast("" + response.data.responseMessage, toastErrorOptions);
                }
                this.setState({ selectedFile: null });
            })
            .catch((error) => {
                this.setState({ selectedFile: null });
                if (error.response.status == 500) {
                    toast("FAIL : Server Error !", toastErrorOptions);
                }
                else if (error.response.status == 400) {
                    toast("FAIL : Bad Request !", toastErrorOptions);
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

    //#region edit product properties
    onChangeProductName(e) {
        let isError = { ...this.state.isError };
        isError.productName =
            e.target.value.length < 4 ? "Product Name : Atleast 4 characaters required" : "";
        if (isError.productName == '') {
            isError.productName = e.target.value.length > 100 ? "Titile : Maximum 100 characaters required" : "";
        }

        const productName = e.target.value;
        this.setState(function (prevState) {
            return {
                currentProduct: {
                    ...prevState.currentProduct,
                    productName: productName
                },
                isError
            };
        });
    }
    onChangeProductDesc(e) {
        let isError = { ...this.state.isError };
        isError.productDesc =
            e.target.value.length < 4 ? "Description : Atleast 4 characaters required" : "";
      
        const productDesc = e.target.value;
        this.setState(function (prevState) {
            return {
                currentProduct: {
                    ...prevState.currentProduct,
                    productDesc: productDesc
                },
                isError
            };
        });
    }
    onChangePrice(e) {
        let isError = { ...this.state.isError };
        const re = /^\d*\.?\d*$/;
        const price = e.target.value;
        /*
        isError.price =
            isNaN(e.target.value) ? "Enter Numbers Only !" : "";
        */        
        isError.price = re.test(e.target.value) ? "" : "Numbers Only !";
       
        if (isError.price == '') {
            isError.price = e.target.value>0 ? "" : "Must be > 0 !";
        }

        if (isNaN(e.target.value)) {
            console.log('not a number' +e.target.value);

            this.setState(function (prevState) {
                return {
                    currentProduct: {
                        ...prevState.currentProduct,
                        price: price
                    },
                    isError
                };
            });
        }
        else {
            console.log('number' + e.target.value);
            this.setState(function (prevState) {
                return {
                    currentProduct: {
                        ...prevState.currentProduct,
                        price: (e.target.value)
                    },
                    isError
                };
            });
        }     
    }
    onChangeCategory = (event) => {
        console.log('new category...'+ event.target.value);
        let isError = { ...this.state.isError };
        isError.categoryId =
            event.target.value == '' ? "Category : is required" : "";

        
        this.setState(function (prevState) {
            return {
                currentProduct: {
                    ...prevState.currentProduct,
                    categoryId: event.target.value
                },
                isError
            };
        });
    }
    //#endregion edit product properties

    // get product to edit
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
    
    // post edited product
    updateProduct() {

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
             
        const editingProduct = {
            categoryId: Number(this.state.currentProduct.categoryId),
            productId: this.state.currentProduct.productId,
            productName: this.state.currentProduct.productName,
            productDesc: this.state.currentProduct.productDesc,
            price: Number(this.state.currentProduct.price)
        }
     
        // api call
        ProductDataService.edit(
            this.state.currentProduct.productId,
            editingProduct
        )
            .then(response => {
                console.log(response.data);
                this.setState({
                    message: "The product was updated successfully!",
                    submitted: true
                });
                if (response.data.responseCode == 0)
                    toast(response.data.responseMessage + "", toastSuccessOptions);
                else
                    toast(response.data.responseMessage + "", toastErrorOptions);
                // after success,,, go back to products page                
                setTimeout(() => this.props.history.push('/products'), 2000)
            })
            .catch(e => {
                console.log(e.message); // Request failed with status code 400
                console.log(e.response.status); // 400
                console.log(e.response.data);
                if (e.response.status == 400 && e.response.data.responseCode == -2)
                    toast("" + e.response.data.responseMessage, toastErrorOptions);
                else
                    toast("Bad Request !", toastErrorOptions);

                this.unAuthHandler401(e);

                // after error,,, go back to products page
                setTimeout(() => this.props.history.push('/products'), 3000)
            });
    }

    render() {
        const { currentProduct } = this.state;
        const { isError } = this.state;
        const { categories } = this.state;

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
                        <form>
                            {this.state.submitted ? (
                                <div>
                                </div>
                            ) : (
                                <Card style={{ width: '30rem' }}>
                                    <Card.Header><h3>Edit Product [ {currentProduct.productId} ]</h3></Card.Header>
                                        <Card.Body>
                                            <Card.Title>Category</Card.Title>
                                            <Card.Text>
                                                <select
                                                    className={isError.categoryId.length > 0 ? "is-invalid form-control" : "form-control"}
                                                    style={{ width: 300, height: 40, borderColor: 'green', borderWidth: 3, color: 'blue' }}
                                                    id="categoryId"
                                                    value={this.state.currentProduct.categoryId}
                                                    name="categoryId"
                                                    onChange={this.onChangeCategory}                                                    
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
                                                    value={this.state.currentProduct.productName}
                                                    onChange={this.onChangeProductName}
                                                    name="productName"
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
                                                    value={this.state.currentProduct.productDesc}
                                                    onChange={this.onChangeProductDesc}
                                                    name="productDesc"
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
                                                    value={currentProduct.price}
                                                    onChange={this.onChangePrice}
                                                    name="price"
                                                />
                                                {isError.price.length > 0 && (
                                                    <span className="invalid-feedback">{isError.price}</span>
                                                )}
                                            </span>
                                        </Card.Text>
                                        <hr />
                                        <Button variant="info"
                                            onClick={() => this.updateProduct()}
                                            size="md">
                                            Edit Product
                                        </Button>
                                    </Card.Body>
                                </Card>
                            )}
                        </form>
                    </div>
                    <div className="col-sm-6">
                        <div>
                            <h3>Edit Product Image</h3>
                            <p></p>
                            <div>
                                {this.state.currentProduct.productImage ? (
                                    <div>
                                        <img src={`${productImageUploadURL.url}/${this.state.currentProduct.productImage}`} alt="Product Image" />
                                    </div>
                                ) : (
                                    <div>
                                        N/A
                                    </div>
                                )}
                            </div>
                            <p></p>

                            <div>
                                <input type="file"
                                    onChange={this.onFileChange} />

                                <button className="btn btn-block btn-info"
                                    onClick={this.uploadHandler}>
                                    Upload Image Now!
                                </button>
                            </div>
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
                     
                    </div>
                </div>
            </div>
        );
    }
}
