import {sql, insert} from "./db";

interface RestRequest { 
    oprign: string, 
    proxy: string,
    method: String,
    endpoint: string, 
    status: number,
    restTime: () => string 
 };

exports.getUser = async (req, res) => {
    console.log ("endpoint: GET getUser");  
    let status = 200;
    let error = {};
    let resp: any = [];
    console.log(req.params.id);  
    const id: number  = Number (req.params.id);
    console.log("userId = ", id);
     
    try {
         resp  = await sql("SELECT * FROM users WHERE id = ?", id);
         console.log("db return : ", resp)
         if (!!resp && !!resp.error && resp.error === true) {
             status = 400;
             let error = {errno: resp.errno, error_code: resp.code};
         }
    } catch (err) {
         console.log("error : ", err);
         status = 400;
         error = {errno: err.errno, error_code: err.code};
    }
    const incomingReq: RestRequest = {
        origin: req.headers.referer,
        proxy: req.headers.origin,
        method: req.method,
        endpoint: req.url,
        status: status,
        restTime: Date()
    } 
    console.log(incomingReq);   

    if (status === 200) {
         const users = resp;
         return res.status(200).json({users});
    } else {
       return res.status(400).json({ error });
    }
};

exports.getUsers = async (req, res) => {
    console.log ("endpoint: GET getUsers");  
    let status = 200;
    let error = {};
    let resp: any = [];
      
    try {
        resp = await sql("SELECT * FROM users");
        console.log("db return : ", resp)
         if (!!resp && !!resp.error && resp.error === true) {
             status = 400;
             error = {errno: resp.errno, error_code: resp.code};
         }
     } catch (err) {
        console.log("error : ", err);
        status = 400;
        error = {errno: err.errno, error_code: err.code};
     }
    
    const incomingReq: RestRequest = {
        origin: req.headers.referer,
        proxy: req.headers.host,
        method: req.method,
        endpoint: req.url,
        status: status,
        restTime: Date()
    } 
    console.log(incomingReq);   

    if (status === 200) {
        const users = resp;
        console.log(users);
        return res.status(200).json({users});
   } else {
        return res.status(400).json({ error });
   }
}

exports.getOrder = async (req, res) => {
    console.log ("endpoint: GET getOrder"); 
    let status = 200;
    let error = {};
    let resp: any = [];
    console.log(req.params.id);  
    const id: number  = Number (req.params.id);
    console.log("orderId = ", id); 
        
    try {
        resp = await sql("SELECT * FROM work_orders  WHERE id = ?",id);
        console.log("db return : ", resp)
         if (!!resp && !!resp.error && resp.error === true) {
             status = 400;
             error = {errno: resp.errno, error_code: resp.code};
         }
    } catch (err) {
        console.log("error : ", err);
        status = 400;
        error = {errno: err.errno, error_code: err.code};
     }
    
    const incomingReq: RestRequest = {
        origin: req.headers.referer,
        proxy: req.headers.origin,
        method: req.method,
        endpoint: req.url,
        status: status,
        restTime: Date()
    } 
    console.log(incomingReq);   

    if (status === 200) {
        const orders = resp;
        console.log(orders);
        return res.status(200).json({orders});
    } else {
        return res.status(400).json({ error });
    }
};
    
exports.getOrders = async (req, res) => {
    console.log ("endpoint: GET getOrders");  
    let status = 200;
    let error = {};
    let resp: any = [];
        
    try {
        resp = await sql("SELECT * FROM work_orders ORDER BY status DESC");
        console.log ("db returns = ", resp);
         if (!!resp && !!resp.error && resp.error === true) {
             status = 400;
             error = {errno: resp.errno, error_code: resp.code};
         }
    } catch (err) {
        console.log("error : ", err);
        status = 400;
        error = {errno: err.errno, error_code: err.code};
     }
    
    const incomingReq: RestRequest = {
        origin: req.headers.referer,
        proxy: req.headers.host,
        method: req.method,
        endpoint: req.url,
        status: status,
        restTime: Date()
    } 
    console.log(incomingReq); 
    
    if (status === 200) {
        const orders = resp;
        console.log(orders);
        return res.status(200).json({orders});
    } else {
        return res.status(400).json({ error });
    }
}

