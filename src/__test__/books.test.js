const db = require('../books');

beforeAll(() => {
  db.books = [];
});

afterAll(() => {
  db.books = [];
});

describe('Database Class', () => {
  const objectTemplate = {
    name: expect.any(String),
    year: expect.any(Number),
    author: expect.any(String),
    summary: expect.any(String),
    publisher: expect.any(String),
    pageCount: expect.any(Number),
    readPage: expect.any(Number),
    reading: expect.any(Boolean),
  };
  const newBook = {
    name: 'Harry Potter and The Prisoner of Azkaban',
    year: 1999,
    author: 'J.K. Rowling',
    summary: 'Buku seri ketiga Harry Potter',
    publisher: 'Panda Kodok',
    pageCount: 24,
    readPage: 16,
    reading: true,
  };
  const updatedBook = {
    name: 'Harry Potter and The Prisoner of Azkaban',
    year: 1999,
    author: 'J.K. Rowling',
    summary: 'Buku seri ketiga Harry Potter',
    publisher: 'Gramedia Pustaka Utama',
    pageCount: 8,
    readPage: 2,
    reading: true,
  };
  let id;

  test('Database should be able to receive new data', () => {
    const response = db.add(newBook);
    const books = db.read();

    expect(response).toBe(true);

    expect(books).toBeInstanceOf(Array);
    expect(books).toHaveLength(1);
    expect(books[0]).toMatchObject(objectTemplate);
  });

  test('Database should be able to give all the data', () => {
    const books = db.read();

    expect(books).toBeInstanceOf(Array);

    books.forEach((book) => {
      expect(book).toMatchObject(objectTemplate);
    });
  });

  test('Database should be able to update data', () => {
    db.update(0, updatedBook);

    const books = db.read();
    id = books.id;

    expect(books).toBeInstanceOf(Array);
    expect(books).toHaveLength(1);

    books.forEach((book) => {
      expect(book).toMatchObject(objectTemplate);
    });
  });

  test('Database should be able to give index of book by ID', () => {
    const idx = db.findIdx(id);

    expect(typeof idx).toBe('number');
    expect(idx).not.toBe(-1);
  });

  test('Database should be able to give data of bool by ID', () => {
    const book = db.find(id);

    expect(book).toMatchObject(objectTemplate);
  });

  test('Database should be able to delete some of the data', () => {
    db.delete(0);

    const books = db.read();

    expect(books).toBeInstanceOf(Array);
    expect(books).toHaveLength(0);
  });

  test('Database should clear all of its data', () => {
    db.add(newBook);
    db.add(updatedBook);
    db.clear();

    const books = db.read();

    expect(books).toBeInstanceOf(Array);
    expect(books).toHaveLength(0);
  });
});
