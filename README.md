# ArchLibrary - Full Stack Application

## Project Overview

ArchLibrary is an online library management system built using:

- **Backend:** Spring Boot (Java 17), MySQL
- **Frontend:** Next.js (React with TypeScript)
- **Authentication:** JWT (JSON Web Tokens)
- **Database:** MySQL 8+
- **Deployment:** Localhost (can be easily extended to AWS or GCP)

The application supports user registration, authentication, borrowing and returning books, fine management, and admin-specific functionality.

---

## Backend Setup (Spring Boot)

### 1. Prerequisites

- Java 17+
- Maven 3.8+
- MySQL 8+
- IDE (IntelliJ IDEA / Eclipse / VS Code)

### 2. Database Setup

- Create a MySQL database named `archlibrary`.

```sql
CREATE DATABASE archlibrary;
```

- In your `application.properties` (or `application.yml`) configure:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/archlibrary
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8080
```

### 3. Running the Backend

- Navigate to the backend root folder.
- Run the following command:

```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on:

```
http://localhost:8080
```

### 4. Important Backend Notes

- JWT Authentication is enabled via a custom `JwtFilter`.
- CORS is configured to allow requests from `http://localhost:3000`.
- `@Table(name = "BorrowedBook")` and similar annotations are added to prevent Hibernate auto-splitting table names.
- Borrowing and Returning books automatically adjust available copies.
- Overdue returns automatically generate unpaid fines.

---

## Frontend Setup (Next.js)

### 1. Prerequisites

- Node.js 18+
- npm 9+
- IDE (VS Code recommended)

### 2. Installation

- Navigate to the frontend root folder.
- Install dependencies:

```bash
npm install
```

### 3. Running the Frontend

```bash
npm run dev
```

The frontend will start on:

```
http://localhost:3000
```

### 4. Important Frontend Notes

- Axios instance is configured to automatically attach Authorization headers.
- After login, `token`, `userId`, `email`, and `role` are stored in localStorage.
- Protected routes (like dashboard, admin panel) check for valid login status.
- Role-based UI (Student vs Librarian) is dynamically rendered.

---

## How to Use the Application

### 1. Registration and Login

- Visit `/register` to create a new account.
- Choose the role: Student or Librarian.
- Login via `/login` after registration.

### 2. Student Functionalities

- Search available books.
- Borrow and return books.
- View active and historical borrowed books.
- View outstanding fines.

### 3. Librarian Functionalities

- Manage books: Add, Update.
- Manage fines: View all active fines and mark fines as paid.
- View and manage borrowed book transactions.

---

## Key API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and receive JWT + user details

### Books

- `GET /api/books` - List all books
- `GET /api/books/search?title=xyz` - Search books by title
- `POST /api/books` - Add new book (Librarian only)
- `PUT /api/books/{bookId}` - Update book details (Librarian only)

### Borrowing

- `POST /api/library/borrow?userId=...&bookId=...` - Borrow a book
- `POST /api/library/return?userId=...&bookId=...` - Return a book

### Fines

- `GET /api/fines/user/{userId}` - Get fines for a specific user
- `PUT /api/fines/{fineId}/pay` - Pay a specific fine (Librarian)
- `GET /api/fines` - List all fines (Librarian)

### Borrowed Books

- `GET /api/borrowed/user/{userId}` - Get borrowed books for user
- `GET /api/borrowed/user/{userId}/active` - Get active borrowed books for user
- `GET /api/borrowed/overdue` - Get all overdue borrowed books
- `GET /api/borrowed/user/{userId}/details` - Get borrowed book details including book metadata

---

## Important Development Notes

- Always ensure backend is running before frontend.
- Frontend expects all API endpoints to be served at `localhost:8080`.
- If modifying authentication flows, update both JWT token creation and parsing accordingly.
- Consider using environment variables for production deployment.

---

---

## Contact

For any queries, issues, or contributions, please contact the project maintainer or open an issue in the repository.

