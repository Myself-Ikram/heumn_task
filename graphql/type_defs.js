export const graphqlDefs = `
    type User{
        _id:ID!,
        name:String!
        email:String!
        password:String,
        role:String!,
        createdAt:String!,
        updatedAt:String!
    }
    type Book {
        _id: ID!
        title: String!
        author: String!
        isbn: String!
        publication_date: String!
        genre: String!
        copies: Int!
    }
    type Borrow {
    _id: ID!
    userId: User!
    bookId: Book!
    borrow_date: String!
    return_date: String
    createdAt:String!
    updatedAt:String!
    }
    type Aggregate{
          bookId: String!,
          bookTitle: String!,
          count: Int!,
        }
    type bookResponse{
    statusCode:Int!
    success:Boolean!
    data:[Book]
    message:String
    }

    type borrowResponse{
    statusCode:Int!
    success:Boolean!
    data:[Aggregate]
    message:String
    }

    type bookHistory{
    statusCode:Int!
    success:Boolean!
    data:[Borrow]
    }

    type Query{
      getBooks:bookResponse

      mostBorrowedBooks:borrowResponse
      mostActiveUser:borrowResponse
      bookHistory:bookHistory
      bookSummary:borrowResponse
    }

    type Mutation{
      addBook(title:String!,author:String!,isbn:String!,publication_date:String!,genre:String,copies:Int): bookResponse
      updateBook(id:ID!,title:String,author:String,isbn:String,publication_date:String,genre:String,copies:Int): bookResponse
      deleteBook(id:ID!):bookResponse

      borrowBook(bookId:String!,borrow_date:String!):borrowResponse
      returnBook(id:ID!):borrowResponse
    }
  `;
