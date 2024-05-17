const { gql } = require('@apollo/server');

const typeDefs = `#graphql
  type Article {
    id: String!
    title: String!
    description: String!
  }

  type Book {
    id: String!
    title: String!
    description: String!
  }

  type Query {
    article(id: String!): Article
    articles: [Article]
    book(id: String!): Book
    books: [Book]
  }
  type Mutation {
    addArticle(id: String!, title: String!, description:String!): Article
    addBook(id: String!, title: String!, description:String!): Book
    deleteArticle(id: String!): Boolean
    updateArticle(id: String!, title: String!, description: String!): Article
    updateBook(id: String!, title: String!, description: String!): Book
    deleteBook(id: String!): Boolean
  }
`;

module.exports = typeDefs