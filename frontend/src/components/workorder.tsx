import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./workorder.css";

interface IOrder {
    id: number;
    name: string;
    status: string;
}

export default class Workorder extends Component<IOrder, any> {
  render() {
    const {id, name, status} = this.props;
    const path = "/workorder/" + id;
    return (
      <div id="wrapper">
           <div id="c1">{id}</div>
           <div id="c2">{name}</div>
           <div id="c3">{status}</div>
           <div id="c4"><Link to={path}>details</Link></div>
      </div> 

    );
  }
}



