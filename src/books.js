class Database {
  constructor() {
    this.books = [];
  }

  read() {
    return this.books;
  }

  add(newBook) {
    this.books.push(newBook);
  }

  update(idx, newData) {
    this.books[idx] = newData;
  }

  delete(idx) {
    this.books.splice(idx);
  }

  clear() {
    this.books = [];
  }
}

const db = new Database();

module.exports = db;
