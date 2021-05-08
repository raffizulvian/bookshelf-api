const { nanoid } = require('nanoid');
const books = require('./books');

/**
 * Menangani permintaan HTTP 'POST' dan menambahkan info buku baru ke penyimpanan data
 * @requires nanoid
 * @param {Object} request
 * @param {Object} h
 * @returns {Object} HTTP response
 */
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

/**
 * Menangani permintaan untuk mengembalikan daftar buku dengan mencari kecocokan antara query
 * dengan nama buku. Daftar yyang akan ditampilkan adalah daftar buku-uku yang pada namanya
 * mengandung query yang diberikan. Query yang diberikan bersifat non-case sensitive.
 * @param {Object} h
 * @param {string} nameQuery
 * @returns {Object} HTTP response
 */
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

/**
 * Menangani permintaan untuk mengembalikan daftar buku dengan query berdasarkan status buku apakah
 * sedang dibaca atau tidak. Bila query bernilai '1', maka akan mengembalikan buku yang sedang
 * dibaca. Bila query bernilai 0, maka akan mengembalikan daftar buku yang tidak sedang dibaca.
 * @param {Object} h
 * @param {string} readingQuery - '1' atau '0'
 * @returns {Object} HTTP response
 */
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

/**
 * Menangani permintaan untuk mengembalikan daftar buku dengan query berdasarkan status buku apakah
 * telah selesai dibaca atau belum. Bila query bernilai '1', maka akan mengembalikan buku yang telah
 * selesai dibaca. Bila query bernilai 0, maka akan mengembalikan daftar buku yang belum selesai
 * dibaca.
 * @param {Object} h
 * @param {string} finishedQuery - '1' atau '0'
 * @returns {Object} HTTP response
 */
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

/**
 * Menangani permintaan untuk mengembalikan daftar buku yang tersimpan.
 * @param {Object} h
 * @param {Object} query
 * @returns {Object} HTTP response
 */
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

/**
 * Menangani permintaan untuk mengembalikan info buku dengan bookId yang spesifik.
 * @param {Object} h
 * @param {Object} bookToSent
 * @returns {Object} HTTP response
 */
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

/**
 * Menangani permintaan HTTP 'GET' dan akan mengembalikan daftar buku yang tersimpan dalam
 * penyimpanan data. Keluaran dapat berupa info tentang suatu buku yang spesifik dengan menyertakan
 * parameter bookId pada URL. Pengguna juga dapat menggunakan query untuk mendapatkan daftar buku
 * berdasarkan nama (?name), buku yang sedang dibaca (?reading), ataupun buku yang telah selesai
 * dibaca (?finished).
 * @param {Object} request
 * @param {Object} h
 * @returns {Object} HTTP response
 */
const getBooks = (request, h) => {
  const { bookId } = request.params;
  const { query } = request;

  if (bookId === undefined) {
    return getAllBooks(h, query);
  }

  const bookToSent = books.filter((book) => book.id === bookId)[0];
  return getBookByID(h, bookToSent);
};

/**
 * Menangani permintaan HTTP 'PUT' dan melakuakan perubahan info dari suatu buku dengan bookId
 * spesifik.
 * @param {Object} request
 * @param {Object} h
 * @returns {Object} HTTP response
 */
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

/**
 * Menangani permintaan HTTP 'DELETE' dan menghapus info buku dengan bookId spesifik.
 * @param {Object} request
 * @param {Object} h
 * @returns {Object} HTTP response
 */
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
