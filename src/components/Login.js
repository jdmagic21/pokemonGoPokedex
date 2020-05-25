import React from 'react'; 
import './Login.css'; 

export default class Login extends React.Component{
    render(){
        return(
            <form class="form-signin">
                <h1 clasName="h3 mb-3 from-weight-normal">Please Sign in</h1>
                <label for="inputUsername" className="sr-only">Username</label>
                <input type="text" id="inputUsername" className="form-control" placeholder="Username" required autofocus autocomplete="off"/>
                <label for="inputPassword" className="sr-only">Password</label>
                <input type="password" id="inputPassword" class="form-control" placeholder="Password" required autocomplete="off"/>
                <button class="btn bn-primary">Sign In</button>
            </form>
        )
    }

}