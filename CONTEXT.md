# Task Management

A collaborative task management system where users create, share, and track units of work through a defined lifecycle.

## Language

### Core

**Task**:
A unit of work owned by a user, with a defined lifecycle and optional collaborators.
_Avoid_: Ticket, issue, item

**Owner**:
The user who created a task. Controls deletion, sharing, and transfer.
_Avoid_: Creator, author, admin

**Collaborator**:
A user granted edit access to a task by the owner, via email. Can modify all task content but cannot delete, share, or transfer.
_Avoid_: Member, participant, assignee

### Lifecycle

**Status**:
The current lifecycle stage of a task. One of: `todo`, `in_progress`, `done`, `archived`.
_Avoid_: State, phase, stage

**Status transition**:
A controlled state change enforced in the backend. Allowed transitions: `todo` → `in_progress`, `in_progress` → `done`, `in_progress` → `todo`, `done` → `archived`, `done` → `todo`.
_Avoid_: Status update, state change

**Overdue**:
A derived state (not stored) — a task is overdue when its due date has passed and its status is not `done` or `archived`.
_Avoid_: Late, expired, past due

### Task content

**Priority**:
The urgency level of a task. One of: `low`, `medium`, `high`.
_Avoid_: Urgency, importance, severity

**Checklist Item**:
A checkable line item embedded in a task. A value object with no identity outside its task.
_Avoid_: Subtask, todo, step

**Tag**:
A free-form label on a task. Previously used tags are saved per-user for autocomplete suggestions.
_Avoid_: Label, category

### Activity

**Activity Entry**:
An append-only record of something that happened on a task. Either system-generated (state changes) or user-generated (comments).
_Avoid_: Event, log entry, history item

**Comment**:
A user-generated activity entry — free text left by the owner or a collaborator.
_Avoid_: Note, message, reply

### Notifications

**Notification**:
A record of an email sent to a user about a task event. Stored in a separate table for delivery tracking.
_Avoid_: Alert, email, message

**Notification trigger**:
An event that causes a notification to be sent. Three triggers exist: task shared with you, due date approaching (24 hours before), comment added on a shared task.
_Avoid_: Event, hook, signal

**Notification preference**:
A per-user, per-event-type toggle controlling whether a notification type is delivered.
_Avoid_: Setting, subscription

## Relationships

- A **User** owns many **Tasks**
- A **Task** has one **Owner** and zero or more **Collaborators** (other Users)
- A **Collaborator** relationship carries `addedAt` and `addedBy` metadata
- A **Task** has zero or more **Checklist Items** (embedded, not a separate entity)
- A **Task** has zero or more **Activity Entries** (separate table, append-only)
- An **Activity Entry** is either system-generated or a **Comment**
- A **Notification** references one **Task** and one recipient **User**
- A **User** has three **Notification Preferences**, one per trigger type

## Example dialogue

> **Dev:** "When a **Collaborator** changes the **Status** of a **Task**, who gets notified?"
> **Domain expert:** "Nobody — status changes are recorded as **Activity Entries** but don't trigger **Notifications**. Only three things send emails: being added as a **Collaborator**, a **Comment** on a shared task, and due date approaching."

> **Dev:** "Can a **Collaborator** add other **Collaborators**?"
> **Domain expert:** "No. Only the **Owner** manages sharing. A **Collaborator** can edit the task content — **Status**, **Priority**, **Checklist Items** — but not who has access."

> **Dev:** "Is an **Overdue** task a different **Status**?"
> **Domain expert:** "No — **Overdue** is derived, not stored. A task is **Overdue** when its due date has passed and it's still in `todo` or `in_progress`. The **Status** stays whatever it is."

## Flagged ambiguities

- "assignee" was considered for collaborators — rejected because all collaborators have equal edit access, there is no single person "assigned" to the task.
- "subtask" was considered for checklist items — rejected because checklist items are embedded value objects, not independent tasks with their own lifecycle.
