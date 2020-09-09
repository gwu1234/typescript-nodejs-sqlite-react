import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

interface IUser {
    id: number;
    name: string;
    email: string;
}

interface IOrder {
  id: number;
  name: string;
  status: string;
}

interface IUserState {
  users: IUser[],
  orders: IOrder[],
  userId: number,
  title: string,
}

export default class Users extends Component<any, IUserState> {
  public state: IUserState = {
      users: [],
      orders:[],
      userId: 0,
      title: "",
  };

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log ("userId = ", event.target.value);
      var userId = parseInt(event.target.value);
      console.log (userId);
      if (String (userId) === "NaN") {
          this.setState({userId: 0});
      } else {
          this.setState({userId: userId});
      }
  }

  private handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      this.getUser();
  };

  private getUser = async () => {
    console.log("getUser");
    const {userId} = this.state;
    if (userId <= 0) {
      return
    }
    console.log("userId = ", userId);
    const api = "/api/user/" + userId.toString();
    console.log(api);
    const response = await fetch(api, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    });
    console.log(response.status)
    const jsonResponse = await response.json();
    console.log(jsonResponse)
    const title : string = "User for id  " + userId; 
    this.setState({ users: jsonResponse.users, orders:[], title:title});
  };

  private getUsers = async () => {
    const response = await fetch("/api/users", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    console.log(response.status)
    const jsonResponse = await response.json();
    console.log(jsonResponse)
    this.setState({ users: jsonResponse.users, orders:[], title:"All Users"});
  };

  private searchOrders = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.getAssignedOrders();
  };

  private getAssignedOrders = async () => {
    console.log("getAssignedOrders");
    const {userId} = this.state;
    if (userId <= 0) {
      return
    }
    const response = await fetch("/api/getassignedorders", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: userId}),
    });
    console.log(response.status)
    const jsonResponse = await response.json();
    console.log(jsonResponse)
    const title: string = "workorders assigned to user id " + userId
    this.setState({ orders: jsonResponse.orders, users:[], title:title});
  };

  private getNotAssignedUsers = async () => {
    const response = await fetch("/api/getnotassignedusers", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    console.log(response.status)
    const jsonResponse = await response.json();
    console.log(jsonResponse)
    this.setState({ users: jsonResponse.users, orders:[], title: "Users without open workorders assigned"});
  };

  render() {
    const { users, orders, userId, title} = this.state;
    console.log(users);

    return (
      <div>
        <h3>Productivity and Users</h3>

        <div style={{marginTop:20}}>
            <p style={{fontSize:14,fontWeight:"bold", color:"black"}}>search a user</p>
            <form onSubmit={this.handleSubmit}>
                  <label style={{fontSize:14, fontWeight:"normal"}}>
                      User Id: <input type="text" value={userId} onChange={this.handleChange} />
                  </label>
                  <input 
                      style ={{color:"white", background:"green", fontWeight:"bold", fontSize: 15, padding: 3}} 
                      type="submit" 
                      value="One User" 
                    />
            </form>
        </div>

        <div style={{marginTop:30}}>
            <p style={{fontSize:14,fontWeight:"bold", color:"black"}}>search all users</p>
            <button 
                style ={{color:"white", background:"green", fontWeight:"bold", fontSize: 15, padding: 2}} 
                type="button" 
                onClick={this.getUsers}
              >
                  All Users
            </button>
        </div>

        <div style={{marginTop:30}}>
            <p style={{fontSize:14,fontWeight:"bold", color:"black"}}>search workorders assigned to a user</p>
            <form onSubmit={this.searchOrders}>
                <label style={{fontSize:14, fontWeight:"normal"}}>
                      User Id:
                      <input type="text" value={userId} onChange={this.handleChange} />
                </label>
                <input 
                      style ={{color:"white", background:"green", fontWeight:"bold", fontSize: 14, padding: 3}} 
                      type="submit" 
                      value="Assigned Orders" 
                  />
            </form>
        </div>

        <div style={{marginTop:20}}>
        <p style={{fontSize:14,fontWeight:"bold", color:"black"}}>search users without any open workorders assigned</p>
            <button
                style ={{color:"white", background:"green", fontWeight:"bold", fontSize: 15, padding: 2}}  
                type="button" onClick={this.getNotAssignedUsers}>
                  Not Assigned Users
            </button>
        </div>

        <div style={{marginTop:30}}>
        {users.length > 0 && <table style={{width:"100%", border: "2px dotted white"}}>
            <caption style={{fontSize:16,fontWeight:"bold", color:"white", marginBottom:10}}>{title}</caption> 
            <tbody style={{fontSize:15,fontWeight:"normal", color:"white"}}>
                { users.map(user => (
                      <tr key={user.id}><th>{user.name}</th><th>{user.email}</th></tr>
                  ))
                }
            </tbody>
        </table> }

        {orders.length > 0 && <table style={{width:"100%"}}>
            <caption style={{fontSize:16,fontWeight:"bold", color:"white", marginBottom:10}}>{title}</caption> 
            <tbody style={{fontSize:15,fontWeight:"normal", color:"white"}}>
                { orders.map(order => (
                      <tr key={order.id}><th>{order.name}</th><th>{order.status}</th></tr>
                  ))
                }
            </tbody>
        </table> }
        </div>

         <div style={{marginTop:30}}>
               Going Home ?<Link to="/">Home</Link>
         </div>

         <div style={{marginTop:30}}>
               going to workorders : <Link to="/workorders">Workorders</Link>
          </div>
      </div>
    );
  }
}
