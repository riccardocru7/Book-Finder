document.getElementById('searchButton').addEventListener('click', _.debounce(async () => {
  const category = document.getElementById('category').value.trim();

  console.log("Bottone cliccato! Categoria inserita: ", category);

  if (category) {
    console.log("Inizio ricerca per categoria: ", category);
    await searchBooks(category);
  } else {
    alert("Per favore inserisci una categoria");
    console.error("Nessuna categoria inserita!");
  }
}, 300)); 

document.getElementById('category').addEventListener('keydown', _.debounce(async (event) => {
  const category = event.target.value.trim();

  if (event.key === 'Enter') {
    if (category) {
      console.log("Inizio ricerca per categoria tramite 'Enter': ", category);
      await searchBooks(category);
    } else {
      alert("Per favore inserisci una categoria");
    }
  }
}, 300)); 

async function searchBooks(category) {
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=subject:${category}`;
  console.log("URL generato: ", apiUrl);

  try {
    const response = await axios.get(apiUrl);
    console.log("Risposta dell'API: ", response);
    if (response.data.items && response.data.items.length > 0) {
      displayBooks(response.data.items);
    } else {
      alert("Nessun libro trovato in questa categoria.");
    }
  } catch (error) {
    console.error("Errore nel recupero dei dati:", error);
    alert("Errore nel recupero dei dati, riprova.");
  }
}

function displayBooks(books) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  books.forEach(book => {
    const bookDiv = document.createElement('div');
    bookDiv.className = 'book';

    const title = book.volumeInfo.title || "Titolo non disponibile";
    const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Autore non disponibile";
    const thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x198?text=No+Image';
    const description = book.volumeInfo.description ? book.volumeInfo.description : "Descrizione non disponibile";

    bookDiv.innerHTML = `
      <img src="${thumbnail}" alt="Copertina di ${title}" class="book-thumbnail"/>
      <strong class="book-title">${title}</strong><br>
      <span class="book-authors">${authors}</span><br>
      <p class="book-description">${description}</p>
    `;

    bookDiv.addEventListener('click', () => fetchBookDescription(title, authors));

    resultsDiv.appendChild(bookDiv);
  });
}

async function fetchBookDescription(title, authors) {
  const apiUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(authors)}`;

  try {
    const response = await axios.get(apiUrl);
    console.log("Risposta dell'API Open Library:", response);

    if (response.data.docs && response.data.docs.length > 0) {
      const firstMatch = response.data.docs[0];
      const description = firstMatch.description ? firstMatch.description : "Descrizione non disponibile.";
      alert(description);
    } else {
      alert("Descrizione non disponibile su Open Library.");
    }
  } catch (error) {
    console.error("Errore nel recupero della descrizione del libro:", error);
    alert("Impossibile recuperare la descrizione del libro. Riprova più tardi.");
  }
}
