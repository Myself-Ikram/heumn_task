# heumn_task
## RESTful API and GraphQL Services

This repository contains two main services:
- **RESTful API**: A standard REST API for handling CRUD operations.
- **GraphQL Service**: A flexible GraphQL endpoint for more advanced querying and mutations.
- 
## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
2. **Install Dependencies**:
   ``bash
   npm install
3. **Setup Environment variables**:
   ``bash
   PORT=8000
   MONGODB_URL=mongodb://127.0.0.1:27017/librarymanagementsystem
   JWT=KwRus3Gc7SYjTmrZyxtE8pd9g4UveqAQaV2Bk5NPCWDHbMLzfn
   ALLOWED_ORIGIN=http://localhost:3000
4. **Start the server**:
   ``bash
   npm start

## RESTFUL APIs

| Method          | Endpoint                          | Description     |
|-----------------|-----------------------------------|-----------------|
|     POST        |      /login                       |user login       |
|     POST        | /login/register                   |user register    |
|     GET         |      /books                       |get all book     |
|     POST        | books/add_new                     |add a book       |
|     PUT         |books/update/:id                   |update a book    |
|     DELETE      | books/delete/:id                  |delete a book    |
|     POST        |     /borrow                       |borrow a book    |
|     GET         |borrow/return/:id                  |retrun a book    |
|     GET         |borrow/myborrow                    |get all borrows  |
|     GET         |borrow/most_borrowed_books         |get most borrowed books       |
|     GET         |borrow/most_active_users           |get most active users       |
|     GET         |borrow/books_summary               |get books summary        |








