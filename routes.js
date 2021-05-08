const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: (request, h) => {
      return 'POST books';
    },
  },
  {
    method: 'GET',
    path: '/books/{bookid?}',
    handler: (request, h) => {
      const { bookid = '' } = request.params;

      const { name, reading, finished } = request.query;

      return `GET books ${bookid}`;
    },
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
