import { Router } from "express";
import {
    createService,
    getAllServices,
    getService,
    updateService,
    deleteService,
} from "./service.controller";
import { protect } from "../../middlewares/auth.middleware";

const ServiceRouter = Router();

ServiceRouter.route("/")
    .post(protect, createService)
    .get(getAllServices);

ServiceRouter.route("/:id")
    .get(getService)
    .put(protect, updateService)
    .delete(protect, deleteService);

export default ServiceRouter;
