import { Router } from "express";
import express from "express";
import {   addReview,
    getReviews} from "../controllers/reviewController.js";
import authUser from "../middleware/auth.js";

const reviewRouter = express.Router();


//Review Routes
reviewRouter.post("/add", authUser, addReview); // Add a review
reviewRouter.get("/get/:productId",  getReviews); // Get reviews for a product


export default reviewRouter;
