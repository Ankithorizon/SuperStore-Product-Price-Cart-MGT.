import './App.css';
import './index.css';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { Navbar, Container, NavDropdown, Nav } from "react-bootstrap";
import { Redirect } from 'react-router'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import UnAuthPage from "./components/un-auth-page.component";
import NotFoundPage from "./components/not-found-page.component";
import Home from "./components/home.component";
import Register from "./components/register.component";
import Login from "./components/login.component";
import FileUploadDownload from "./components/file-upload-download.component";
import ProductAdd from "./components/product-add.component";
import Products from "./components/products.component";
import ProductEdit from './components/product-edit.component';
import ProductDiscount from './components/product-discount.component';
import Shopping from './components/shopping.component';
import MyCart from './components/my-cart.component';
import Payment from './components/payment.component';
import TextReport from './components/text-report.component';
import ChartReport from './components/chart-report.component';

import AuthService from "./services/auth.service";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
      currentRole: undefined,
      showAdminBoard: false,
      showManagerBoard: false,
      showCSUserBoard: false
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    const role = AuthService.getCurrentUserRole();
    if (user && role) {
      this.setState({
        currentUser: user,
        currentRole: role,
        showAdminBoard: role=='Admin' ? true : false,
        showManagerBoard: role == 'Manager' ? true : false,
        showCSUserBoard: role == 'CSUser' ? true : false
      });
    }
  }

  componentWillUnmount() {
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showManagerBoard: false,
      showAdminBoard: false,
      showCSUserBoard: false,
      currentUser: undefined
    });
  }

  render() {
    const { currentUser, currentRole, showManagerBoard, showAdminBoard, showCSUserBoard} = this.state;
    return (
      <div className="App">

        <ToastContainer />

        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="/home">
              SS Product/Price/Cart MGT
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">

              {currentUser && showCSUserBoard ? (
                <Nav className="me-auto">                 
                  <Link to={"/shopping"} className="nav-link">
                    Shopping
                  </Link>                  
                </Nav>
              ) : (
                  <span></span>
              )}
         
              {currentUser && showAdminBoard ? (
                <Nav className="me-auto">              
                  <Link to={"/fileUploadDownload"} className="nav-link">
                    File-Up-Down-Load
                  </Link>
                  <Link to={"/product-add"} className="nav-link">
                    Product-Add
                  </Link>
                  <Link to={"/products"} className="nav-link">
                    Products
                  </Link>
                </Nav>
              ) : (
                  <span></span>
              )}

              {currentUser && showManagerBoard ? (
                <Nav className="me-auto">
                  <Link to={"/products"} className="nav-link">
                    Products
                  </Link>
                  <Link to={"/chart-report"} className="nav-link">
                    Chart-Report
                  </Link>
                  <Link to={"/text-report"} className="nav-link">
                    Text-Report
                  </Link>
                </Nav>                
              ) : (
                  <span></span>
              )}
              
              {currentUser ? (
                <Nav>               
                  <a href="/login" className="nav-link" 
                    onClick={this.logOut}>
                    <h3><b>[ {currentUser} - {currentRole} ]LogOut </b></h3>
                  </a>                
                </Nav>
              ) : (
                  <Nav>
                    <Link to={"/login"} className="nav-link">
                      Login
                    </Link>
                    <Link to={"/register"} className="nav-link">
                      Register
                    </Link>
                  </Nav>
              )}
           
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <div className="container mt-3 mainContainer">
          <Switch>            
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />  
            <Route exact path="/fileUploadDownload" component={FileUploadDownload} />
            <Route exact path="/product-add" component={ProductAdd} />
            <Route exact path="/products" component={Products} />
            <Route path="/product/:id" component={ProductEdit} />
            <Route path="/product-discount/:id" component={ProductDiscount} />
            <Route exact path="/shopping" component={Shopping} />
            <Route exact path="/my-cart" component={MyCart} />
            <Route exact path="/payment" component={Payment} />
            <Route exact path="/text-report" component={TextReport} />
            <Route exact path="/chart-report" component={ChartReport} />
            <Route exact path="/un-auth" component={UnAuthPage} />
            <Route component={NotFoundPage} />
            
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;