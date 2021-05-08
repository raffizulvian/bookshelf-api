const {
  addBook,
  getBooks,
  editBookByID,
  deleteBookByID,
} = require('./handler');

// TODO: tambahkan route untuk menangani 404
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
  {
    method: '*',
    path: '/{any*}',
    handler: () => {},
  },
];

module.exports = routes;
