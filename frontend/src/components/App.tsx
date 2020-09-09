import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./home";
import Workorders from "./workorders"
import WorkorderDetails from "./workorderDetails"
import WorkorderGenerator from "./workorderGenerator"
import Users from "./users"
import "./App.css";


export default class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <React.Fragment>
            <div className="app">
              <div className="app-body">
                <Route exact path="/" component={Home} />
                <Route exact path="/workorders" component={Workorders} />
                <Route exact path="/workorders/new" component={WorkorderGenerator} />
                <Route path='/workorder/:orderId' render={(matchProps) =><WorkorderDetails {...matchProps}/>}/>
                <Route path="/productivity" component={Users} />
              </div>
            </div>
            </React.Fragment>
        </Switch>
      </Router>
    );
  }
}
