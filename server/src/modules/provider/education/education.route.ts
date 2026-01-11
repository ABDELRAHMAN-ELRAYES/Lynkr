import { Router } from "express";
import {
    createEducation,
    getEducation,
    getEducationsByProfile,
    updateEducation,
    deleteEducation,
} from "./education.controller";
import { protect } from "../../auth/auth.controller";

const EducationRouter = Router();

EducationRouter.post("/", protect, createEducation);
EducationRouter.get("/profile/:profileId", protect, getEducationsByProfile);
EducationRouter.get("/:id", protect, getEducation);
EducationRouter.put("/:id", protect, updateEducation);
EducationRouter.delete("/:id", protect, deleteEducation);

export default EducationRouter;
