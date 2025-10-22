# Task Management System

A role-based task management app built with NestJS, Angular, and TypeORM. Users can create and manage tasks within their organization, with permissions enforced based on their role.

## Quick Start

### Prerequisites
- Node.js (v18+)
- npm

### Running the App

1. Install dependencies:
```bash
npm install
```

2. Set up your database:

The app uses **Supabase** for the PostgreSQL database. You'll need to create a Supabase project and get your connection details.

Create a `.env` file in the root (see `.env.example` for reference):
```bash
DB_HOST=your-supabase-host.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-supabase-password
DB_DATABASE=postgres
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

**Note**: If you want to use SQLite for local testing instead, you can skip the Supabase setup and the app will use an in-memory SQLite database.

3. Start the backend API:
```bash
npm run start:api
```

4. In a new terminal, start the frontend:
```bash
npm run start
```

5. Open http://localhost:4200 in your browser

### Running Tests

To run the backend test suite:
```bash
npm test
```

This runs 15 tests covering the RBAC guards, authentication, and API endpoints.

You can also run specific test suites:
```bash
npm run test:api   # Run API tests (8 tests)
npm run test:auth  # Run auth library tests (7 tests)
```

### Test Users

The database is seeded with some test accounts:

- **Owner**: owner@turbovets.com / password123
- **Admin**: admin@turbovets.com / password123
- **Viewer**: viewer@turbovets.com / password123

Try logging in with different roles to see how permissions work.

## How It Works

### The Role System

There are three roles with different permissions:

**Owner** - Full control. Can create tasks, edit any task, delete any task, and add new users to the organization.

**Admin** - Can create and edit tasks, but can't delete them. Can also add new users.

**Viewer** - Read-only. Can see all tasks in their organization but can't make changes.

The role hierarchy is enforced both on the frontend (hiding buttons) and backend (blocking unauthorized requests).

### Organization Isolation

Users can only see and interact with tasks from their own organization. This is enforced at the database query level, so there's no way to accidentally leak data across organizations.

### Authentication Flow

Login returns a JWT token that gets stored in localStorage. Every API request includes this token in the Authorization header. The backend validates it and extracts the user info, which then gets used for permission checks.

## Project Structure

```
apps/
  api/                 # NestJS backend
    src/
      app/
        auth/          # Login/register endpoints
        tasks/         # Task CRUD
        users/         # User management
        organizations/ # Org management
        roles/         # Role definitions
        permissions/   # Permission setup
        common/        # Guards & interceptors
  turbovets-takehome/  # Angular frontend
    src/
      app/
        login/         # Login page
        dashboard/     # Main task UI

libs/
  data/                # Shared code
    entities/          # TypeORM models (backend only)
    dtos/              # Request validation (backend)
    interfaces/        # TypeScript types (frontend)
    enums/             # Shared enums (both)
    frontend.ts        # Safe frontend entry point
  auth/                # RBAC logic
    guards/            # Permission guards
    decorators/        # Custom decorators
    interceptors/      # Audit logging
```

The `libs/data` folder has two entry points:
- `@turbovets/data` - Full import for backend (includes TypeORM entities)
- `@turbovets/data/frontend` - Safe import for frontend (just interfaces and enums, no database stuff)

This split was necessary because TypeORM decorators were executing in the browser and causing errors.

## Database Schema

**Users**
- Belongs to one Organization
- Has one Role
- Can be assigned many Tasks

**Organizations**
- Has many Users
- Has many Tasks

**Roles**
- Has many Permissions
- One of: Owner, Admin, Viewer

**Tasks**
- Belongs to one Organization
- Assigned to one User (optional)
- Has status (todo, in_progress, done) and priority (low, medium, high)

## Access Control Implementation

### How Guards Work

There are three guards working together:

1. `JwtAuthGuard` - Validates the token exists and is valid
2. `RolesGuard` - Checks if the user's role meets the required level
3. `OrgOwnershipGuard` - Ensures users can only access their org's data

They run on every request in order. The RolesGuard uses the `@Roles()` decorator to know what level is needed.

Example from the tasks controller:
```typescript
@Get()
@Roles(RoleType.VIEWER)
findAll(): Promise<Task[]> {
  return this.tasksService.findAll();
}

@Post()
@Roles(RoleType.ADMIN)
create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
  return this.tasksService.create(/* ... */);
}

