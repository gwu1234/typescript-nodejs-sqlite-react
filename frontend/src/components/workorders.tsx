import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./workorders.css"
import Workorder from "./workorder"

interface IOrder {
    id: number;
    name: string;
    status: string;
}

interface IOrderState {
  orders: IOrder[],
}

export default class Workorders extends Component<any, IOrderState> {
  public state: IOrderState = {
      orders: [],
  };

  componentDidMount() {
     console.log("componentDidMount");
     this.getOrders();
  }

  private getOrders = async () => {
      const response = await fetch("/api/orders", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      console.log(response.status)
      const jsonResponse = await response.json();
      console.log(jsonResponse)
      this.setState({ orders: jsonResponse.orders });
  };

  render() {
    const { orders} = this.state;
    console.log(orders);

    return (
      <div id ="container">

          <h2> Workorders </h2>
        
          <div id = "order">
                {orders.length > 0 && orders.map(order => <Workorder key={order.id} {...order}/>)}
           </div>
           <div className="links">        
              <span>Create a new workorder? <Link to="/workorders/new">new workorder</Link> </span>
              <span>Going Home ? <Link to="/">Home</Link> </span>
              <span> going to users and productivity ? <Link to="/productivity">Productivity</Link> </span>               
        </div>
      </div>
    );
  }
}

