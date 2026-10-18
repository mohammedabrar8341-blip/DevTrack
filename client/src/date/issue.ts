import type { Issue } from "../types/issue";

export const issues: Issue[] = [
{
id: "1",
title: "Login button is not working",
description: "The login button does not respond when clicked.",
status: "open",
priority: "high",
createdAt: new Date("2026-10-15"),
},
{
id: "2",
title: "Fix dashboard layout",
description: "The dashboard layout breaks on smaller screens.",
status: "in-progress",
priority: "medium",
createdAt: new Date("2026-10-16"),
},
{
id: "3",
title: "Update profile page",
description: "Add the ability to edit profile information.",
status: "closed",
priority: "low",
createdAt: new Date("2026-10-17"),
},
];
