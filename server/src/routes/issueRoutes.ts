import { Router } from "express";
import {
  createIssue,
  getIssues,
  updateIssue,
} from "../controllers/issueController.js";

const router = Router();

router.get("/", getIssues);
router.post("/", createIssue);
router.patch("/:id", updateIssue);

export default router;