@Delete(':id')
@Roles(RoleType.OWNER)
remove(@Param('id') id: string): Promise<void> {
  return this.tasksService.remove(id);
}
```

### Role Hierarchy

The `RolesGuard` implements a hierarchy where higher roles inherit lower role permissions:

```typescript
private readonly roleHierarchy = {
  [RoleType.OWNER]: 3,
  [RoleType.ADMIN]: 2,
  [RoleType.VIEWER]: 1,
};
```

So if an endpoint requires `VIEWER`, both `ADMIN` and `OWNER` can access it. But if it requires `OWNER`, only owners can access it.

### Organization Scoping

Every query filters by the user's organization ID. Here's how a viewer trying to access another org's task gets blocked:

1. User logs in and gets a JWT with their org ID
2. User tries to GET /api/tasks/:id for a task in a different org
3. `JwtAuthGuard` validates the token and attaches user to request
4. `OrgOwnershipGuard` runs and checks the task's org ID against user's org ID
5. Request is rejected with 403 Forbidden

### Audit Logging

The `AuditInterceptor` logs every request with:
- Timestamp
- HTTP method and URL
- User ID
- Success/failure status
- Error message if failed

Currently logs go to the console, but the structure is there to send them to a database.

## API Endpoints

### Auth
```
POST /api/auth/register - Create new account
POST /api/auth/login    - Get JWT token
GET  /api/auth/me       - Get current user info
```

### Tasks
```
GET    /api/tasks                    - List all tasks in your org
GET    /api/tasks/:id                - Get one task
POST   /api/tasks                    - Create task (Admin+)
PUT    /api/tasks/:id                - Update task (Admin+)
DELETE /api/tasks/:id                - Delete task (Owner only)
```

### Users
```
GET    /api/users                    - All users (Admin+)
GET    /api/users/:id                - Get user details
POST   /api/users                    - Add user to org (Admin+)
PUT    /api/users/:id                - Update user (Admin+)
DELETE /api/users/:id                - Remove user (Owner only)
GET    /api/organizations/:id/users  - Users in an organization
```

All endpoints except `/auth/register` and `/auth/login` require a valid JWT.

### Example Request

Creating a task:
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Review PR",
    "description": "Check the authentication changes",
    "status": "todo",
    "priority": "high",
    "organizationId": "your-org-id",
    "assigneeId": "user-id"
  }'
```

## Testing

Added basic test suite covering critical security logic:

**RolesGuard Tests** (`libs/auth/src/lib/guards/roles.guard.spec.ts`)
- Role hierarchy enforcement (Owner > Admin > Viewer)
- Permission checking logic
- Edge cases (missing users, no roles required)

**AuthService Tests** (`apps/api/src/app/auth/auth.service.spec.ts`)
- Login with valid/invalid credentials
- User registration
- JWT token generation

**TasksController Tests** (`apps/api/src/app/tasks/tasks.controller.spec.ts`)
- Basic CRUD operations
- Service method calls

The tests use Jest with mocked dependencies. They focus on the RBAC logic since that's the core security feature.

## What I'd Improve With More Time

**Better Test Coverage** - Would add:
- Integration tests for the full request flow with real database
- Tests for OrgOwnershipGuard and other guards
- Proper component tests for the Angular UI (currently none)
- E2E tests for critical user flows
- Test coverage reports

**Audit Log Viewer** - The interceptor logs everything but there's no UI to view it. Would add a page for Owners/Admins to see the audit trail.

**Task Filtering/Sorting** - The UI shows all tasks. Would add filters by status, priority, assignee and sorting options.

**Drag and Drop** - Would make the UI feel more polished to drag tasks between status columns.

**Performance Improvements**:
- Pagination for task lists
- Caching for role/permission lookups
- Query optimization (select only needed fields)

**Better Token Management**:
- JWT refresh tokens
- Shorter access token lifetime
- Token revocation

**More Robust Validation**:
- Email format validation
- Password strength requirements
- Due date validation

**Additional Features**:
- Task categories or projects
- Task comments
- File attachments
- Email notifications

## Known Limitations

- Tokens don't expire
- No pagination on task lists
- Audit logs only go to console
- No password reset flow
- Can't change your own password
- Task due dates don't handle timezones
- No email verification on signup

## Security Notes

Passwords are hashed using bcryptjs with 10 salt rounds before storing in the database.

The frontend hides UI elements based on user role, but all actual permission enforcement happens on the backend. The guards are the real security layer - never trust the client.

Organization isolation is enforced at the query level, not just filtering results after fetching. This prevents accidentally loading data from other orgs.
