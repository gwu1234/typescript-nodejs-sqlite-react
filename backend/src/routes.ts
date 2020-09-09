const express = require("express");

const {
    getUsers,
    getUser,
    getOrders,
    getOrder,
    getAssignedUsers,
    getNotAssignedOrders,
    getAssignedOrders,
    getNotAssignedUsers,
    toggleOrder,
    createNewWorkorder
} = require("./controllers");

const router = express.Router();
router.get("/users", getUsers); // find all users
router.get("/user/:id", getUser); // find one user of given id
router.get("/orders", getOrders); // find all orders, OPEN first
router.get("/order/:id", getOrder); //find an order og given order id
router.post("/getassignedusers", getAssignedUsers); //find assigned users of a given order id
router.get("/getnotassignedorders", getNotAssignedOrders); //find all workorders not assigned to any users
router.post("/getassignedorders", getAssignedOrders); //find all work orders assigned a given user id
router.get("/getnotassignedusers", getNotAssignedUsers); //find all users without any open workorders assigned
router.put("/toggleorder", toggleOrder); //toggle order status
router.post("/createnewworkorder", createNewWorkorder); //create a new workorder, and its relationship with assigned users

module.exports = router;