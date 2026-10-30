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
export const updateIssue = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;

    const updates: {
      title?: string;
      description?: string;
      status?: "open" | "in-progress" | "closed";
      priority?: "low" | "medium" | "high";
    } = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        res.status(400).json({
          success: false,
          message: "Title cannot be empty",
        });
        return;
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string" || !description.trim()) {
        res.status(400).json({
          success: false,
          message: "Description cannot be empty",
        });
        return;
      }
      updates.description = description.trim();
    }

    if (status !== undefined) {
      if (!["open", "in-progress", "closed"].includes(status)) {
        res.status(400).json({
          success: false,
          message: "Invalid status",
        });
        return;
      }
      updates.status = status;
    }

    if (priority !== undefined) {
      if (!["low", "medium", "high"].includes(priority)) {
        res.status(400).json({
          success: false,
          message: "Invalid priority",
        });
        return;
      }
      updates.priority = priority;
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({
        success: false,
        message: "Please provide at least one field to update",
      });
      return;
    }

    const updatedIssue = await Issue.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedIssue) {
      res.status(404).json({
        success: false,
        message: "Issue not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: updatedIssue,
      message: "Issue updated successfully",
    });
  } catch (error) {
    console.error("Error updating issue:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      error.name === "CastError"
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid issue ID",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to update issue",
    });
  }
};
