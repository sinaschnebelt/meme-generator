import React, {Component} from 'react';

class LoginComponent extends Component{

    constructor(props){
        super(props);
        this.state = {
            userName: '',
            userPassword: ''
        };
    }

    componentDidMount(){
    }

    handleUserNameChange = (e) => {
        this.setState({userName: e.target.value});
    }

    handleUserPasswordChange = (e) => {
        this.setState({userPassword: e.target.value});
    }

    login = () => {
        this.props.setToken("true");
        const data = {
            userName: this.state.userName,
            userPassword: this.state.userPassword
        }
        fetch('/users/createUser', {
            method: 'post',
            mode: 'cors',
            headers:{
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data),
        })
            .then((data) => {
                if(data.status === 200){
                    console.log('User has been stored to database');
                }
            })
            .catch((error) => console.log( error.response.request) );
    }

    render(){


        return(
            <div className="loginform-wrapper">
                <div className="loginform">
                    <h1 id="logincaption">Please Log In</h1>
                    <form>
                        <label>
                            <p>Username</p>
                            <input type="text" value={this.state.userName} onChange={this.handleUserNameChange}/>
                        </label>
                        <label>
                            <p>Password</p>
                            <input type="password" value={this.state.userPassword} onChange={this.handleUserPasswordChange} />
                        </label>
                        <div>
                            <button type="submit" onClick={() => {this.login()}}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>

        );
    }

}


export default LoginComponent;