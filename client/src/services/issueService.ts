import type { Issue, IssueStatus, IssuePriority } from "../types/issue";

const API_URL = "http://localhost:5000/api/issues";

// Backend issue response type
interface BackendIssue {
  _id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  createdAt: string;
}

// API response type
interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
  message?: string;
}

// Convert MongoDB issue into frontend Issue
const formatIssue = (issue: BackendIssue): Issue => {
  return {
    id: issue._id,
    title: issue.title,
    description: issue.description,
    status: issue.status,
    priority: issue.priority,
    createdAt: new Date(issue.createdAt),
  };
};

// GET all issues
export const fetchIssues = async (): Promise<Issue[]> => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch issues");
  }

  const result: ApiResponse<BackendIssue[]> = await response.json();

  return result.data.map(formatIssue);
};

// POST a new issue
export const createIssue = async (issueData: {
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
}): Promise<Issue> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(issueData),
  });

  if (!response.ok) {
    throw new Error("Failed to create issue");
  }

  const result: ApiResponse<BackendIssue> = await response.json();

  return formatIssue(result.data);
};

export const updateIssue = async (
  id: string,
  issueData: {
    title?: string;
    description?: string;
    status?: IssueStatus;
    priority?: IssuePriority;
  },
): Promise<Issue> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(issueData),
  });

  if (!response.ok) {
    throw new Error("Failed to update issue");
  }

  const result: ApiResponse<BackendIssue> = await response.json();

  return formatIssue(result.data);
};
