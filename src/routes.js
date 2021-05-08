const {
  addBook,
  getBooks,
  editBookByID,
  deleteBookByID,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBook,
  },
  {
    method: 'GET',
    path: '/books/{bookId?}',
    handler: getBooks,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByID,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByID,
  },
];

module.exports = routes;
