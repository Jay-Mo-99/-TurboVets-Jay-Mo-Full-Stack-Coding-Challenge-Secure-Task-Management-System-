# Secu# Secure Task Management System

A full-stack secure task management application built with NestJS backend and React frontend using NX monorepo.

## Features

### ✅ Authentication & Security
- User registration and login
- JWT-based authentication
- Password hashing with bcryptjs
- Token-based API protection

### ✅ Task Management
- Create tasks with title, description, and priority levels
- Update task status (pending, in-progress, completed)
- Delete tasks
- View all user tasks
- User-specific task isolation

### ✅ Frontend Dashboard
- Modern React-based UI with Tailwind CSS
- Responsive design
- Real-time task status updates
- Intuitive user interface

## Tech Stack

### Backend (NestJS API)
- **Framework**: NestJS with TypeScript
- **Authentication**: JWT tokens, bcryptjs password hashing
- **Architecture**: Modular structure with Controllers, Services, and Entities
- **API**: RESTful endpoints with proper error handling

### Frontend (React Dashboard)
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks
- **HTTP Client**: Fetch API

### Development Tools
- **Monorepo**: NX workspace
- **Testing**: Jest, Cypress
- **Linting**: ESLint
- **Build**: Vite (frontend), Webpack (backend)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` (if exists)
   - Update `JWT_SECRET` in `.env` file

### Running the Application

#### Start Backend API:
```bash
npx nx serve api
```
Backend will run on http://localhost:3000

#### Start Frontend Dashboard:
```bash
npx nx serve dashboard
```
Frontend will run on http://localhost:4200

### API Endpoints

#### Authentication
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - Login user

#### Tasks (Protected - requires JWT token)
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Usage

1. **Register**: Create a new account with email, username, and password
2. **Login**: Sign in to access the dashboard
3. **Create Tasks**: Add new tasks with title, description, and priority
4. **Manage Tasks**: Update status (pending → in-progress → completed) or delete tasks
5. **View Tasks**: See all your tasks with status and priority indicators

## Security Features

- Password hashing using bcryptjs
- JWT token-based authentication
- User-specific data isolation
- Protected API endpoints
- CORS configuration
- Input validation and sanitization

## Project Structure

```
apps/
├── api/              # NestJS backend
│   ├── src/app/
│   │   ├── user/     # User authentication module
│   │   ├── task/     # Task management module
│   │   └── auth/     # Authentication utilities
├── dashboard/        # React frontend
└── *-e2e/           # E2E tests

libs/
├── auth/            # Shared authentication library
└── data/            # Shared DTOs and interfaces
```

## Development Commands

```bash
# Build specific app
npx nx build api
npx nx build dashboard

# Run tests
npx nx test api
npx nx test dashboard

# Run e2e tests
npx nx e2e api-e2e
npx nx e2e dashboard-e2e

# Lint
npx nx lint api
npx nx lint dashboard

# View dependency graph
npx nx graph
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

Built with ❤️ using NX, NestJS, and ReacteTaskMgmt

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/nx-api/js?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Generate a library

```sh
npx nx g @nx/js:lib packages/pkg1 --publishable --importPath=@my-org/pkg1
```

## Run tasks

To build the library use:

```sh
npx nx build pkg1
```

To run any task with Nx use:

```sh
npx nx <target> <project-name>
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Versioning and releasing

To version and release the library use

```
npx nx release
```

Pass `--dry-run` to see what would happen without actually releasing the library.

[Learn more about Nx release &raquo;](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Keep TypeScript project references up to date

Nx automatically updates TypeScript [project references](https://www.typescriptlang.org/docs/handbook/project-references.html) in `tsconfig.json` files to ensure they remain accurate based on your project dependencies (`import` or `require` statements). This sync is automatically done when running tasks such as `build` or `typecheck`, which require updated references to function correctly.

To manually trigger the process to sync the project graph dependencies information to the TypeScript project references, run the following command:

```sh
npx nx sync
```

You can enforce that the TypeScript project references are always in the correct state when running in CI by adding a step to your CI job configuration that runs the following command:

```sh
npx nx sync:check
```

[Learn more about nx sync](https://nx.dev/reference/nx-commands#sync)

## Set up CI!

### Step 1

To connect to Nx Cloud, run the following command:

```sh
npx nx connect
```

Connecting to Nx Cloud ensures a [fast and scalable CI](https://nx.dev/ci/intro/why-nx-cloud?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) pipeline. It includes features such as:

- [Remote caching](https://nx.dev/ci/features/remote-cache?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task distribution across multiple machines](https://nx.dev/ci/features/distribute-task-execution?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Automated e2e test splitting](https://nx.dev/ci/features/split-e2e-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task flakiness detection and rerunning](https://nx.dev/ci/features/flaky-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### Step 2

Use the following command to configure a CI workflow for your workspace:

```sh
npx nx g ci-workflow
```

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/js?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
