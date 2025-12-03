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
~function createBookRow(book) {
  const tr = document.createElement('tr');
  tr.dataset.id = book.id;

  tr.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td class="center">${book.year}</td>
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
};

function renderLibrary() {
  const { container } = ensureContainers();

  container
    .querySelectorAll('.book-card, table, .no-books-msg')
    .forEach((node) => node.remove());

  if (library.length === 0) {
    const msg = document.createElement('p');
    msg.className = 'no-books-msg';
    msg.textContent = "No books in your library. Click 'New Book' to add one.";
    container.appendChild(msg);
    return;
  }

  const table = document.createElement('table');
  table.classList.add('library-table');

  const tbody = document.createElement('tbody');
  library.forEach((book) => tbody.appendChild(createBookRow(book)));

  table.appendChild(createTableHeader());
  table.appendChild(tbody);
  container.appendChild(table);

  setupControls();
}
