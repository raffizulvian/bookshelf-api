const { addBook, getBooks, editBookByID } = require('./handler');

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
    handler: (request, h) => {
      const { bookid } = request.params;
      return `DELETE books ${bookid}`;
    },
  },
];

module.exports = routes;