//find assigned users of a given order id
exports.getAssignedUsers = async (req, res) => {
    console.log ("endpoint: POST getAssignedUsers");    
    const orderId = Number(req.body.id) || 0;
    let status = 200;
    let error = {};
    let resp: any = [];
    const query: string = "SELECT u.id, u.name, u.email FROM work_order_assignees woa INNER JOIN users u ON u.id = woa.user_id WHERE woa.work_order_id = ?";

    try {
        resp = await sql(query, orderId);
        console.log ("db returns = ", resp);
        if (!!resp && !!resp.error && resp.error === true) {
            status = 400;
            error = {errno: resp.errno, error_code: resp.code};
        }
    } catch (err) {
        console.log("error : ", err);
        status = 400;
        error = {errno: err.errno, error_code: err.code};
    }
    
    const incomingReq: RestRequest = {
        origin: req.headers.referer,
        proxy: req.headers.host,
        method: req.method,
        endpoint: req.url,
        status: status,
        restTime: Date()
    } 
    console.log(incomingReq);   

    if (status === 200) {
        const users = resp;
        console.log(users);
        return res.status(200).json({users});
    } else {
        return res.status(400).json({ error });
    }
}

// find all workorders not assigned to any users
exports.getNotAssignedOrders = async (req, res) => {
    console.log ("endpoint: GET getNotAssignedOrders");  
    let status = 200;
    let error = {};
    let resp: any = [];
        
    const query: string = "SELECT id, name, status FROM work_orders wo where wo.id NOT IN (select work_order_id from work_order_assignees)";
    try {
        resp = await sql(query);
        console.log ("db returns = ", resp);
        if (!!resp && !!resp.error && resp.error === true) {
            status = 400;
            error = {errno: resp.errno, error_code: resp.code};
        }
    } catch(err) {
        console.log("error : ", err);
        status = 400;
        error = {errno: err.errno, error_code: err.code};
    }
    
    const incomingReq: RestRequest = {
        origin: req.headers.referer,
        proxy: req.headers.host,
        method: req.method,
        endpoint: req.url,
        status: status,
        restTime: Date()
    } 
    console.log(incomingReq);   
    if (status === 200) {
        const orders = resp;
        console.log(orders);
        return res.status(200).json({orders});
    } else {
        return res.status(400).json({ error });
    }
}

//find assigned workorders of a given user id
exports.getAssignedOrders = async (req, res) => {
    console.log ("endpoint: POST getAssignedOrders");  
    let status = 200;
    let error = {};
    let resp: any = [];
      
    const userId = Number(req.body.id) || 0;
    const query: string = "SELECT wo.id, wo.name, wo.status FROM work_order_assignees woa INNER JOIN work_orders wo ON wo.id = woa.work_order_id WHERE woa.user_id = ?";

    try {
        resp = await sql(query, userId);
        console.log ("db returns = ", resp);
        if (!!resp && !!resp.error && resp.error === true) {
            status = 400;
            error = {errno: resp.errno, error_code: resp.code};
        }
    } catch(err) {
        console.log("error : ", err);
        status = 400;
        error = {errno: err.errno, error_code: err.code};
    }

    const incomingReq: RestRequest = {
        origin: req.headers.referer,
        proxy: req.headers.host,
        method: req.method,
        endpoint: req.url,
        status: status,
        restTime: Date()
    } 
    console.log(incomingReq);   
    
    if (status === 200) {
        const orders = resp;
        console.log(orders);
        return res.status(200).json({orders});
    } else {
        return res.status(400).json({ error });
    }
}

// find all users not assigned to any open workorders
exports.getNotAssignedUsers = async (req, res) => {
    console.log ("endpoint: GET getNotAssignedUsers");  

    let status = 200;
    let error = {};
    let resp: any = [];
      
    const query: string = "SELECT u.id, u.name, u.email FROM users u where u.id NOT IN (select woa.user_id from work_order_assignees woa INNER JOIN work_orders wo ON wo.id = woa.work_order_id WHERE wo.status = 'OPEN' )";  
    try {
        resp = await sql(query);
        console.log ("db returns = ", resp);
        if (!!resp && !!resp.error && resp.error === true) {
            status = 400;
            error = {errno: resp.errno, error_code: resp.code};
        }
    } catch(err) {
        console.log("error : ", err);
        status = 400;
        error = {errno: err.errno, error_code: err.code};
    }

    const incomingReq: RestRequest = {
        origin: req.headers.referer,
        proxy: req.headers.host,
        method: req.method,
        endpoint: req.url,
        status: status,
        restTime: Date()
    } 
    console.log(incomingReq);  
    
    if (status === 200) {
        const users = resp;
        console.log(users);
        return res.status(200).json({users});
    } else {
        return res.status(400).json({ error });
    }
}

