const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name === undefined) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (!isSuccess) {
    return h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    }).code(500);
  }

  return h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  }).code(201);
};

const getBooksByName = (h, nameQuery) => {
  const nameRegexPattern = new RegExp(nameQuery, 'i');
  const filteredBooks = books.filter((book) => (
    nameRegexPattern.test(book.name)
  ));

  return h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  }).code(200);
};

const getBookByReading = (h, readingQuery) => {
  const filteredBooks = books.filter((book) => (
    readingQuery === '1' ? book.reading === true : book.reading === false
  ));

  return h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  }).code(200);
};

const getBookByFinished = (h, finishedQuery) => {
  const filteredBooks = books.filter((book) => (
    finishedQuery === '1' ? book.finished === true : book.finished === false
  ));

  return h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  }).code(200);
};

const getAllBooks = (h, query) => {
  if (query.name !== undefined) {
    return getBooksByName(h, query.name);
  }

  if (query.reading !== undefined) {
    return getBookByReading(h, query.reading);
  }

  if (query.finished !== undefined) {
    return getBookByFinished(h, query.finished);
  }

  return h.response({
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  }).code(200);
};

const getBookByID = (h, bookToSent) => {
  if (bookToSent === undefined) {
    return h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }).code(404);
  }

  return h.response({
    status: 'success',
    data: {
      book: bookToSent,
    },
  }).code(200);
};

const getBooks = (request, h) => {
  const { bookId } = request.params;
  const { query } = request;

  if (bookId === undefined) {
    return getAllBooks(h, query);
  }

  const bookToSent = books.filter((book) => book.id === bookId)[0];
  return getBookByID(h, bookToSent);
};

const editBookByID = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name === undefined) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const idx = books.findIndex((book) => book.id === bookId);

  if (idx === -1) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
  }

  const updatedAt = new Date().toISOString();

  books[idx] = {
    ...books[idx],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  }).code(200);
};

const deleteBookByID = (request, h) => {
  const { bookId } = request.params;

  const idx = books.findIndex((book) => book.id === bookId);

  if (idx === -1) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
  }

  books.splice(idx);
  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  }).code(200);
};

module.exports = {
  addBook, getBooks, editBookByID, deleteBookByID,
};
