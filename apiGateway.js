const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');



const articleProtoPath = 'article.proto';
const bookProtoPath = 'book.proto';

const resolvers = require('./resolvers');
const typeDefs = require('./schema');

const app = express();
app.use(bodyParser.json());

const articleProtoDefinition = protoLoader.loadSync(articleProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const bookProtoDefinition = protoLoader.loadSync(bookProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const articleProto = grpc.loadPackageDefinition(articleProtoDefinition).article;
const bookProto = grpc.loadPackageDefinition(bookProtoDefinition).book;
const clientArticles = new articleProto.ArticleService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);
const clientBooks = new bookProto.BookService(
  'localhost:50052',
  grpc.credentials.createInsecure()
);

const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
  app.use(cors(), bodyParser.json(), expressMiddleware(server));
});

app.get('/articles', (req, res) => {
  clientArticles.searchArticles({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.articles);
    }
  });
});

app.post('/articles', (req, res) => {
  const { id, title, description } = req.body;
  clientArticles.createArticle(
    { article_id: id, title: title, description: description },
    (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.article);
      }
    }
  );
});

app.get('/articles/:id', (req, res) => {
  const id = req.params.id;
  clientArticles.getArticle({ articleId: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.article);
    }
  });
});

app.put('/articles/:id', (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  clientArticles.updateArticle(
    { article_id: id, title: title, description: description },
    (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.article);
      }
    }
  );
});

app.delete('/articles/:id', (req, res) => {
  const id = req.params.id;
  clientArticles.deleteArticle({ article_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response);
    }
  });
});

app.get('/books', (req, res) => {
  clientBooks.searchBooks({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.books);
    }
  });
});

app.post('/books', (req, res) => {
  const { id, title, description } = req.body;
  clientBooks.createBook(
    { book_id: id, title: title, description: description },
    (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.book);
      }
    }
  );
});

app.get('/books/:id', (req, res) => {
  const id = req.params.id;
  clientBooks.getBook({book_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.book);
    }
  });
});

app.put('/books/:id', (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  clientBooks.updateBook(
    { book_id: id, title: title, description: description },
    (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.book);
      }
    }
  );
});

app.delete('/books/:id', (req, res) => {
  const id = req.params.id;
  clientBooks.deleteBook({ book_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response);
    }
  });
});

const port = 3100;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
