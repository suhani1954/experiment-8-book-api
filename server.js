const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

let books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", year: 1988 },
  { id: 2, title: "Atomic Habits", author: "James Clear", year: 2018 }
];

app.get("/", (req, res) => res.sendFile(__dirname + "/experiment_8_index.html"));
app.get("/api/books", (req, res) => res.json(books));

app.get("/api/books/:id", (req, res) => {
  const book = books.find(item => item.id === Number(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
});

app.post("/api/books", (req, res) => {
  const { title, author, year } = req.body;
  if (typeof title !== "string" || !title.trim() ||
      typeof author !== "string" || !author.trim() ||
      !Number.isInteger(year) || year < 1)
    return res.status(400).json({ message: "Enter valid book details" });
  const book = {
    id: books.length ? Math.max(...books.map(item => item.id)) + 1 : 1,
    title: title.trim(), author: author.trim(), year
  };
  books.push(book);
  res.status(201).json({ message: "Book added successfully", book });
});

app.put("/api/books/:id", (req, res) => {
  const book = books.find(item => item.id === Number(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });
  const { title, author, year } = req.body;
  if (typeof title !== "string" || !title.trim() ||
      typeof author !== "string" || !author.trim() ||
      !Number.isInteger(year) || year < 1)
    return res.status(400).json({ message: "Enter valid book details" });
  Object.assign(book, { title: title.trim(), author: author.trim(), year });
  res.json({ message: "Book updated successfully", book });
});

app.delete("/api/books/:id", (req, res) => {
  const index = books.findIndex(item => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Book not found" });
  const [book] = books.splice(index, 1);
  res.json({ message: "Book deleted successfully", book });
});

app.listen(PORT, "0.0.0.0", () => console.log(`Book API running on port ${PORT}`));
