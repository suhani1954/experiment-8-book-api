const API = "/api/books";
const form = document.getElementById("bookForm");
const list = document.getElementById("bookList");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");
let editingId = null;

async function loadBooks() {
  try {
    const response = await fetch(API);
    if (!response.ok) throw new Error();
    const books = await response.json();
    list.replaceChildren();
    books.forEach(book => {
      const card = document.createElement("article");
      card.className = "book";
      const info = document.createElement("p");
      info.textContent = `${book.title} by ${book.author} (${book.year})`;
      const edit = document.createElement("button");
      edit.className = "edit";
      edit.textContent = "Edit";
      edit.onclick = () => {
        editingId = book.id;
        form.elements.title.value = book.title;
        form.elements.author.value = book.author;
        form.elements.year.value = book.year;
        submitBtn.textContent = "Update Book";
      };
      const remove = document.createElement("button");
      remove.className = "delete";
      remove.textContent = "Delete";
      remove.onclick = () => deleteBook(book.id);
      card.append(info, edit, remove);
      list.append(card);
    });
  } catch {
    message.textContent = "Unable to load books. Start the server and refresh.";
  }
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const book = {
    title: form.elements.title.value.trim(),
    author: form.elements.author.value.trim(),
    year: Number(form.elements.year.value)
  };
  try {
    const response = await fetch(editingId ? `${API}/${editingId}` : API, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    message.textContent = data.message;
    form.reset();
    editingId = null;
    submitBtn.textContent = "Add Book";
    loadBooks();
  } catch (error) {
    message.textContent = error.message || "Request failed.";
  }
});

async function deleteBook(id) {
  try {
    const response = await fetch(`${API}/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    message.textContent = data.message;
    loadBooks();
  } catch (error) {
    message.textContent = error.message || "Delete failed.";
  }
}

loadBooks();
