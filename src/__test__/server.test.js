const server = require('../server');
const db = require('../books');

beforeAll((done) => {
  server.events.on('start', () => {
    done();
  });
  db.clear();
});

afterAll((done) => {
  server.events.on('stop', () => {
    done();
  });
  server.stop();
});

describe('POST /books', () => {
  describe('Add book with complete data', () => {
    const body = {
      name: 'Buku A',
      year: '2010',
      author: 'John Doe',
      summary: 'Lorem ipsum dolor sit amet',
      publisher: 'Dicoding Indonesia',
      pageCount: 100,
      readPage: 25,
      reading: false,
    };
    const options = {
      method: 'POST',
      url: '/books',
      payload: JSON.stringify(body),
    };

    test('Status code should be 201', async () => {
      const res = await server.inject(options);

      expect(res.statusCode).toBe(201);
    });

    test('Response header Content-Type should be application/json', async () => {
      const res = await server.inject(options);

      expect(res.headers['content-type']).toContain('application/json');
    });

    test('Response body should be an object', async () => {
      const res = await server.inject(options);

      expect(res).toBeInstanceOf(Object);
    });

    test('Response body should have correct property and value', async () => {
      const res = await server.inject(options);

      expect(res.result).toHaveProperty('status');
      expect(res.result).toHaveProperty('message');
      expect(res.result).toHaveProperty('data');

      expect(res.result.status).toEqual('success');
      expect(res.result.message).toEqual('Buku berhasil ditambahkan');
      expect(res.result.data).toBeInstanceOf(Object);
    });

    test('Response boody data should contain bookId', async () => {
      const res = await server.inject(options);
      const { data } = res.result;

      expect(data).toHaveProperty('bookId');
      expect(data.bookId).toBeTruthy();
    });
  });

  describe('Add Book Without Name', () => {
    const body = {
      year: '2010',
      author: 'John Doe',
      summary: 'Lorem ipsum dolor sit amet',
      publisher: 'Dicoding Indonesia',
      pageCount: 100,
      readPage: 25,
      reading: false,
    };
    const options = {
      method: 'POST',
      url: '/books',
      payload: JSON.stringify(body),
    };

    test('Status code should be 400', async () => {
      const res = await server.inject(options);

      expect(res.statusCode).toBe(400);
    });

    test('Response header Content-Type should be application/json', async () => {
      const res = await server.inject(options);

      expect(res.headers['content-type']).toContain('application/json');
    });

    test('Response body should be an object', async () => {
      const res = await server.inject(options);

      expect(res).toBeInstanceOf(Object);
    });

    test('Response body should have correct property and value', async () => {
      const res = await server.inject(options);

      expect(res.result).toHaveProperty('status');
      expect(res.result).toHaveProperty('message');
      expect(res.result).not.toHaveProperty('data');

      expect(res.result.status).toEqual('fail');
      expect(res.result.message).toEqual('Gagal menambahkan buku. Mohon isi nama buku');
    });
  });

  describe('Add Book with Page Read More than Page Count', () => {
    const body = {
      name: 'Buku A',
      year: '2010',
      author: 'John Doe',
      summary: 'Lorem ipsum dolor sit amet',
      publisher: 'Dicoding Indonesia',
      pageCount: 80,
      readPage: 90,
      reading: false,
    };
    const options = {
      method: 'POST',
      url: '/books',
      payload: JSON.stringify(body),
    };

    test('Status code should be 400', async () => {
      const res = await server.inject(options);

      expect(res.statusCode).toBe(400);
    });

    test('Response header Content-Type should be application/json', async () => {
      const res = await server.inject(options);

      expect(res.headers['content-type']).toContain('application/json');
    });

    test('Response body should be an object', async () => {
      const res = await server.inject(options);

      expect(res).toBeInstanceOf(Object);
    });

    test('Response body should have correct property and value', async () => {
      const res = await server.inject(options);

      expect(res.result).toHaveProperty('status');
      expect(res.result).toHaveProperty('message');
      expect(res.result).not.toHaveProperty('data');

      expect(res.result.status).toEqual('fail');
      expect(res.result.message).toEqual('Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount');
    });
  });
});

describe('GET /books', () => {
  describe('Get All Books', () => {
    const options = {
      method: 'GET',
      url: '/books',
    };

    test('Status code should be 200', async () => {
      const res = await server.inject(options);

      expect(res.statusCode).toBe(200);
    });

    test('Response header Content-Type should be application/json', async () => {
      const res = await server.inject(options);

      expect(res.headers['content-type']).toContain('application/json');
    });

    test('Response body should be an object', async () => {
      const res = await server.inject(options);

      expect(res).toBeInstanceOf(Object);
    });

    test('Response body should have correct property and value', async () => {
      const res = await server.inject(options);

      expect(res.result).toHaveProperty('status');
      expect(res.result).toHaveProperty('data');

      expect(res.result.status).toEqual('success');
      expect(res.result.data).toBeInstanceOf(Object);
    });

    test('Response body data object should have an array books and contains one items', async () => {
      const res = await server.inject(options);
      const { data } = res.result;

      expect(data).toHaveProperty('books');
      expect(data.books).toBeInstanceOf(Array);
    });

    test('The books should have contains only id, name, and publisher property', async () => {
      const res = await server.inject(options);
      const { data: { books } } = res.result;

      books.forEach((book) => {
        expect(Object.keys(book)).toHaveLength(3);
        expect(book).toHaveProperty('id');
        expect(book).toHaveProperty('name');
        expect(book).toHaveProperty('publisher');
      });
    });
  });
});
