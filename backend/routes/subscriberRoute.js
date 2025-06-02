import express from "express";
import { addSubscriber,getAllSubscribers } from "../controllers/subscriberController.js";

const SubscriberRoute = express.Router();

SubscriberRoute.post("/addsubscribe", addSubscriber);
SubscriberRoute.get("/getallsubscriber", getAllSubscribers);

export default SubscriberRoute;
