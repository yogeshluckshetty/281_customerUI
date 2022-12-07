import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import './Login.css';

class Login extends Component {
    //URLs
    apiURL = 'http://localhost:8080/public/login';

    constructor(props) {
        super(props);
        this.state = {
            loginSuccess: false,
            email: "",
            password: "",
            errorMessage: "",
            isCustomer: false
        };
    }

    handleEmailChange = (e) => {
        this.setState({
            email: e.target.value,
        })
    }

    handlePasswordChange = (e) => {
        this.setState({
            password: e.target.value,
        })
    }

    handleLogin = (e) => {
        e.preventDefault();
        const { email, password } = this.state;
        axios.post(this.apiURL,
            {
                email: email,
                password: password
            }).then(response => {
            localStorage.setItem('localUserId', response.data["id"]);
            localStorage.setItem('apiAuthToken', response.data["jwtToken"]);
            this.setState({
                loginSuccess: true,
                isCustomer: response.data.role === 'CUSTOMER'
            });
          })
        .catch(error => {
            //TODO: Handle Error
          this.setState({ errorMessage: "Invalid username or password!" });
        });

        
    }

    render() {
        const { loginSuccess } = this.state;
        let redirect = (<div></div>);
        if(loginSuccess){
            if(this.state.isCustomer){
                redirect = (
                    <Redirect to="/home" />
                );
            }
        }

        return (
            <div className="login">
                {redirect}
                <div className="login__main">
                    <span className="login__title">Login</span>

                    <form className="login__form" onSubmit={this.handleLogin}>
                      <div>
                        <label htmlFor="email">Email</label>
                        <input required id="email" type="email" onChange={this.handleEmailChange} placeholder="Enter email" />
                      </div>
                      <div>
                        <label htmlFor="password">Password</label>
                        <input required id="password" type="password" onChange={this.handlePasswordChange} placeholder="Enter password" />
                      </div>
                        <div class="errorMsg">{this.state.errorMessage}</div>
                        <button type="submit" className="login__button"><span>Log in</span></button>
                    </form>
                </div>
            </div>
        )
    }
}

export default Login;
