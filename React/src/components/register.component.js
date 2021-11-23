import React, { Component } from "react";
import AuthService from "../services/auth.service";
import { Card } from "react-bootstrap";

const regExp = RegExp(
    /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
);
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
            if (error.response.data.errors[prop].length > 1) {
                for (let error_ in error.response.data.errors[prop]) {
                    // console.log(error.response.data.errors[prop][error_]);
                    errors.push(error.response.data.errors[prop][error_]);
                }
                // console.log(error.response.data.errors[prop][0]);
                // console.log(error.response.data.errors[prop][1]);
            }
            else {
                errors.push(error.response.data.errors[prop]);
            }            
        }
    }
    else {
        console.log(error);
    }
    return errors;
};

export default class Register extends Component {
    constructor(props) {
        super(props)

        this.resetRegisterFormState = this.resetRegisterFormState.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);      
        this.onChangeRole = this.onChangeRole.bind(this);

        this.state = {

            roles: [],

            modelErrors: [],
            registerSuccess : '',

            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            myRole: '',
            submitted: false,
            isError: {
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                myRole: ''
            }
        }

        // check for logged in or not,,, to prevent browser back history
        if (AuthService.getCurrentUser() != null) {
            this.props.history.push('/home');
            window.location.reload();
        }
    }

    componentDidMount() {
        this.getRoles();
    }
    getRoles() {
        AuthService.getRoles()
            .then(response => {             
                console.log(response.data);
                this.setState({
                    roles: response.data
                });
            })
            .catch(e => {
                console.log(e);
            });
    }
    
    onChangeRole(e) {
        let isError = { ...this.state.isError };
        isError.myRole =
            e.target.value.length == 0  ? "Role : is required" : "";      
        this.setState({
            myRole: e.target.value,
            isError
        });
    }
    onChangeUsername(e) {
        let isError = { ...this.state.isError };
        isError.username =
            e.target.value.length < 4 ? "User Name : Atleast 4 characaters required" : "";
        if (isError.username == '') {
            isError.username = e.target.value.length > 10 ? "User Name : Maximum 10 characaters required" : "";
        }
        else {
        }
        this.setState({
            username: e.target.value,
            isError
        });
    }
    onChangeEmail(e) {
        let isError = { ...this.state.isError };
        isError.email = regExp.test(e.target.value)
            ? ""
            : "Email address is invalid";     
        this.setState({
            email: e.target.value,
            isError
        });
    }
    onChangePassword(e) {
        let isError = { ...this.state.isError };
        isError.password =
            e.target.value.length < 4 ? "Password : Atleast 4 characaters required" : "";
        if (isError.password == '') {
            isError.password = e.target.value.length > 10 ? "Password : Maximum 10 characaters required" : "";
        }
        this.setState({
            password: e.target.value,
            isError
        });
    }
    onChangeConfirmPassword(e) {
        
        let isError = { ...this.state.isError };        
        isError.confirmPassword =
            e.target.value === this.state.password ? "" : "Confirm Password : Not Matched";
      
        this.setState({
            confirmPassword: e.target.value,
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
        if (this.state.confirmPassword == '' || this.state.username == '' || this.state.email == '' || this.state.password == '' || this.state.myRole == '') {
            if (this.state.confirmPassword == '') {
                let isError = { ...this.state.isError };
                isError.confirmPassword = "Confirm Password : Required !";
                this.setState({
                    isError,
                    submitted: false
                });
            }
            if (this.state.username == '') {
                let isError = { ...this.state.isError };
                isError.username = "UserName : Required !";
                this.setState({
                    isError,
                    submitted: false
                });
            }            
            if (this.state.email == '') {
                let isError = { ...this.state.isError };
                isError.email = "Email : Required !";
                this.setState({
                    isError,
                    submitted: false
                });
            }
            if (this.state.password == '') {
                let isError = { ...this.state.isError };
                isError.password = "Password : Required !";
                this.setState({
                    isError,
                    submitted: false
                });
            }
            if (this.state.myRole == '') {
                let isError = { ...this.state.isError };
                isError.myRole = "Role : Required !";
                this.setState({
                    isError,
                    submitted: false
                });
            }
            return;
        }      

        // prepare data for api call        
        var data = {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        };
        
        // check for (400) ModelState Invalid
        /*
        var data = {
            username: '',
            email: '',
            password: ''
        };
        */      

        // api call
        AuthService.register(data, this.state.myRole)
            .then(response => {
                console.log(response);
                               
                this.setState({
                    submitted: true,
                    registerSuccess: response.data.responseMessage
                });
                this.resetRegisterFormState();

                // redirect to login
                setTimeout(() => this.props.history.push('/login'), 2000)
            })
            .catch(error => {
                this.setState({
                    registerSuccess: ''
                });

                // 400-ModelState, 500
                // 400
                if (error.response.status === 400) {
                    console.log(error.response.data);
                    this.setState({
                        modelErrors: handleModelState(error)
                    });
                }
                else {
                    // all other than 400 errors from api
                    // console.log('500 : Error');
                    // console.log(error.response.data.responseMessage);
                    var errors = [];
                    errors.push(error.response.data.responseMessage);
                    this.setState({
                        modelErrors: errors
                    });
                }
            });
    }

    // reset register form state
    resetRegisterFormState() {
        this.setState({
            modelErrors: [],

            username: '',
            email: "",
            password: "",
            myRole: '',
            confirmPassword: '',

            submitted: false,

            isError: {
                username: '',
                email: '',
                password: '',
                myRole: '',
                confirmPassword: ''
            }
        });
    }

    doLogin = () => {
        this.props.history.push('/login');
    }

    render() {
        const {password, confirmPassword, myRole, roles, registerSuccess, modelErrors,  isError } = this.state;

        let roleList = roles.length > 0
            && roles.map((item, i) => {
                return (
                    <option key={i} value={item} >
                        {item}
                    </option>
                )
            }, this);
        
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
                <Card style={{ width: '60rem' }}>
                    <Card.Header>
                        <div style={{ marginBottom: 30 }}>
                            <h3 >Register</h3>
                        </div>                        
                        {modelErrors.length > 0 ? (
                            <span style={{ color: 'red' }}>
                                {modelErrorList}
                            </span>
                        ) : (
                            <span></span>
                        )}

                        {registerSuccess ? (
                            <span style={{ color: 'green' }}>
                                <h4><b>{registerSuccess}</b></h4>
                            </span>
                        ) : (
                                <span></span>
                        )}

                    </Card.Header>

                    <div className="row">                 
                        <div className="col-sm-5">
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
                                            onChange={this.onChangeUsername}
                                        />
                                        {isError.username.length > 0 && (
                                            <span className="invalid-feedback">{isError.username}</span>
                                        )}
                                    </span>
                                </Card.Text>
                                <Card.Title>Email</Card.Title>
                                <Card.Text>
                                    <span className="form-group">
                                        <input
                                            type="email"
                                            className={isError.email.length > 0 ? "is-invalid form-control" : "form-control"}
                                            name="email"
                                            value={this.state.email}
                                            id="email"
                                            onChange={this.onChangeEmail}
                                        />
                                        {isError.email.length > 0 && (
                                            <span className="invalid-feedback">{isError.email}</span>
                                        )}
                                    </span>
                                </Card.Text>
                                {roles.length > 0 && (
                                    <span>
                                        <Card.Title>Role</Card.Title>
                                        <Card.Text>
                                            <span className="form-group">
                                                <select
                                                    style={{ width: 200, height: 40, borderColor: 'blue', borderWidth: 2, color: 'red' }}
                                                    className={isError.myRole.length > 0 ? "is-invalid form-control" : "form-control"}
                                                    id="myRole"
                                                    value={myRole}
                                                    name="myRole"
                                                    onChange={this.onChangeRole}
                                                >
                                                    <option value=''>
                                                        ---Role---
                                                    </option>
                                                    {roleList}
                                                </select>
                                                {isError.myRole.length > 0 && (
                                                    <span className="invalid-feedback">{isError.myRole}</span>
                                                )}
                                            </span>
                                        </Card.Text>
                                    </span>
                                )}
                            </Card.Body>
                        </div>
                        <div className="col-sm-5">
                            <Card.Body>
                                <Card.Title>Password</Card.Title>
                                <Card.Text>
                                    <span className="form-group">
                                        <input
                                            type="password"
                                            className={isError.password.length > 0 ? "is-invalid form-control" : "form-control"}
                                            name="password"
                                            value={password}
                                            id="password"
                                            onChange={this.onChangePassword}
                                        />
                                        {isError.password.length > 0 && (
                                            <span className="invalid-feedback">{isError.password}</span>
                                        )}
                                    </span>
                                </Card.Text>
                                <Card.Title>Confirm Password</Card.Title>
                                <Card.Text>
                                    <span className="form-group">
                                        <input
                                            type="password"
                                            className={isError.confirmPassword.length > 0 ? "is-invalid form-control" : "form-control"}
                                            name="confirmPassword"
                                            value={confirmPassword}
                                            id="confirmPassword"
                                            onChange={this.onChangeConfirmPassword}
                                        />
                                        {isError.confirmPassword.length > 0 && (
                                            <span className="invalid-feedback">{isError.confirmPassword}</span>
                                        )}
                                    </span>
                                </Card.Text>                              
                            </Card.Body>
                        </div>
                    </div>
                    <Card.Body>
                        <hr />
                        <div className="row">
                            <div className="col-sm-3 loginRegisterButton">
                                <button
                                    type="submit"
                                    className="registerButtonWidth btn btn-block btn-success ">
                                    <h5>Register</h5>
                                </button>
                            </div>
                            <div className="col-sm-4">
                                <button
                                    type="button"
                                    onClick={() => this.doLogin()}
                                    className="loginButtonWidth btn btn-block btn-info">
                                    <h5>Login </h5>
                                </button>
                            </div>
                        </div>                
                    </Card.Body>
                </Card>
            </form>
        );
    }
}