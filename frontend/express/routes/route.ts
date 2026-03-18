import express from 'express';

import {create, deleteStaff,getAllStaffs, getStaffById} from "../controller/handler";

export const route = express.Router();

// ROUTE: /AUTH
route.post("/auth/google", create);
route.post("/auth/metamask", create);
route.post("/auth/logout");
route.get("/auth/me");

// ROUTE: /STAFF
route.get("/staff");
route.get("/staff/:id");
route.post("/staff");
// route.get("/staff/:id");
route.delete("/staff/:id");

