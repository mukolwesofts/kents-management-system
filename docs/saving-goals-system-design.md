# Saving Goals System Design

> **Note on Authentication and Family Members**: 
> - Initially, the system will not implement authentication
> - Family members will be managed through a simple family member management system
> - This will be replaced with proper authentication in a future phase
> - For now, family members will be identified by their names and relationships

To accommodate the different saving goals you've described (family savings, 52-week challenge, school fees, holiday savings, and others), we need a flexible structure. Here's a proposed database schema and UI approach:

## 1. Database Schema

Here's a possible database schema to handle the different saving goal scenarios:

### Tables:

#### Users
- user_id (Primary Key)
- name
- email
- password
- created_at
- updated_at

#### Goals
- goal_id (Primary Key)
- user_id (Foreign Key to Users)
- name
- description
- start_date
- end_date
- target_amount
- goal_type (e.g., "fixed_deposit", "recurring", "flexible", "challenge")
- status (e.g., "active", "completed", "on_hold", "failed")
- created_at
- updated_at

#### Schedules
- schedule_id (Primary Key)
- goal_id (Foreign Key to Goals)
- scheduled_date
- amount_due
- amount_paid
- is_completed (Boolean)
- payment_method
- created_at
- updated_at

#### Contributors (For collaborative goals like family savings)
- contributor_id (Primary Key)
- goal_id (Foreign Key to Goals)
- user_id (Foreign Key to Users)
- contribution_amount
- created_at
- updated_at

#### Transactions (To record actual deposits/withdrawals, useful for tracking and reconciliation)
- transaction_id (Primary Key)
- goal_id (Foreign Key to Goals)
- schedule_id (Foreign Key to Schedules, can be null for unscheduled)
- transaction_date
- amount
- type (e.g., "deposit", "withdrawal")
- payment_method
- created_at
- updated_at

### Explanation:
- **Users**: Stores user information.
- **Goals**: Stores the basic information about each saving goal, including the type of goal.
- **Schedules**: Stores the payment schedules for goals that have them (recurring, challenge, holiday savings). A goal can have many schedules.
- **Contributors**: Links users to goals where multiple people contribute.
- **Transactions**: Records every financial transaction (deposit/withdrawal) made towards a goal.

## 2. Goal Types and Logic

The goal_type field in the Goals table is crucial for determining the behavior of the system. Here's how we can use it:

### Fixed Deposit: (e.g., School fees)
- goal_type = "fixed_deposit"
- User deposits money as and when available.
- Schedules are not mandatory. Transactions table is key.
- The user defines a target_amount and end_date, but they are not strictly enforced.

### Recurring: (e.g., Family savings)
- goal_type = "recurring"
- User and contributors deposit a fixed amount at regular intervals.
- Schedules table is used to generate the expected contributions.
- Contributors table stores who is contributing and how much.

### Challenge: (e.g., 52-week challenge)
- goal_type = "challenge"
- Contributions vary according to a predefined rule.
- Schedules table is used to generate the weekly amounts.

### Targeted Savings: (e.g., Holiday savings)
- goal_type = "targeted_savings"
- The user has a specific target_amount and end_date.
- The system calculates a schedule of contributions in the Schedules table.

## 3. UI Structure

Here's a suggested UI structure to manage the saving goals:

### Dashboard:
- Display a summary of all active goals.
- Show progress towards each goal (using data from Schedules and Transactions).
- Provide quick actions to create new goals and view upcoming schedules.

### Goal List Page:
- List all saving goals, with filters for status and type.
- Provide options to create, edit, and delete goals.

### Goal Details Page:
- Show all details of a selected goal.
- Display the contribution schedule (if applicable) from the Schedules table.
- Show a progress tracker (calculated from Schedules and Transactions).
- Allow users to:
  - Mark schedule items as completed.
  - Record deposits/withdrawals (Transactions).
  - Edit goal details.
  - Manage contributors (if applicable).

### Create/Edit Goal Form:
- A form to create or edit a saving goal.
- The form should dynamically adapt based on the selected goal_type:
  - Show schedule fields for "recurring", "challenge", and "targeted_savings".
  - Hide schedule fields for "fixed_deposit".
  - Show contributor fields for "recurring".

### Schedule Display:
- Display the schedule of payments, their status, and the amount due/paid.
- Allow users to mark schedule items as completed (which updates Schedules.is_completed and creates a Transaction).

### Progress Visualization:
- Use visual aids like progress bars, charts, or graphs to show how much of the goal has been achieved.
- Calculate this using Transactions (actual) vs Schedules (expected, if applicable) and target_amount.

## 4. Implementation Considerations

### Backend:
Use a backend framework (e.g., Node.js, Python/Django, Ruby on Rails) to:
- Implement the database schema.
- Create APIs to manage goals, schedules, and transactions.
- Calculate progress and generate schedules.

### Frontend:
Use a frontend framework (e.g., React, Angular, Vue.js) to:
- Create the UI.
- Consume the backend APIs.
- Display data and handle user interactions.

### Scheduling:
For "recurring", "challenge", and "targeted_savings" goals, you'll need a mechanism to generate the schedules:
- For "recurring", generate schedules based on the frequency (e.g., daily, weekly, monthly).
- For "challenge", generate schedules based on the challenge rules (e.g., the 52-week challenge).
- For "targeted_savings" calculate schedule to meet target.

### Transactions:
Every deposit and withdrawal should be recorded in the Transactions table. If a deposit is made against a scheduled payment, link it to the Schedules record.

### Progress Calculation:
- For goals with schedules, progress is the sum of amount_paid in Schedules divided by the sum of amount_due in Schedules, compared to the target_amount.
- For "fixed_deposit" goals, progress is the sum of amount in Transactions divided by target_amount.

### User Roles:
Consider user roles (e.g., admin, user) for managing goals and contributions, especially in collaborative scenarios. 