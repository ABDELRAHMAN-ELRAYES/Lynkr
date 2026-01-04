import { Router } from "express";
import {
    createOperation,
    getAllOperations,
    getOperation,
    updateOperation,
    deleteOperation,
} from "./operation.controller";
import { protect } from "../../middlewares/auth.middleware";

const OperationRouter = Router();

OperationRouter.route("/")
    .post(protect, createOperation)
    .get(getAllOperations);

OperationRouter.route("/:id")
    .get(getOperation)
    .put(protect, updateOperation)
    .delete(protect, deleteOperation);

export default OperationRouter;
