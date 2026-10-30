
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  fetchIssues,
  createIssue as createIssueAPI,
  updateIssue as updateIssueAPI,
} from "./services/issueService";

import type { Issue, IssueStatus, IssuePriority } from "./types/issue";

import "./App.css";

// Status label
function getStatusLabel(status: IssueStatus): string {
  switch (status) {
    case "open":
      return "Open";
    case "in-progress":
      return "In Progress";
    case "closed":
      return "Closed";
  }
}

// Priority label
function getPriorityLabel(priority: IssuePriority): string {
  switch (priority) {
    case "low":
      return "Low";
    case "medium":
      return "Medium";
    case "high":
      return "High";
  }
}

// Issue card component
function IssueCard({
  issue,
  onEdit,
}: {
  issue: Issue;
  onEdit: (issue: Issue) => void;
}) {
  return (
    <article className="issue-card">
      <div className="issue-card-top">
        <span className={`status status-${issue.status}`}>
          {getStatusLabel(issue.status)}
        </span>

        <span className={`priority priority-${issue.priority}`}>
          {getPriorityLabel(issue.priority)} Priority
        </span>
      </div>

      <h3>{issue.title}</h3>

      <p className="issue-description">{issue.description}</p>

      <div className="issue-card-footer">
        <span>Issue #{issue.id}</span>

        <span>
          {issue.createdAt.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      <button
        type="button"
        className="cancel-button"
        onClick={() => onEdit(issue)}
      >
        Edit Issue
      </button>
    </article>
  );
}

// Main App component
function App() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Edit issue states
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Fetch issues from MongoDB
  useEffect(() => {
    const loadIssues = async (): Promise<void> => {
      try {
        setIsLoading(true);

        const data = await fetchIssues();

        setIssues(data);
        setError(null);
      } catch (err) {
        console.error("Error loading issues:", err);
        setError("Failed to load issues. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadIssues();
  }, []);

  // Create a new issue
  const handleCreateIssue = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    const priority = formData.get("priority");
    const status = formData.get("status");

    if (
      !title ||
      !description ||
      (priority !== "low" && priority !== "medium" && priority !== "high") ||
      (status !== "open" && status !== "in-progress" && status !== "closed")
    ) {
      setFormError("Please provide valid issue details.");
      return;
    }

    try {
      setIsCreating(true);
      setFormError(null);

      const newIssue = await createIssueAPI({
        title,
        description,
        priority,
        status,
      });

      setIssues((currentIssues) => [newIssue, ...currentIssues]);

      setIsFormOpen(false);
      form.reset();
    } catch (err) {
      console.error("Error creating issue:", err);
      setFormError("Failed to create issue. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  // Open the edit form
  const handleEditClick = (issue: Issue): void => {
    setEditingIssue(issue);
    setEditError(null);
    setIsFormOpen(false);
  };

  // Update an existing issue
  const handleUpdateIssue = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (!editingIssue) return;

    const formData = new FormData(event.currentTarget);

    const title = String(formData.get("editTitle") ?? "").trim();
    const description = String(
      formData.get("editDescription") ?? "",
    ).trim();

    const priority = formData.get("editPriority");
    const status = formData.get("editStatus");

    if (
      !title ||
      !description ||
      (priority !== "low" && priority !== "medium" && priority !== "high") ||
      (status !== "open" && status !== "in-progress" && status !== "closed")
    ) {
      setEditError("Please provide valid issue details.");
      return;
    }

    try {
      setIsUpdating(true);
      setEditError(null);

      const updatedIssue = await updateIssueAPI(editingIssue.id, {
        title,
        description,
        priority,
        status,
      });

      setIssues((currentIssues) =>
        currentIssues.map((issue) =>
          issue.id === updatedIssue.id ? updatedIssue : issue,
        ),
      );

      setEditingIssue(null);
    } catch (err) {
      console.error("Error updating issue:", err);
      setEditError("Failed to update issue. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Dashboard statistics
  const totalIssues = issues.length;

  const openIssues = issues.filter(
    (issue) => issue.status === "open",
  ).length;

  const inProgressIssues = issues.filter(
    (issue) => issue.status === "in-progress",
  ).length;

  const closedIssues = issues.filter(
    (issue) => issue.status === "closed",
  ).length;

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">D</div>
          <span>DevTrack</span>
        </div>

        <nav className="navigation">
          <p className="nav-heading">WORKSPACE</p>

          <a href="#dashboard" className="nav-link active">
            <span>▦</span> Dashboard
          </a>

          <a href="#issues" className="nav-link">
            <span>☷</span> All Issues
          </a>

          <a href="#open-issues" className="nav-link">
            <span>◷</span> My Issues
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="avatar">DA</div>

          <div>
            <strong>Developer</strong>
            <p>DevTrack Workspace</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content" id="dashboard">
        {/* Create issue form */}
        {isFormOpen && (
          <section className="issue-form-section">
            <div className="section-heading">
              <div>
                <h2>Create a new issue</h2>
                <p>Describe the issue you want to track.</p>
              </div>

              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setIsFormOpen(false);
                  setFormError(null);
                }}
                disabled={isCreating}
              >
                Cancel
              </button>
            </div>

            <form className="issue-form" onSubmit={handleCreateIssue}>
              <label htmlFor="title">Issue title</label>

              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Fix login authentication"
                maxLength={120}
                required
              />

              <label htmlFor="description">Description</label>

              <textarea
                id="description"
                name="description"
                placeholder="Describe the issue..."
                rows={4}
                maxLength={2000}
                required
              />

              <div className="form-row">
                <div>
                  <label htmlFor="priority">Priority</label>

                  <select
                    id="priority"
                    name="priority"
                    defaultValue="medium"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="status">Status</label>

                  <select id="status" name="status" defaultValue="open">
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {formError && (
                <p className="error-message">{formError}</p>
              )}

              <button
                type="submit"
                className="create-button"
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create Issue"}
              </button>
            </form>
          </section>
        )}

        {/* Edit issue form */}
        {editingIssue && (
          <section className="issue-form-section">
            <div className="section-heading">
              <div>
                <h2>Edit Issue</h2>
                <p>Update the details of your issue.</p>
              </div>

              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setEditingIssue(null);
                  setEditError(null);
                }}
                disabled={isUpdating}
              >
                Cancel
              </button>
            </div>

            <form className="issue-form" onSubmit={handleUpdateIssue}>
              <label htmlFor="editTitle">Issue title</label>

              <input
                id="editTitle"
                name="editTitle"
                type="text"
                defaultValue={editingIssue.title}
                maxLength={120}
                required
              />

              <label htmlFor="editDescription">Description</label>

              <textarea
                id="editDescription"
                name="editDescription"
                defaultValue={editingIssue.description}
                rows={4}
                maxLength={2000}
                required
              />

              <div className="form-row">
                <div>
                  <label htmlFor="editPriority">Priority</label>

                  <select
                    id="editPriority"
                    name="editPriority"
                    defaultValue={editingIssue.priority}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="editStatus">Status</label>

                  <select
                    id="editStatus"
                    name="editStatus"
                    defaultValue={editingIssue.status}
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {editError && (
                <p className="error-message">{editError}</p>
              )}

              <button
                type="submit"
                className="create-button"
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </section>
        )}

        {/* Topbar */}
        <header className="topbar">
          <div>
            <p className="breadcrumb">Workspace / Overview</p>
            <h1>Dashboard</h1>
          </div>

          <button
            className="create-button"
            onClick={() => {
              setEditingIssue(null);
              setEditError(null);
              setFormError(null);
              setIsFormOpen(true);
            }}
          >
            + Create Issue
          </button>
        </header>

        {/* Welcome section */}
        <section className="welcome-section">
          <div>
            <h2>Good to see you, Developer 👋</h2>
            <p>Here's what's happening with your issues today.</p>
          </div>

          <span className="date-badge">
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </section>

        {/* Statistics */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-heading">
              <span>Total Issues</span>
              <span className="stat-icon purple">▤</span>
            </div>

            <strong>{totalIssues}</strong>
            <p>All tracked issues</p>
          </div>

          <div className="stat-card">
            <div className="stat-heading">
              <span>Open Issues</span>
              <span className="stat-icon orange">◷</span>
            </div>

            <strong>{openIssues}</strong>
            <p>Waiting to be resolved</p>
          </div>

          <div className="stat-card">
            <div className="stat-heading">
              <span>In Progress</span>
              <span className="stat-icon blue">↻</span>
            </div>

            <strong>{inProgressIssues}</strong>
            <p>Currently being worked on</p>
          </div>

          <div className="stat-card">
            <div className="stat-heading">
              <span>Closed Issues</span>
              <span className="stat-icon green">✓</span>
            </div>

            <strong>{closedIssues}</strong>
            <p>Successfully completed</p>
          </div>
        </section>

        {/* Issues section */}
        <section className="issues-section" id="issues">
          <div className="section-heading">
            <div>
              <h2>Recent Issues</h2>
              <p>Track and manage your development tasks.</p>
            </div>

            <span className="issue-count">{totalIssues} issues</span>
          </div>

          <div className="issues-list">
            {isLoading ? (
              <p>Loading issues...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : issues.length === 0 ? (
              <p>No issues found. Create your first issue!</p>
            ) : (
              issues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onEdit={handleEditClick}
                />
              ))
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          Built with React, TypeScript, and a little developer magic.
        </footer>
      </main>
    </div>
  );
}

export default App;

