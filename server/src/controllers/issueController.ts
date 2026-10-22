import type { Request, Response } from "express";
import Issue from "../models/Issue.js";

export const getIssues = async (
_req: Request,
res: Response,
): Promise<void> => {
try {
const issues = await Issue.find().sort({ createdAt: -1 });


res.status(200).json({
  success: true,
  count: issues.length,
  data: issues,
});


} catch (error) {
console.error("Error fetching issues:", error);

res.status(500).json({
  success: false,
  message: "Failed to fetch issues",
});


}
};

export const createIssue = async (
req: Request,
res: Response,
): Promise<void> => {
try {
const { title, description, status, priority } = req.body;


if (
  typeof title !== "string" ||
  !title.trim() ||
  typeof description !== "string" ||
  !description.trim()
) {
  res.status(400).json({
    success: false,
    message: "Title and description are required",
  });
  return;
}

const issue = await Issue.create({
  title: title.trim(),
  description: description.trim(),
  ...(status !== undefined && { status }),
  ...(priority !== undefined && { priority }),
});

res.status(201).json({
  success: true,
  data: issue,
});


} catch (error) {
console.error("Error creating issue:", error);

if (
  typeof error === "object" &&
  error !== null &&
  "name" in error &&
  error.name === "ValidationError"
) {
  res.status(400).json({
    success: false,
    message: "Invalid issue data. Check the status and priority values.",
  });
  return;
}

res.status(500).json({
  success: false,
  message: "Failed to create issue",
});


}
};
