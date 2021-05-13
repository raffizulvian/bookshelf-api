class Database {
  constructor() {
    this.books = [];
  }

  /**
   * Digunakan untuk mengakses daftar buku
   * @returns {Array}
   */
  read() {
    return this.books;
  }

  /**
   * Menambahkan data baru pada daftar buku
   * @param {Object} newBook
   * @returns {Boolean} status apakah buku berhasil ditambahkan
   */
  add(newBook) {
    this.books.push(newBook);
    return this.find(newBook.id) !== -1;
  }

  /**
   * Melakukan perubahan informasi pada buku tertentu
   * @param {Number} idx
   * @param {Object} newData
   */
  update(idx, newData) {
    this.books[idx] = {
      ...this.books[idx],
      ...newData,
    };
  }

  /**
   * Menghapus buku tertentu dari daftar buku
   * @param {Number} idx
   */
  delete(idx) {
    this.books.splice(idx);
  }

  /**
   * Melakukan pencarian indeks buku berdasarkan bookId yang ada
   * @param {String} bookId
   * @returns {Number} indeks dari buku yang dicari, -1 jika buku tidak ada
   */
  findIdx(bookId) {
    return this.books.findIndex((book) => book.id === bookId);
  }

  /**
   * Melakukan pencarian buku berdasarkan bookId yang ada
   * @param {String} bookId
   * @returns {Number} buku yang dicari, undifined jika buku tidak ada
   */
  find(bookId) {
    return this.books.filter((book) => book.id === bookId)[0];
  }

  /**
   * Mengosongkan daftar buku
   */
  clear() {
    this.books = [];
  }
}

const db = new Database();

module.exports = db;
