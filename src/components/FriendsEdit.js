import React from 'react'; 
import {withRouter} from 'react-router-dom'; 
var $ = require('jquery'); 

class FriendsEdit extends React.Component{
    constructor(){
        super(); 
        this.handleSubmit = this.handleSubmit.bind(this); 
        this.handleChange = this.handleChange.bind(this); 
        this.handleDelete = this.handleDelete.bind(this); 
        this.state= {
            friend: {}
        }; 
    }
    handleChange(event){
        var value = event.target.value;
        var currentFriend = this.state.friend; 
        currentFriend[event.target.name] = value; 
        this.setState({
            friend: currentFriend
        }); 
    }
    handleDelete(event){
        $.ajax({
            url:'/friends/delete', 
            method: 'POST',
            data:{
                name: this.state.friend.name
            },
            success: ()=>{
                console.log('success'); 
                window.location.href="/friends/"; 
            },
            error: (err)=>{
                console.log(err); 
            }

        });
        event.preventDefault(); 
    }
    handleSubmit(event){
        $.ajax({
            url: '/friends/update',
            method: 'POST',
            data:{
                oldName: this.state.friend.oldName,
                name: this.state.friend.name, 
                status: this.state.friend.status, 
                daysNextStatus: this.state.friend.daysNextStatus
            },
            success: ()=>{
                window.location.href=`/friends/edit/${this.state.friend.name}`;
            }
        });
        event.preventDefault(); 
    }
    async componentDidMount(){
        const name = this.props.match.params.name;         
        var friend = await fetch(`/friends/${name}`).then(res => res.json());
        friend.oldName = friend.name; 
        this.setState({
            friend: friend
        }); 
        console.log(this.state.friend); 
    }
    render(){
        return(
<div id="single-friend" class="col-md-4">
<nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item"><a href="/friends">All Friends</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Edit {this.state.friend.name}</li>
                    </ol>
                </nav>


            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" className="form-control" name="name" onInput={this.handleChange} defaultValue={this.state.friend.name}/>
                </div>
                <div className="form-group">
                <label htmlFor="status">Status</label>
                <select htmlFor="status" id="status" name="status" onChange={this.handleChange} className="form-control" value={this.state.friend.status}>
                    <option value="good">Good</option>
                    <option value="great">Great</option>
                    <option value="ultra">Ultra</option>
                    <option value="best">Best</option>                    
                </select>
                </div>
                <div className="form-group">
                    <label htmlFor="daysNextStatus">Days To Next Status</label>
                    <input type="number" htmlFor="daysNextStatus" id="daysNextStatus" name="daysNextStatus" className="form-control" onInput={this.handleChange} defaultValue={this.state.friend.daysNextStatus}/>
                </div>
             
                <button type="submit" className="btn btn-primary float-right ml-1">Update</button> 
              
            </form>
          
            <button onClick={this.handleDelete} className="btn btn-danger float-right">Delete</button> 
           
            </div>

        )
    }

}
export default withRouter(FriendsEdit); 


