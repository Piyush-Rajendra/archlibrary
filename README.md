# ArchLibrary Backend

This is the Spring Boot backend for **ArchLibrary**, a secure and scalable online library management system. It includes features like:

- Secure User Registration and Login with JWT
- SQL Injection prevention via Spring Data JPA
- Book search by genre
- Book availability updates
- Borrow book functionality using database transactions
- Brute-force login protection

---

| Tool | Purpose | Download |
|------|---------|----------|
| **Java JDK (17+)** | Compiles and runs Spring Boot backend | [Adoptium JDK 17](https://adoptium.net/en-GB/temurin/releases/?version=17) |
| **Maven** | Builds the project and manages dependencies | [Apache Maven](https://maven.apache.org/download.cgi) *(if not using mvnw wrapper)* |
| **MySQL** | Database to store users, books, transactions | [XAMPP](https://www.apachefriends.org/index.html) *(includes MySQL & phpMyAdmin)* or [MySQL Installer](https://dev.mysql.com/downloads/installer/) |
| **VS Code** (or IntelliJ) | Code editor for Java/Spring | [VS Code](https://code.visualstudio.com/) |
| **Postman** | API testing (register/login, borrow, etc.) | [Postman](https://www.postman.com/downloads/) |

## Dependencies Used

- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- MySQL
- JWT (jjwt)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/archlibrary-backend.git
cd archlibrary-backend

### 2.MySQL Setup (XAMPP or standalone MySQL)
Start MySQL server (XAMPP or MySQL Workbench)
Create a new database named: archlibrary

### 3. Configure application.properties
Open src/main/resources/application.properties and update your DB credentials:
spring.datasource.url=jdbc:mysql://localhost:3306/archlibrary
spring.datasource.username=root
spring.datasource.password=your_password_here
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
server.port=8080

### 4. Run the App
    Option A: Using VS Code or IDE
    Open the project in VS Code or IntelliJ
    Run ArchLibraryApplication.java
    
    Option B: Using Terminal
    ./mvnw spring-boot:run     # Linux/Mac
    mvnw.cmd spring-boot:run   # Windows PowerShell

or if Maven is globally installed:
    mvn spring-boot:run

Postman link: https://epoch8-2961.postman.co/workspace/Epoch-Workspace~8bb9eea6-464b-404a-8b1f-da6d8b2dad75/collection/27181948-d9613df6-049f-4d3d-a23c-e173a46bb611?action=share&creator=27181948&active-environment=27181948-7dc16bba-28f4-43f0-8a59-b98bbb13f097



