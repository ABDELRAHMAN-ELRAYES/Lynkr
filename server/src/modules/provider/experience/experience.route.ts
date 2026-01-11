import { Router } from "express";
import {
    createExperience,
    getExperience,
    getExperiencesByProfile,
    updateExperience,
    deleteExperience,
} from "./experience.controller";
import { protect } from "../../auth/auth.controller";

const ExperienceRouter = Router();

// Protected routes - Providers can manage their experiences
ExperienceRouter.post("/", protect, createExperience);
ExperienceRouter.get("/profile/:profileId", protect, getExperiencesByProfile);
ExperienceRouter.get("/:id", protect, getExperience);
ExperienceRouter.put("/:id", protect, updateExperience);
ExperienceRouter.delete("/:id", protect, deleteExperience);

export default ExperienceRouter;
