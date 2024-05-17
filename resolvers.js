const sqlite3 = require('sqlite3').verbose();

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');


const articleProtoPath = 'article.proto';
const bookProtoPath = 'book.proto';
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
const clientArticles = new articleProto.ArticleService('localhost:50051', grpc.credentials.createInsecure());
const clientBooks = new bookProto.BookService('localhost:50052', grpc.credentials.createInsecure());

const db = new sqlite3.Database('./database.db');

db.run(`
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY,
    title TEXT,
    description TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY,
    title TEXT,
    description TEXT
  )
`);


const resolvers = {
  Query: {
    book: (_, { id }) => {
      return new Promise((resolve, reject) => {
        db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve(row);
          } else {
            resolve(null);
          }
        });
      });
    },
    books: () => {
      return new Promise((resolve, reject) => {
        db.all('SELECT * FROM books', (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    },
    article: (_, { id }) => {
      return new Promise((resolve, reject) => {
        db.get('SELECT * FROM articles WHERE id = ?', [id], (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve(row);
          } else {
            resolve(null);
          }
        });
      });
    },
    articles: () => {
      return new Promise((resolve, reject) => {
        db.all('SELECT * FROM articles', (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    },
},
Mutation: {
    addBook: (_, { id,title, description }) => {
      return new Promise((resolve, reject) => {
        db.run('INSERT INTO books (id,title, description) VALUES (?, ?, ?)', [id,title, description], function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, title, description });
          }
        });
      });
    },
    addArticle: (_, { id,title, description }) => {
      return new Promise((resolve, reject) => {
        db.run('INSERT INTO articles (title, description) VALUES (?, ?)', [title, description], function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ title, description });
          }
        });
      });
    },
    updateArticle: (_, { id, title, description }) => {
      return new Promise((resolve, reject) => {
        db.run('UPDATE articles SET title = ?, description = ? WHERE id = ?', [title, description, id], function (err) {
          if (err) {
            reject(err);
          } else if (this.changes === 0) {
            reject(new Error('Article not found'));
          } else {
            resolve({ id, title, description });
          }
        });
      });
    },
    deleteArticle: (_, { id }) => {
      return new Promise((resolve, reject) => {
        db.run('DELETE FROM articles WHERE id = ?', [id], function (err) {
          if (err) {
            reject(err);
          } else if (this.changes === 0) {
            reject(new Error('Article not found'));
          } else {
            resolve(true);
          }
        });
      });
    },
    updateBook: (_, { id, title, description }) => {
      return new Promise((resolve, reject) => {
        db.run('UPDATE books SET title = ?, description = ? WHERE id = ?', [title, description, id], function (err) {
          if (err) {
            reject(err);
          } else if (this.changes === 0) {
            reject(new Error('Book not found'));
          } else {
            resolve({ id, title, description });
          }
        });
      });
    },
    deleteBook: (_, { id }) => {
      return new Promise((resolve, reject) => {
        db.run('DELETE FROM books WHERE id = ?', [id], function (err) {
          if (err) {
            reject(err);
          } else if (this.changes === 0) {
            reject(new Error('Book not found'));
          } else {
            resolve(true);
          }
        });
      });}
  },
};
module.exports = resolvers;
