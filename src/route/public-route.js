import express from "express";
import bookController from "../controllers/book-controller";

const publicRouter = new express.Router();

publicRouter.post("/books", bookController.registerBook);
publicRouter.put("/books/:code", bookController.update);


export {
    publicRouter
};