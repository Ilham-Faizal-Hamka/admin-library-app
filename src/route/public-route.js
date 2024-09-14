import express from "express";
import bookController from "../controllers/book-controller";
import memberController from "../controllers/member-controller";

const publicRouter = new express.Router();

// books route
publicRouter.post("/books", bookController.register);
publicRouter.get("/books", bookController.list);
publicRouter.get("/books/:code", bookController.get);
publicRouter.put("/books/:code", bookController.update);

//member routes
publicRouter.post("/members", memberController.regisgter);
publicRouter.get("/members", memberController.list);
publicRouter.post("/members/:memberCode/borrow/:bookCode", memberController.borrowBook);
publicRouter.delete("/members/:memberCode/return/:bookCode", memberController.returnBook);


export {
    publicRouter
};