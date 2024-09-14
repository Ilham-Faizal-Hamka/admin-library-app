# Library Management API

This is a simple **Library Management API** built using Node.js, Express, and Prisma ORM with MySQL as the database. It allows you to manage books and members, as well as handle book borrowing and returning.

## Features

- **Books**: Add, list, update, and fetch details about books.
- **Members**: Register, list, and manage members.
- **Borrow/Return Books**: Members can borrow and return books with constraints on the number of books they can borrow.

## Getting Started

Follow the instructions below to get this repository up and running locally.

### Prerequisites

Before running this project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or above)
- [MySQL](https://www.mysql.com/)
- [Prisma CLI](https://www.prisma.io/docs/getting-started)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Ilham-Faizal-Hamka/admin-library-app.git
   cd admin-library-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database:

   - Ensure you have a running MySQL instance.
   - Create a `.env` file in the project root and add your **MySQL** connection string:

     ```bash
     DATABASE_URL="mysql://username:password@localhost:3306/librarydb"
     ```

4. Migrate the Prisma schema to your database:

   ```bash
   npx prisma migrate dev --name init
   ```

   This will create the necessary tables in your database based on the provided Prisma schema.

5. Generate the Prisma client:

   ```bash
   npx prisma generate
   ```

### Running the Application

To start the server, run:

```bash
npm start
```

The server will start at `http://localhost:3000`.

### API Endpoints

| Method | Endpoint                                     | Description                       |
|--------|----------------------------------------------|-----------------------------------|
| POST   | `/books`                                     | Register a new book               |
| GET    | `/books`                                     | List all available books          |
| GET    | `/books/{code}`                              | Get details of a specific book    |
| PUT    | `/books/{code}`                              | Update a specific book            |
| POST   | `/members`                                   | Register a new member             |
| GET    | `/members`                                   | List all members                  |
| POST   | `/members/{memberCode}/borrow/{bookCode}`    | Borrow a book                     |
| DELETE | `/members/{memberCode}/return/{bookCode}`    | Return a borrowed book            |

### Error Handling

The API uses custom error handling middleware. The response structure for errors is:

```json
{
  "errors": "Error message"
}
```

- `400`: Bad request (validation errors, book/member already exists, etc.)
- `404`: Not found (book/member not found)
- `500`: Internal server error

### Running Migrations

Whenever you make changes to the Prisma schema, you can run the following command to migrate the changes to the database:

```bash
npx prisma migrate dev --name migration_name
```

### License

This project is licensed under the MIT License.
