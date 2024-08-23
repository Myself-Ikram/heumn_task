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
    user: User!
    book: Book!
    borrowDate: String!
    returnDate: String
    return_status:Boolean
  }
    type Query{
      getUsers: String,
    }
  `;
