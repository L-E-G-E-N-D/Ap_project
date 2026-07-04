# Task Manager REST API

A clean, modular, and production-ready Task Manager REST API built with Node.js, Express.js, Prisma ORM, PostgreSQL, and JWT Authentication. Designed as a university backend lab viva project.

## Tech Stack
* Node.js
* Express.js
* PostgreSQL
* Prisma ORM
* JWT Authentication (jsonwebtoken)
* Input Validation (Joi)
* Password Hashing (bcryptjs)
* CORS & Dotenv

---

## Folder Structure
```
src/
├── config/
│   └── db.js            # Prisma client instantiation
├── controllers/
│   ├── authController.js # Auth request handlers
│   └── taskController.js # Task request handlers
├── middleware/
│   ├── authMiddleware.js # JWT verification middleware
│   ├── errorMiddleware.js # Central error handler
│   └── validate.js      # Joi schema runner
├── prisma/
│   └── schema.prisma    # Database schema definitions
├── routes/
│   ├── index.js         # Main API router
│   ├── authRoutes.js    # Auth routing
│   └── taskRoutes.js    # Task routing
├── services/
│   ├── authService.js    # Auth business logic
│   └── taskService.js    # Task business logic
├── utils/
│   ├── apiResponse.js   # Consistent JSON formatter
│   └── appError.js      # Custom error class
├── validations/
│   ├── authValidation.js # Auth input validation schemas
│   └── taskValidation.js # Task input validation schemas
├── app.js               # Express application configuration
└── server.js            # Server entry point
```

---

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/L-E-G-E-N-D/Ap_project.git
   cd Ap_project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory and add:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
   JWT_SECRET="your_jwt_secret_key"
   JWT_EXPIRES_IN="7d"
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start the server**
   * Development mode (with nodemon):
     ```bash
     npm run dev
     ```
   * Production mode:
     ```bash
     npm start
     ```

---

## API Endpoints

### Authentication
* `POST /api/auth/register` - Register a new user
* `POST /api/auth/login` - Login user and receive token

### Tasks (Protected - Bearer Token Required)
* `POST /api/tasks` - Create a new task
* `GET /api/tasks` - Get all tasks (supports filtering, sorting, pagination, and overdue check)
* `GET /api/tasks/stats` - Get summary statistics of tasks
* `GET /api/tasks/:id` - Get task details by ID
* `PUT /api/tasks/:id` - Update task details
* `DELETE /api/tasks/:id` - Soft delete a task
* `PATCH /api/tasks/:id/restore` - Restore a soft-deleted task
* `PATCH /api/tasks/:id/complete` - Mark a task as completed

---

## Filtering, Sorting, and Pagination

You can query tasks using options like:
* **Filter by priority**: `/api/tasks?priority=HIGH`
* **Filter by status**: `/api/tasks?status=PENDING`
* **Text Search** (matches title/description): `/api/tasks?search=exam`
* **Sort by fields**: `/api/tasks?sort=dueDate` (defaults to `createdAt`)
* **Pagination**: `/api/tasks?page=1&limit=5`
* **Filter Overdue**: `/api/tasks?overdue=true` (pending tasks past due date)

---

## Centralized Error Handling

All endpoint errors are mapped to consistent JSON formats with appropriate HTTP status codes:
* `200` / `201` - Successful requests
* `400` - Validation error or bad request format
* `401` - Unauthorized (missing, invalid, or expired JWT token)
* `403` - Forbidden (accessing another user's task)
* `404` - Resource not found (task or endpoint does not exist)
* `409` - Conflict (duplicate record, e.g. email already exists)
* `500` - Internal server error

---

## Deployment Guidelines

### Deploying to Render
1. Create a new **Web Service** on Render.
2. Connect your Git repository.
3. Configure these environment variables under the "Environment" tab:
   * `DATABASE_URL` (your live PostgreSQL database string)
   * `JWT_SECRET` (a secure secret string)
   * `JWT_EXPIRES_IN=7d`
4. Set Build Command:
   ```bash
   npm install && npx prisma generate
   ```
5. Set Start Command:
   ```bash
   npx prisma migrate deploy && npm start
   ```

### Deploying to Railway
1. Create a new project on Railway and select **Deploy from GitHub repo**.
2. Add a **PostgreSQL database** plugin inside Railway.
3. Connect the variables: Railway will automatically inject the `DATABASE_URL` for you.
4. Add custom environment variables: `JWT_SECRET` and `JWT_EXPIRES_IN`.
5. Railway reads the start script in `package.json`. Make sure you run migrations inside your start script or postinstall hooks.
