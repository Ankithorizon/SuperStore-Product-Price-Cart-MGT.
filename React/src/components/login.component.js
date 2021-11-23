import React, { Component } from "react";
import AuthService from "../services/auth.service";
import {Card } from "react-bootstrap";

const formValid = ({ isError, ...rest }) => {
    let isValid = false;
    var BreakException = {};
    try {
        Object.values(isError).forEach(val => {
            console.log('checking... ' + val);
            if (val.length > 0) {
                isValid = false
                throw BreakException;
            } else {
                isValid = true
            }
        });
    } catch (e) {
        return isValid;
    }
    return isValid;
};

const handleModelState = (error) => {
    var errors = [];
    if (error.response.status === 400) {    
        for (let prop in error.response.data.errors) {
            errors.push(error.response.data.errors[prop]);
        }
    }
    else {
        console.log(error);
    }
    return errors;
};

export default class Login extends Component {
    constructor(props) {
        super(props)

        this.resetLoginFormState = this.resetLoginFormState.bind(this);

        this.state = {
            modelErrors: [],

            username: '',
            password: '',
            submitted: false,
            isError: {
                username: '',
                password: ''
            }
        }

        // check for logged in or not,,, to prevent browser back history
        if (AuthService.getCurrentUser() != null) {
            this.props.history.push('/home');
            window.location.reload();
        }
    }


    onSubmit = e => {
        e.preventDefault();

        if (formValid(this.state)) {
            console.log(this.state)
        } else {
            console.log("Form is invalid!");
            return;
        }

        // check for all null values @ form
        if (this.state.username == '' || this.state.password == '') {
            this.setState({
                submitted: false
            });
            return;
        }

        // prepare data for api call
        
        var data = {
            username: this.state.username,
            password: this.state.password
        };
        
        // check for (400) ModelState Invalid
        /*
        var data = {
            username: '',
            password: ''
        };
        */
        
        // check for (400:401) Invalid UserName / Password
        /*
        var data = {
            username: 'hahahahah',
            password: 'hahahahahahah'
        };
        */
        // api call
        AuthService.login(data)
            .then(response => {
                console.log(response);
                this.setState({
                    submitted: true
                });
                this.resetLoginFormState();

                // store @ local-storage
                console.log(response.data.token);
                console.log(response.data.userName);
                console.log(response.data.myRole);
                console.log(response.data.response.responseCode);
                if (response.data.response.responseCode == 200) {
                    localStorage.setItem("token", JSON.stringify(response.data.token));
                    localStorage.setItem("user-name", JSON.stringify(response.data.userName));
                    localStorage.setItem("user-role", JSON.stringify(response.data.myRole));
                    this.props.history.push("/home");
                    window.location.reload();
                }
                else {
                    console.log(response.data.response.responseCode + " : " + response.data.response.responseMessage);
                } 
            })
            .catch(error => {
                if (error.response.status === 400) {
                    // 400:401
                    if (typeof error.response.data.response != "undefined" && error.response.data.response.responseCode == 401) {
                        console.log(error.response.data.response.responseMessage);
                        var errors = [];
                        errors.push(error.response.data.response.responseMessage);
                        this.setState({
                            modelErrors: errors
                        });
                    }
                    else if (typeof error.response.data.response != "undefined" && error.response.data.response.responseCode == 500) {
                        console.log(error.response.data.response.responseMessage);
                        var errors = [];
                        errors.push(error.response.data.response.responseMessage);
                        this.setState({
                            modelErrors: errors
                        });
                    }
                    // 400
                    else {
                        this.setState({
                            modelErrors: handleModelState(error)
                        });
                    }   
                }
                else {
                    console.log('other error...');
                }
            });
    };

    // reset login form state
    resetLoginFormState() {
        this.setState({
            username: '',
            password: "",

            submitted: false,

            isError: {
                username: '',
                password: ''
            }
        });
    }

    formValChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let isError = { ...this.state.isError };

        switch (name) {
            case "username":
                isError.username =
                    value.length < 4 ? "User Name : Atleast 4 characaters required" : "";
                break;         
            case "password":
                isError.password =
                    value.length < 6 ? "Password : Atleast 6 characaters required" : "";
                break;
            default:
                break;
        }
        this.setState({
            isError,
            [name]: value
        })
    };

    doRegister = () => {
        this.props.history.push('/register');
    }
    render() {
        const { modelErrors, isError } = this.state;

        let modelErrorList = modelErrors.length > 0
            && modelErrors.map((item, i) => {
                return (
                    <ul key={i} value={item} >
                        <li style={{ marginTop: -20 }}>{item}</li>
                    </ul>
                )
            }, this);
        
        return (
            <form onSubmit={this.onSubmit} noValidate>
                <Card style={{ width: '25rem' }}>
                    <Card.Header>
                        <h3 style={{ marginBottom: 30 }}>Login</h3>

                        {modelErrors.length > 0 ? (
                            <span style={{ color: 'red' }}>
                                {modelErrorList}
                            </span>
                        ) : (
                            <span></span>
                        )}
                    </Card.Header>
                    <Card.Body>
                        <Card.Title>User Name</Card.Title>
                        <Card.Text>
                            <span className="form-group">
                                <input
                                    type="text"
                                    className={isError.username.length > 0 ? "is-invalid form-control" : "form-control"}
                                    name="username"
                                    value={this.state.username}
                                    id="username"
                                    onChange={this.formValChange}
                                />
                                {isError.username.length > 0 && (
                                    <span className="invalid-feedback">{isError.username}</span>
                                )}
                            </span>
                        </Card.Text>
                        <Card.Title>Password</Card.Title>
                        <Card.Text>
                            <span className="form-group">
                                <input
                                    type="password"
                                    className={isError.password.length > 0 ? "is-invalid form-control" : "form-control"}
                                    name="password"
                                    value={this.state.password}
                                    id="password"
                                    onChange={this.formValChange}
                                />
                                {isError.password.length > 0 && (
                                    <span className="invalid-feedback">{isError.password}</span>
                                )}
                            </span>
                        </Card.Text>
                        <p></p>
                        <hr />
                        <div className="row">
                            <div className="col-sm-5">
                                <button
                                    type="submit"
                                    className="loginButtonWidth btn btn-block btn-success">
                                    <h5>Login</h5>
                                </button>
                            </div>
                            <div className="col-sm-6">                           
                                <button
                                    type="button"
                                    onClick={() => this.doRegister()}
                                    className="registerButtonWidth btn btn-block btn-info">
                                    <h5>Register</h5>
                                </button>
                            </div>
                        </div>
                     
                    </Card.Body>
                </Card>
            </form>
        );
    }
}