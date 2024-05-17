const sqlite3 = require('sqlite3').verbose();
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const articleProtoPath = 'article.proto';
const articleProtoDefinition = protoLoader.loadSync(articleProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const articleProto = grpc.loadPackageDefinition(articleProtoDefinition).article;
const db = new sqlite3.Database('./database.db'); 

db.run(`
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY,
    title TEXT,
    description TEXT
  )
`);
const articleService = {
  getArticle: (call, callback) => {
    const { article_id } = call.request;
    
    db.get('SELECT * FROM articles WHERE id = ?', [article_id], (err, row) => {
      if (err) {
        callback(err);
      } else if (row) {
        const article = {
          id: row.id,
          title: row.title,
          description: row.description,
        };
        callback(null, { article });
      } else {
        callback(new Error('Article not found'));
      }
    });
  },
  searchArticles: (call, callback) => {
    db.all('SELECT * FROM articles', (err, rows) => {
      if (err) {
        callback(err);
      } else {
        const articles = rows.map((row) => ({
          id: row.id,
          title: row.title,
          description: row.description,
        }));
        callback(null, { articles });
      }
    });
  },
  CreateArticle: (call, callback) => {
    const { article_id, title, description } = call.request;
    db.run(
      'INSERT INTO articles (id, title, description) VALUES (?, ?, ?)',
      [article_id, title, description],
      function (err) {
        if (err) {
          callback(err);
        } else {
          const article = {
            id: article_id,
            title,
            description,
          };
          callback(null, { article });
        }
      }
    );
  },
};



const server = new grpc.Server();
server.addService(articleProto.ArticleService.service, articleService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to bind server:', err);
      return;
    }
  
    console.log(`Server is running on port ${port}`);
    server.start();
  });
console.log(`Article microservice running on port ${port}`);
