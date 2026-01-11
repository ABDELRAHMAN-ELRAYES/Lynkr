import { Router } from "express";
import {
    createProfile,
    getProfileByUserId,
    getAllProfiles,
    updateProfile,
    deleteProfile,
} from "./profile.controller";
import { protect } from "../auth/auth.controller";

const ProfileRouter = Router();

ProfileRouter.route("/")
    .post(protect, createProfile)
    .get(getAllProfiles);

ProfileRouter.route("/user/:userId")
    .get(getProfileByUserId);

ProfileRouter.route("/:id")
    .put(protect, updateProfile)
    .delete(protect, deleteProfile);

export default ProfileRouter;
