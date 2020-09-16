const DatabaseURL = `mongodb+srv://${process.env.DbUserName}:${process.env.DbPassword}@cluster0.f7k8g.mongodb.net/${process.env.DbName}?retryWrites=true&w=majority`;

module.exports = {
  mongoURI: DatabaseURL,
};
