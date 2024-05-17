# API Gateway

This is the README file for the `apiGateway.js` file, which serves as the API Gateway for your application. The API Gateway is responsible for routing requests from clients to the appropriate services and handling the communication between the client and the underlying gRPC services.

## Prerequisites

Before running the API Gateway, make sure you have the following dependencies installed:

- Node.js (v10 or higher)
- Express.js
- Apollo Server
- Body Parser
- CORS
- gRPC
- Proto Loader

## Installation

Clone the repository or download the source code containing the `apiGateway.js` file.

Navigate to the project directory in your terminal.

Run the following command to install the required dependencies:

npm install

## Configuration

Before running the API Gateway, you need to configure the gRPC services and the port number for the API Gateway.

Open the `apiGateway.js` file in a text editor.

Modify the following lines to specify the paths to your gRPC proto files:

const articleProtoPath = 'article.proto';
const bookProtoPath = 'book.proto';

Update the gRPC service URLs to match your service configurations:

const clientArticles = new articleProto.ArticleService('localhost:50051', grpc.credentials.createInsecure());
const clientBooks = new bookProto.BookService('localhost:50052', grpc.credentials.createInsecure());

Optionally, you can change the port number for the API Gateway by modifying the following line:

const port = 3100;

## Starting the API Gateway

To start the API Gateway, follow these steps:

Open a terminal and navigate to the project directory.
Run the following command:

node apiGateway.js

Once the API Gateway is running, you should see a message in the console indicating the port number:

API Gateway running on port 3000

## Endpoints

### Articles

- **GET /articles**: Retrieve a list of all articles.
- **GET /articles/:id**: Retrieve an article by ID.
- **POST /articles**: Create a new article.
- **PUT /articles/:id**: Update an existing article.
- **DELETE /articles/:id**: Delete an article.

### Books

- **GET /books**: Retrieve a list of all books.
- **GET /books/:id**: Retrieve a book by ID.
- **POST /books**: Create a new book.
- **PUT /books/:id**: Update an existing book.
- **DELETE /books/:id**: Delete a book.

## GraphQL Schema

The API Gateway exposes the following GraphQL schema:

type Article {
  id: String!
  title: String!
  content: String!
}

type Book {
  id: String!
  title: String!
  author: String!
}

type Query {
  article(id: String!): Article
  articles: [Article]
  book(id: String!): Book
  books: [Book]
}

type Mutation {
  addArticle(id: String!, title: String!, content: String!): Article
  updateArticle(id: String!, title: String!, content: String!): Article
  deleteArticle(id: String!): Boolean
  addBook(id: String!, title: String!, author: String!): Book
  updateBook(id: String!, title: String!, author: String!): Book
  deleteBook(id: String!): Boolean
}

## Dependencies

- express
- @apollo/server
- body-parser
- cors
- @grpc/grpc-js
- @grpc/proto-loader

## Configuration

The API Gateway requires the following gRPC service definitions:

- `article.proto`: Protobuf definition for the ArticleService.
- `book.proto`: Protobuf definition for the BookService.

Make sure to update the file paths in the `apiGateway.js` file to match the location of your gRPC service definitions.

## API Endpoints

The API Gateway exposes the following endpoints for interacting with the gRPC services:

- **GET /articles**: Retrieves a list of articles.
- **POST /articles**: Creates a new article.
- **GET /articles/:id**: Retrieves a specific article by ID.
- **GET /books**: Retrieves a list of books.
- **POST /books**: Creates a new book.
- **GET /books/:id**: Retrieves a specific book by ID.

## Conclusion

The API Gateway provides a unified interface for accessing the gRPC services related to articles and books. By starting the API Gateway and making requests to the defined endpoints, you can interact with the services and retrieve or create data as needed.
