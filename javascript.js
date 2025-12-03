// ...existing code...
// Minimal, complete library script:
// - Book constructor with crypto.randomUUID()
// - addBookToLibrary(), removeBook(), toggleRead()
// - renderLibrary(), createTableHeader(), createBookRow()
// - setupControls() with a form using event.preventDefault()

// In-memory storage
const library = [];

// Book constructor
function Book(title, author, year = '', pages = 0, read = false) {
  this.id =
    crypto && crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString(36) + Math.random().toString(36).slice(2);
  this.title = title;
  this.author = author;
  this.year = year;
  this.pages = pages;
  this.read = !!read;
}

// Prototype method to toggle read status
Book.prototype.toggleRead = function () {
  this.read = !this.read;
};

// Add a book (separate from constructor)
function addBookToLibrary(title, author, year = '', pages = 0, read = false) {
  const book = new Book(title, author, year, pages, read);
  library.push(book);
  renderLibrary();
  return book;
}

// Remove by id
function removeBook(id) {
  const idx = library.findIndex((b) => b.id === id);
  if (idx !== -1) {
    library.splice(idx, 1);
    renderLibrary();
  }
}

// Toggle read by id (uses prototype method)
function toggleRead(id) {
  const b = library.find((x) => x.id === id);
  if (b) {
    b.toggleRead();
    renderLibrary();
  }
}

// Ensure root container exists (#app-root in index.html)
function ensureContainers() {
  let container = document.getElementById('app-root');
  if (!container) {
    container = document.createElement('div');
    container.id = 'app-root';
    document.body.appendChild(container);
  }
  return { container };
}

function createTableHeader() {
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Title</th>
      <th>Author</th>
      <th class="center">Year</th>
      <th class="center">Pages</th>
      <th class="center">Read</th>
      <th class="center">Actions</th>
    </tr>
  `;
  return thead;
}

function createBookRow(book) {
  const tr = document.createElement('tr');
  tr.dataset.id = book.id;

  tr.innerHTML = `
    <td>${escapeHtml(book.title)}</td>
    <td>${escapeHtml(book.author)}</td>
    <td class="center">${book.year || ''}</td>
    <td class="center">${book.pages}</td>
    <td class="center"></td>
    <td class="center"></td>
  `;

  // Read Button
  const readBtn = document.createElement('button');
  readBtn.classList.add('read-btn');
  readBtn.textContent = book.read ? 'Yes' : 'No';
  readBtn.addEventListener('click', () => toggleRead(book.id));
  tr.children[4].appendChild(readBtn);

  // Delete Button
  const delBtn = document.createElement('button');
  delBtn.classList.add('delete-btn');
  delBtn.textContent = 'Remove';
  delBtn.addEventListener('click', () => removeBook(book.id));
  tr.children[5].appendChild(delBtn);

  return tr;
}

function setupControls(container) {
  let controls = document.getElementById('library-controls');
  if (!controls) {
    controls = document.createElement('div');
    controls.id = 'library-controls';
    container.prepend(controls);
  }

  if (controls.querySelector('#newBookBtn')) return; // idempotent

  const newBookBtn = document.createElement('button');
  newBookBtn.id = 'newBookBtn';
  newBookBtn.textContent = 'New Book';
  controls.appendChild(newBookBtn);

  const formWrapper = document.createElement('div');
  formWrapper.id = 'newBookFormWrapper';
  formWrapper.style.display = 'none';
  formWrapper.style.marginTop = '8px';
  controls.appendChild(formWrapper);

  formWrapper.innerHTML = `
    <form id="newBookForm">
      <div><label>Title<br><input name="title" required></label></div>
      <div><label>Author<br><input name="author" required></label></div>
      <div><label>Year<br><input name="year" type="number"></label></div>
      <div><label>Pages<br><input name="pages" type="number"></label></div>
      <div><label><input name="read" type="checkbox"> Read</label></div>
      <div style="margin-top:8px;">
        <button type="submit">Add Book</button>
        <button type="button" id="cancelNewBook">Cancel</button>
      </div>
    </form>
  `;

  newBookBtn.addEventListener('click', () => {
    formWrapper.style.display =
      formWrapper.style.display === 'none' ? 'block' : 'none';
  });

  const form = formWrapper.querySelector('#newBookForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // prevents page reload / form submission
    const fd = new FormData(form);
    const title = String(fd.get('title') || '').trim();
    const author = String(fd.get('author') || '').trim();
    const year = fd.get('year') ? Number(fd.get('year')) : '';
    const pages = fd.get('pages') ? Number(fd.get('pages')) : 0;
    const read = fd.get('read') === 'on';
    if (!title || !author) {
      alert('Please provide title and author.');
      return;
    }
    addBookToLibrary(title, author, year, pages, read);
    form.reset();
    formWrapper.style.display = 'none';
  });

  formWrapper.querySelector('#cancelNewBook').addEventListener('click', () => {
    form.reset();
    formWrapper.style.display = 'none';
  });
}

function renderLibrary() {
  const { container } = ensureContainers();

  // Remove previous table/messages but keep controls
  container.querySelectorAll('table, .no-books-msg').forEach((n) => n.remove());

  if (library.length === 0) {
    const msg = document.createElement('p');
    msg.className = 'no-books-msg';
    msg.textContent = "No books in your library. Click 'New Book' to add one.";
    container.appendChild(msg);
    setupControls(container);
    return;
  }

  const table = document.createElement('table');
  table.classList.add('library-table');

  const tbody = document.createElement('tbody');
  library.forEach((book) => tbody.appendChild(createBookRow(book)));

  table.appendChild(createTableHeader());
  table.appendChild(tbody);
  container.appendChild(table);

  setupControls(container);
}

// simple HTML escape
function escapeHtml(str) {
  return String(str).replace(
    /[&<>"']/g,
    (s) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[
        s
      ])
  );
}

// Seed data for testing
addBookToLibrary('The Great Gatsby', 'F. Scott Fitzgerald', 1925, 218, true);
addBookToLibrary('1984', 'George Orwell', 1949, 328, false);

// Initial render
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderLibrary);
} else {
  renderLibrary();
}
