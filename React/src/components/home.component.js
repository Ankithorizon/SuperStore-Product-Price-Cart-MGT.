import React, { Component } from "react";
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';

export default class Home extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }
 
    render() {
       
        return (
            <div className="container">
                <div className="homePageHeader">
                    <h3>Super-Store Product/Price/Cart MGT</h3>
                    <h5>Technology : .Net Core Web API / EF Core / JWT Authentication / SQL Server / React JS</h5>
                </div>                
                <hr />
                <p></p>
                <div className="row">
                    <div className="col-sm-5">
                        <div>
                            <ListGroup>
                                <ListGroup.Item variant="primary">
                                    Exceptions Handling
                                </ListGroup.Item>
                                <div>
                                    <ul>
                                        <li>Model validations are handled on Client side - React - Component
                                        </li>
                                        <li>all Server side exceptions are handled on Api - Controller / C# Service</li>
                                    </ul>
                                </div>
                            </ListGroup>                         
                        </div>
                        <hr />
                        <div>
                            <ListGroup>
                                <ListGroup.Item variant="primary">
                                    Role based Authentication
                                </ListGroup.Item>
                                <div>
                                    <ul>
                                        <li>JWT Authentication</li>
                                        <li>after successful login, respective Role is returned in Token / Response</li>
                                        <li>React stores Role info with Token</li>
                                        <li>Menu displays as per Role info</li>
                                    </ul>
                                </div>
                            </ListGroup>
                        </div>
                        <hr />
                        <div>
                            <ListGroup>
                                <ListGroup.Item variant="primary">
                                    Register
                                </ListGroup.Item>
                                <div>
                                    <ul>
                                        <li>User can register with valid Username, Password, Email and Role [Admin/Manager/CSUser]</li>
                                        <li>after successful registration, user is redirected to login page</li>
                                        <li>after un-successful register, error message is displayed</li>
                                    </ul>
                                </div>
                            </ListGroup>
                        </div>                      
                        <hr />
                        <div>
                            <ListGroup>
                                <ListGroup.Item variant="primary">
                                    Login
                                </ListGroup.Item>
                                <div>
                                    <ul>
                                        <li>User can login with valid Username and Password</li>
                                        <li>after successful login, Token, Role and other User's information is stored
                                            on Client side and menu options are displayed as per User's Role and redirects to Home page</li>
                                        <li>after un-successful login, error message is displayed</li>
                                    </ul>
                                </div>
                            </ListGroup>
                        </div>
                    </div>
                    <div className="col-sm-2">
                    </div>
                    <div className="col-sm-5">
                        <div>
                            <ListGroup>
                                <ListGroup.Item variant="primary">
                                    Role : ADMIN
                                </ListGroup.Item>
                                <div>
                                    <ul>
                                        <li>User can add / edit / view Product</li>
                                        <li>User can add Product with Image upload</li>
                                        <li>User can edit Product with Image edit and upload</li>
                                    </ul>
                                </div>
                            </ListGroup>
                        </div>
                        <hr />
                        <div>
                            <ListGroup>
                                <ListGroup.Item variant="primary">
                                    Role : MANAGER
                                </ListGroup.Item>
                                <div>
                                    <ul>
                                        <li>User can view Product</li>
                                        <li>User can set Discount on Product </li>
                                        <li>User can View Text Report on</li>
                                    </ul>
                                </div>
                                <div className="row">
                                    <div className="col-1"></div>
                                    <div
                                        style={{ marginTop:-15, color: 'red' }}
                                        className="col-11">
                                        <ul>
                                            <li>[Monthly]-Product-Wise</li>
                                            <li>[Monthly]-Store-Wise </li>
                                            <li>Selected Product-Month-Wise</li>
                                        </ul>
                                    </div>
                                </div>
                                <div style={{ marginTop: -5 }}>
                                    <ul>
                                        <li>User can View Chart (google chart api) Report on</li>
                                    </ul>
                                </div>
                                <div className="row">                                    
                                    <div className="col-1"></div>
                                    <div
                                        style={{ marginTop: -15, color: 'red' }}
                                        className="col-11">
                                        <ul>
                                            <li>Product-Discount-Wise</li>
                                            <li>[Monthly]-Product-Wise</li>
                                            <li>[Monthly]-Store-Wise</li>
                                        </ul>
                                    </div>
                                </div>
                            </ListGroup>
                        </div>
                        <hr />
                        <div>
                            <ListGroup>
                                <ListGroup.Item variant="primary">
                                    Role : CSUSER
                                </ListGroup.Item>
                                <div>
                                    <ul>
                                        <li>User can view Product</li>
                                        <li>User can filter Product by Product-Name, Product-Description and Product-Category</li>
                                        <li>User can shop Product by adding Products and Product-Quantity to Shopping-Cart</li>
                                        <li>User can edit Shopping-Cart</li>
                                        <li>User can do Payment by either Cash or Credit-Card</li>
                                        <li>User can View Payment-Receipt after successful Payment</li>
                                    </ul>
                                </div>
                            </ListGroup>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}