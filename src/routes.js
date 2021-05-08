const { addBook } = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBook,
  },
  {
    method: 'GET',
    path: '/books/{bookid?}',
    handler: () => {},
  },
  {
    method: 'PUT',
    path: '/books/{bookid}',
    handler: (request, h) => {
      const { bookid } = request.params;
      return `PUT books ${bookid}`;
    },
  },
  {
    method: 'DELETE',
    path: '/books/{bookid}',
    handler: (request, h) => {
      const { bookid } = request.params;
      return `DELETE books ${bookid}`;
    },
  },
];

module.exports = routes;
