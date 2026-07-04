# Backend Lab Viva Preparation Guide (25 Q&A)

### 1. What is Node.js?
Node.js is an open-source, cross-platform JavaScript runtime environment built on Chrome's V8 engine. It allows developers to run JavaScript code on the server side, outside of a web browser.

### 2. What is Express.js?
Express.js is a minimal and flexible web application framework for Node.js. It provides a robust set of features for building single-page, multi-page, and hybrid web applications, and simplifies the creation of REST APIs.

### 3. What is the role of `package.json`?
`package.json` is the manifest file of a Node.js project. It contains metadata about the project (name, version, scripts) and lists the dependencies (packages) that the project requires to run.

### 4. What is a REST API?
REST (Representational State Transfer) is an architectural style for designing networked applications. A REST API uses HTTP requests (GET, POST, PUT, DELETE, PATCH) to perform operations on resources, which are typically represented in JSON format.

### 5. What is JWT (JSON Web Token)?
JWT is a compact, URL-safe means of representing claims to be transferred between two parties. It consists of three parts: a Header, a Payload, and a Signature. It is commonly used for stateless authentication.

### 6. What is the difference between Authentication and Authorization?
* **Authentication** is the process of verifying who a user is (e.g., login with email and password).
* **Authorization** is the process of verifying what access rights a user has (e.g., checking if the user owns a task before letting them delete it).

### 7. Why do we hash passwords, and why did we use bcrypt/bcryptjs?
We hash passwords to protect user credentials in case the database is compromised. Plaintext passwords should never be stored. We used `bcryptjs` because it is a pure JavaScript implementation of the bcrypt hashing algorithm, which incorporates salt to protect against rainbow table attacks and brute force cracking.

### 8. What is middleware in Express?
Middleware functions are functions that have access to the request object (`req`), the response object (`res`), and the next middleware function (`next`) in the application’s request-response cycle. They can execute code, modify request/response objects, and end the cycle or pass control to the next function.

### 9. What is Prisma ORM?
Prisma is a modern Object-Relational Mapper (ORM) for Node.js and TypeScript. It allows developers to interact with database engines using a clean, type-safe API, replacing raw SQL queries with intuitive methods (like `prisma.task.create`).

### 10. Explain the relationship between User and Task models in this project.
It is a **one-to-many relationship**. A single User can create many Tasks. In our `schema.prisma`, this is represented by mapping a `userId` field in the `Task` model back to the `id` field in the `User` model, with a cascade deletion behavior.

### 11. What is a Soft Delete, and why is it useful?
A Soft Delete marks a database record as deleted by setting a flag (like `isDeleted = true`) instead of physically deleting it from the database table. This preserves data integrity, allows for easy recovery (restoring), and maintains audit trails.

### 12. What is the difference between PUT and PATCH HTTP methods?
* **PUT** is used to replace an entire resource. The request body must contain the complete representation of the updated resource.
* **PATCH** is used to apply partial updates to a resource (e.g., updating only the status or restoring a task).

### 13. What is CORS?
CORS (Cross-Origin Resource Sharing) is a browser security mechanism that restricts web pages from making requests to a different domain than the one that served the web page. We use the `cors` middleware in Express to allow client apps to safely query our backend.

### 14. What are Environment Variables (.env), and why do we use them?
Environment variables store sensitive configuration details (like database credentials, port numbers, and JWT secrets) separate from our source code. This ensures security and allows the application to behave differently depending on the environment (development, staging, production).

### 15. What is the purpose of `npx prisma migrate dev`?
This command performs two functions during development:
1. It creates a SQL migration file based on the differences between your `schema.prisma` file and the database schema.
2. It executes that migration file against your database to sync the tables, and generates the latest Prisma Client.

### 16. What is the role of `npx prisma generate`?
It generates the Prisma Client tailored to your models defined in `schema.prisma`. It is placed in `node_modules/@prisma/client` so you can import and use it in your code to query the database.

### 17. How does pagination work, and why do we use it?
Pagination splits a large dataset into smaller, manageable chunks (pages) using query parameters like `page` and `limit`. In SQL/Prisma, this maps to `skip` (offset) and `take` (limit). It improves API performance and reduces server load.

### 18. Why is `GET /tasks/stats` placed before `GET /tasks/:id` in your routes?
Express routes are matched sequentially in the order they are defined. If `/tasks/:id` was placed first, a request to `/tasks/stats` would be intercepted, and Express would treat the string `'stats'` as a task parameter `:id`.

### 19. What is a centralized error handler?
A centralized error handler is an Express middleware defined with four arguments: `(err, req, res, next)`. Instead of sending error responses from every controller block, we forward errors to this single middleware using `next(error)`. This ensures consistent error formatting and prevents server crashes.

### 20. How do you prevent users from accessing or editing other users' tasks?
In every task service query (retrieve, update, delete, complete, restore), we include the authenticated user's ID (`req.user.id`) in the database lookup query filter (`where: { id, userId }`). This ensures that even if a user knows another user's task ID, they cannot access or modify it.

### 21. What are database enums, and why use them?
Enums (Enumerated types) restrict a column's value to a predefined set of constants (e.g., Priority: `LOW`, `MEDIUM`, `HIGH`). They enforce data integrity at the database level and prevent invalid entries.

### 22. What does `app.use(express.json())` do?
It is a built-in Express middleware that parses incoming requests with JSON payloads and populates the `req.body` object with the parsed data.

### 23. What is the difference between `npx` and `npm`?
* **npm** is a package manager used to install, update, and manage dependencies.
* **npx** is a package runner tool that comes with npm. It allows you to execute binaries/packages directly without globally installing them (e.g., running `npx prisma`).

### 24. What is `bcrypt.compare()` doing behind the scenes?
Since bcrypt uses a random salt for hashing, the same password will result in a different hash each time. `bcrypt.compare()` extracts the salt from the stored hash, hashes the input password with that same salt, and compares the resulting hash with the stored hash to see if they match.

### 25. How do you ensure your Express server does not crash on unexpected runtime errors?
We listen to global process-level events:
* `process.on('uncaughtException')`: Catches synchronous errors that were not caught by try-catch blocks.
* `process.on('unhandledRejection')`: Catches asynchronous rejected promises.
Additionally, wrapping our async controllers in try-catch blocks and forwarding errors using `next(err)` to our centralized error middleware ensures the server keeps running.
