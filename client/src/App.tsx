import { useState } from "react";
import type {
  Issue,
  IssueStatus,
  IssuePriority,
} from "./types/issue";
import "./App.css";
import { issues  as initialIssues } from "./date/issue";

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

function IssueCard({ issue }: { issue: Issue }) {
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
    </article>
  );
}

function App() {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
const [isFormOpen, setIsFormOpen] = useState(false);
function handleCreateIssue(
  event: React.FormEvent<HTMLFormElement>,
) {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);

  const title = String(formData.get("title") ?? "").trim();
  const description = String(
    formData.get("description") ?? "",
  ).trim();

  const priority = formData.get("priority");
  const status = formData.get("status");

  if (
    !title ||
    !description ||
    (priority !== "low" &&
      priority !== "medium" &&
      priority !== "high") ||
    (status !== "open" &&
      status !== "in-progress" &&
      status !== "closed")
  ) {
    return;
  }

  const newIssue: Issue = {
    id: crypto.randomUUID(),
    title,
    description,
    priority,
    status,
    createdAt: new Date(),
  };

  setIssues((currentIssues) => [
    newIssue,
    ...currentIssues,
  ]);

  setIsFormOpen(false);
  form.reset();
}
  const totalIssues = issues.length;

  const openIssues = issues.filter((issue) => issue.status === "open").length;

  const inProgressIssues = issues.filter(
    (issue) => issue.status === "in-progress",
  ).length;

  const closedIssues = issues.filter(
    (issue) => issue.status === "closed",
  ).length;

  return (
    <div className="app">
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

      <main className="main-content" id="dashboard">
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
        onClick={() => setIsFormOpen(false)}
      >
        Cancel
      </button>
    </div>

    <form
      className="issue-form"
      onSubmit={handleCreateIssue}
    >
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
          <select
            id="status"
            name="status"
            defaultValue="open"
          >
            <option value="open">Open</option>
            <option value="in-progress">
              In Progress
            </option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <button type="submit" className="create-button">
        Create Issue
      </button>
    </form>
  </section>
)}
        <header className="topbar">
          <div>
            <p className="breadcrumb">Workspace / Overview</p>
            <h1>Dashboard</h1>
          </div>

       <button
  className="create-button"
  onClick={() => setIsFormOpen(true)}
>
  + Create Issue
</button>
        </header>

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

        <section className="issues-section" id="issues">
          <div className="section-heading">
            <div>
              <h2>Recent Issues</h2>
              <p>Track and manage your development tasks.</p>
            </div>

            <span className="issue-count">{totalIssues} issues</span>
          </div>

          <div className="issues-list">
            {issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </section>

        <footer className="footer">
          Built with React, TypeScript, and a little developer magic.
        </footer>
      </main>
    </div>
  );
}

export default App;
