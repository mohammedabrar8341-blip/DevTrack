export type IssueStatus = "open" | "in-progress" | "closed";

export type IssuePriority = "low" | "medium" | "high";

export interface Issue {
id: string;
title: string;
description: string;
status: IssueStatus;
priority: IssuePriority;
createdAt: Date;
}