exports.toggleOrder = async (req, res) => {
    console.log ("endpoint: PUT toggleOrder");  
    const orderID: number  = Number(req.body.id);
    const newStatus: string  = req.body.status;
    console.log ("orderID = ", orderID);
    console.log ("newStatus = ", newStatus);

    let status = 200;
    let error = {};
    let resp: any = [];

    try {
        resp= await sql ("UPDATE work_orders SET status = ? WHERE id = ?", newStatus, orderID);
        console.log("db return :", resp);
        if (!!resp && !!resp.error && resp.error === true) {
            status = 400;
            error = {errno: resp.errno, error_code: resp.code};
        }
    } catch(err) {
        console.log("error : ", err);
        status = 400;
        error = {errno: err.errno, error_code: err.code};
    }

    const incomingReq: RestRequest = {
        origin: req.headers.referer,
        proxy: req.headers.origin,
        method: req.method,
        endpoint: req.url,
        status: 200,
        restTime: Date()
    } 
    console.log(incomingReq);   
    
    if (status === 200) {
        const orders = resp;
        console.log(orders);
        return res.status(200).json({orders});
    } else {
        return res.status(400).json({ error });
    }
};

// create new workorder and its relationship with assigned used 
exports.createNewWorkorder = async (req, res) => {
    console.log ("endpoint: POST createNewWorkorder");  

    let status = 200;
    let error = {};
    let resp: any = [];
      
    const orderName = req.body.orderName;
    console.log(orderName);
    const orderId = Number (req.body.orderId);
    console.log(orderId);

    const assignedUsers = req.body.assignedUsers;
    console.log("assigned users : ");
    console.log(assignedUsers);
    
    // insert new order to table work_orders
    const orderQuery: string = "INSERT INTO work_orders (id, name,status) VALUES (?, ?, ?)";
    console.log("create new order sql");
    console.log(orderQuery);
    //const response = await insert(orderQuery, orderId, orderName, "OPEN");

    try {
        resp= await insert(orderQuery, orderId, orderName, "OPEN");
        console.log("db return :", resp);
        if (!!resp && !!resp.error && resp.error === true) {
            status = 400;
            error = {errno: resp.errno, error_code: resp.code};
        }
    } catch(err) {
        console.log("error : ", err);
        status = 400;
        error = {errno: err.errno, error_code: err.code};
    }

    if (status === 400) {
        console.log("forwarding error to frontend");
        return res.status(400).json({ error });
    }

    // format sql string for assignment relationship
    let assign = [];
    let assignFlat =[];
    for (var i=0; i < assignedUsers.length; i++){
         assign.push ([orderId, Number(assignedUsers[i].id)]);
         assignFlat.push(orderId);
         assignFlat.push(Number(assignedUsers[i].id));
    }
    console.log("assign length = ", assign.length);
    console.log(assign);
    console.log("assignFlat length =", assignFlat.length);
    console.log(assignFlat);
    // to create a string "(?,?),(?,?),(?,?)  ..... "
    let placeholders = assign.map((a) => '(?,?)').join(',');
    console.log(placeholders );
    let sqlq = 'INSERT INTO work_order_assignees (work_order_id, user_id) VALUES ' + placeholders;
    console.log(sqlq);
    
    try {
        resp = await insert (sqlq, assignFlat);
        console.log("db return :", resp);
        if (!!resp && !!resp.error && resp.error === true) {
            status = 400;
            error = {errno: resp.errno, error_code: resp.code};
        }
    } catch(err) {
        console.log("error : ", err);
        status = 400;
        error = {errno: err.errno, error_code: err.code};
    }

    const RestRequest = {
        origin: req.headers.referer,
        proxy: req.headers.origin,
        method: req.method,
        endpoint: req.url,
        status: 200,
        restTime: Date()
    } 
    console.log(RestRequest );   
    
    if (status === 200) {
        const orders = resp;
        console.log(orders);
        return res.status(200).json({orders});
    } else {
        return res.status(400).json({ error });
    }
}
