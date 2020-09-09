import React, { Component} from "react";
import { Link } from "react-router-dom";

export default class Home extends Component {
    render() {
       return (
           <div>
                <h2>Node.js Sqlite React  </h2>
                <p style={{marginTop: 40}}>
                    managing workorders : <Link to="/workorders">Workorders</Link>
                </p>
                <p style={{marginTop: 20}}>
                    managing users and productivity : <Link to="/productivity">Productivity</Link>
                </p>
            </div>
       );
    }
}
