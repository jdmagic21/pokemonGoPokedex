import React from 'react'; 
import {withRouter} from 'react-router-dom'; 
var $ = require('jquery'); 

class FriendsAdd extends React.Component{
    constructor(){
        super(); 
        this.state = {
            friend: {
                status: "good"
            }
        }
        this.handleSubmit = this.handleSubmit.bind(this); 
        this.handleChange = this.handleChange.bind(this); 
    }

    handleChange(event){
        var value = event.target.value;
        var currentFriend = this.state.friend; 
        currentFriend[event.target.name] = value; 
        this.setState({
            friend: currentFriend
        }); 
    }
    handleSubmit(event){
        $.ajax({
            url: '/friends/add', 
            method: 'POST', 
            data:{
                name: this.state.friend.name, 
                status: this.state.friend.status, 
                daysNextStatus: this.state.friend.daysNextStatus
            },
            success: ()=>{
                window.location.reload(false); 
            },
            error: (err)=>{
                console.log(err)
            }

        });
        event.preventDefault(); 
    }
    //add event handlers to each form input type, and update state
    //on submit send the state to the friends api endpoint
    render(){
        return(
            <div id="single-friend" class="col-md-4">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item"><a href="/friends">All Friends</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Add Friend</li>
                    </ol>
                </nav>
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" className="form-control" name="name" onInput={this.handleChange}/>
                </div>
                <div className="form-group">
                <label htmlFor="status">Status</label>
                <select htmlFor="status" id="status" name="status" onChange={this.handleChange} className="form-control">
                    <option value="good">Good</option>
                    <option value="great">Great</option>
                    <option value="ultra">Ultra</option>
                    <option value="best">Best</option>                    
                </select>
                </div>
                <div className="form-group">
                    <label htmlFor="daysNextStatus">Days To Next Status</label>
                    <input type="number" htmlFor="daysNextStatus" id="daysNextStatus" name="daysNextStatus" className="form-control" onInput={this.handleChange}/>
                </div>

   <button type="submit" className="btn btn-primary float-right">Add</button>
            </form>
            </div>
        )
    }
}

export default withRouter(FriendsAdd); 