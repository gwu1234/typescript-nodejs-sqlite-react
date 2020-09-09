import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./workorderGenerator.css";

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

interface IOrderState {
    orderName: string, // new order name
    orderId: number,   // available id for new order
    allusers: IUser[],
    assignedUsers :IUser[],
    allOrders: IOrder[],

}


export default class WorkorderGenerator extends Component<any, IOrderState> {
  public state: IOrderState = {
    orderName: "",
    orderId: 0,
    allusers: [],
    assignedUsers:[],
    allOrders: [],
};

componentDidMount() {
    console.log("WorkorderGenerator");
    console.log("componentDidMount");
    
    this.getUsers();
    this.getOrders();
}

private getUsers = async () => {
    console.log("getUsers");  
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
    this.setState({ allusers: jsonResponse.users });
};

private getOrders = async () => {
  console.log("getOrders");  
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
  this.setState({ allOrders: jsonResponse.orders });
};

// need to find available and smallest orderID for new workorder 
// not the best solution. should fix the problem on database server 
// return lastID 
private findNewOrderId = () => {
    console.log("findNewOrderId");  
    const {allOrders} = this.state;
    console.log("order length = ", allOrders.length);
    
    let newId: number = 1;
    let matched: boolean = true;
    let i: number = 0;

    if (allOrders.length === 0) {
       this.setState({ orderId: 1});
       return 1;
    }
    
    while (matched) {
        //console.log("newId = ", newId);
        for (i = 0; i < allOrders.length; i++) {
            if (allOrders[i].id === newId) {
                  //console.log("matched");
                  newId ++;
                  matched = true;
                  break;
            }
            matched = false;
        }
    }

    //console.log("the orderId for new workorder is ", newId);
    this.setState({ orderId: newId});
    return newId;
};

private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const orderName = event.target.value;
    //console.log ("handleChange");
    //console.log(orderName);
    this.setState({orderName: orderName});
}

private handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    let user = JSON.parse(event.target.value); 
    //console.log ("handleSelectChange");
    //console.log(user);
    let {assignedUsers} = this.state;
    assignedUsers.push(user);
    this.setState({assignedUsers: assignedUsers});
  }

private handleSubmit = () => {
    console.log("WorkorderGenerator: handleSubmit");
    this.createNewWorkorder();
};

private handleCancel = () => {
    console.log("WorkorderGenerator: handleCancel");
    this.setState ({orderName: "", assignedUsers:[]});
};

private createNewWorkorder = async () => {
    console.log("createNewWorkorder");
    const {orderName, assignedUsers} = this.state;
    if (orderName.length === 0) {
       console.log("empty order name")
       return
    }
    const newOrderId = this.findNewOrderId();
    //const newOrderId = 2;
    if (newOrderId === 0) {
       console.log("zero order id, problem");
       return
    }
    const response = await fetch("/api/createnewworkorder", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId: newOrderId, orderName: orderName, assignedUsers: assignedUsers}),
    });
    console.log(response.status)
    this.setState({ assignedUsers: [], orderName: ""});
    this.getOrders(); // need to update order data from database 
  };



render() {
    const {allusers, assignedUsers, orderName} = this.state;

    // calculate all not assigned users to avoid duplicated assignments
    let notAssignedUsers = allusers.filter(ar => !assignedUsers.find(rm => (rm.id === ar.id) ));
    //console.log("notAssignedUsers");
    //console.log(notAssignedUsers);

    return (
        <div>
          <div style={{marginBottom: 30}} ><h3>Create a new workorder</h3></div>
          
          <p>please enter name and assign users to this new order</p>
          <div style={{marginTop: 5}}>             
                <form >
                    <div className ="ordername">
                    <label>
                          order name:
                          <input type="text" value={orderName} onChange={this.handleChange} />
                    </label>
                    </div>
                    <div className ="user">
                        <label>choose a user:</label>
                        <select name="user" className ="custom-select" onChange={this.handleSelectChange}>
                            {notAssignedUsers.map((user, index) => 
                                <option key={index} 
                                      value={JSON.stringify(user)}
                                      className = "options"
                                      > 
                                      {user.name}
                                </option>
                            )}
                        </select>
                    </div>

                    { (assignedUsers.length>0 || orderName.length>0) && <div className="neworder">
                            <p>new workorder</p>  
                            <span> order name : {orderName}</span>  
                            <div className = "assigneduser">
                                  <p>assigned users :</p>
                                  <ul>
                                      {assignedUsers.map(user => (
                                          <li key={user.id}>
                                            {user.name} 
                                        </li>))}
                                  </ul>
                            </div>
                            <div className="create">
                                <p>click CREATE to create this new workorder</p>
                                <button onClick={this.handleSubmit}>
                                        CREATE
                                </button>
                            </div>

                            <div className ="cancel">
                                <p>click CANCEL to cancel this new workorder</p>
                                <button onClick={this.handleCancel}>
                                        CANCEL 
                                </button>
                            </div>
                    </div>}
                    
                </form>            
          </div>
         
          <div style={{marginTop:50}}>
                going workorders ? <Link to="/workorders">workorders</Link>
          </div>

          <div style={{marginTop:20}}>
                going back to home ? <Link to="/">home</Link>
          </div>

        </div> 
    );
  }
}