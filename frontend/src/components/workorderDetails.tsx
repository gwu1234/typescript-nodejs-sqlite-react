import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./workorderDetails.css";

interface IOrder {
  id: number;
  name: string;
  status: string;
}

interface IUser {
id: number;
name: string;
email: string;
}

interface IOrderState {
orders: IOrder[],
users: IUser[],
}

export default class WorkorderDetails extends Component<any, IOrderState> {
    public state: IOrderState = {
        orders: [],
        users: [],
    };

    componentDidMount() {
        console.log("componentDidMount");
        console.log("getOrder");
        const {match} = this.props;
        const {params} = match;
        const orderId = parseInt(params.orderId);

        console.log(orderId);
        this.getOrder(orderId);
        this.getAssignedUsers(orderId);
    }

    private getOrder = async (orderId: number) => {
        console.log("getOrder");
        console.log(orderId);

        if (orderId <= 0) {
          return
        }
        console.log("orderId = ", orderId);
        const api = "/api/order/" + orderId.toString();
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
        console.log(jsonResponse.orders);
        this.setState({ orders: jsonResponse.orders });
    };

    private getAssignedUsers= async (orderId: number) => {
        console.log("getAssignedUsers");
        console.log(orderId);
        //const {orderId} = this.state;
        if (orderId <= 0) {
          return
        }
        const response = await fetch("/api/getassignedusers", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: orderId}),
        });
        console.log(response.status)
        const jsonResponse = await response.json();
        console.log(jsonResponse)
        this.setState({ users: jsonResponse.users });
    };

    // need to update status first, and then fetch the updated data from database derver 
    private toggleHandler (orderId:number, status: string) {
         this.updateOrderStatus (orderId, status); // update database
         this.getOrder(orderId); // fetch the updated order data 
    } 

    private updateOrderStatus = async (orderId:number, status: string) => {
        console.log("tiggleOrder");
        if (orderId <= 0) {
          return
        }
        const newStatus = status==="CLOSED"? "OPEN" : "CLOSED";
        const response = await fetch("/api/toggleorder", {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: orderId, status: newStatus}),
        });
        console.log(response.status)
    };

    render() {
      const {orders, users} = this.state;
      const id = orders.length>0 ? orders[0].id : 0;
      const name = orders.length>0 ? orders[0].name : "";
      const status = orders.length>0 ? orders[0].status : "";

      const label = status==="OPEN"? "click to close this workorder": "click to reopen this workorder";
      const buttonLabel = status==="OPEN"? "close": "reopen";
      const isOpen = status==="OPEN";
      
      console.log(users);

      return (
           <div>
             <div><h3>Workorder Details</h3></div>
             <div className = "margintop">
             <ul className="orderlist">
                <li>Order id: {id}</li>
                <li>Order name: {name}</li>
                <li>Order Status: {status}</li>
             </ul>
             </div>
             <div style={{marginTop:20, marginBottom:2, fontSize: 18, fontWeight:"bold"}}>
                  {label}
             </div>
             <div>
                  <button type="button" className={isOpen? "buttonred":"buttongreen"}
                      onClick={() => this.toggleHandler(id, status)}>
                      {buttonLabel}
                  </button>
             </div>

             <div className="margintop"><h4>assigned to : </h4></div>
             <div className = "margintop">
                <ul className="orderlist">
                   {users.map(user => (
                       <li key={user.id} className="tooltip">
                            {user.name} 
                            <span className="tooltiptext">{user.email}</span>
                       </li>))}
                </ul>
             </div>
             <div className="margintop">
                  going workorders ? <Link to="/workorders">workorders</Link>
             </div>
          </div> 
      );
    }
}



