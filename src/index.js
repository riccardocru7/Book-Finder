// Importazione di axios e lodash
import axios  from 'axios';
import _ from 'lodash';

// Variabili globali per la paginazione
let startIndex = 0; // Indice di partenza per la paginazione
const maxResults = 10; // Numero di risultati per pagina

// Event listener per il pulsante di ricerca
document.getElementById('searchButton').addEventListener('click', _.debounce(async () => {
  startIndex = 0; // Resetta l'indice per una nuova ricerca
  const category = document.getElementById('category').value.trim();

  console.log("Bottone cliccato! Categoria inserita: ", category);

  if (category) {
    console.log("Inizio ricerca per categoria: ", category);
    document.getElementById('results').innerHTML = ''; // Svuota i risultati precedenti
    await searchBooks(category);
  } else {
    alert("Per favore inserisci una categoria");
    console.error("Nessuna categoria inserita!");
  }
}, 300));

// Event listener per la ricerca tramite il tasto 'Enter'
document.getElementById('category').addEventListener('keydown', _.debounce(async (event) => {
  const category = event.target.value.trim();

  if (event.key === 'Enter') {
    startIndex = 0; // Resetta l'indice per una nuova ricerca
    if (category) {
      console.log("Inizio ricerca per categoria tramite 'Enter': ", category);
      document.getElementById('results').innerHTML = ''; // Svuota i risultati precedenti
      await searchBooks(category);
    } else {
      alert("Per favore inserisci una categoria");
    }
  }
}, 300));

// Funzione per cercare i libri tramite l'API di Google Books
async function searchBooks(category) {
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=subject:${category}&startIndex=${startIndex}&maxResults=${maxResults}`;
  console.log("URL generato: ", apiUrl);

  try {
    const response = await axios.get(apiUrl);
    console.log("Risposta dell'API: ", response);

    if (response.data.items && response.data.items.length > 0) {
      displayBooks(response.data.items);
      startIndex += maxResults;

      const loadMoreContainer = document.getElementById('loadMoreContainer');
      if (loadMoreContainer) {
        document.getElementById('results').appendChild(loadMoreContainer);
      }
    } else {
      alert("Nessun altro libro trovato in questa categoria.");
    }

    // Mostra il pulsante "Carica altri" se ci sono più risultati
    if (response.data.totalItems > startIndex) {
      showLoadMoreButton(category);
    } else {
      hideLoadMoreButton();
    }
  } catch (error) {
    console.error("Errore nel recupero dei dati:", error);
    alert("Errore nel recupero dei dati, riprova.");
  }
}

// Funzione per visualizzare i libri
function displayBooks(books) {
  const resultsDiv = document.getElementById('results');
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

// Funzione per mostrare il pulsante "Carica altri"
function showLoadMoreButton(category) {
  let loadMoreContainer = document.getElementById('loadMoreContainer');

  if (!loadMoreContainer) {
    loadMoreContainer = document.createElement('div');
    loadMoreContainer.id = 'loadMoreContainer';
    loadMoreContainer.style.textAlign = 'center';

    const loadMoreButton = document.createElement('button');
    loadMoreButton.id = 'loadMoreButton';
    loadMoreButton.textContent = 'Carica altri';
    loadMoreButton.addEventListener('click', async () => {
      await searchBooks(category);
      loadMoreContainer.scrollIntoView({ behavior: 'smooth' }); // Scrolla in modo fluido fino al pulsante
    });

    loadMoreContainer.appendChild(loadMoreButton);
    document.getElementById('results').appendChild(loadMoreContainer);
  }
  loadMoreContainer.style.display = 'block';
}

// Funzione per nascondere il pulsante "Carica altri"
function hideLoadMoreButton() {
  const loadMoreButton = document.getElementById('loadMoreButton');
  if (loadMoreButton) {
    loadMoreButton.style.display = 'none';
  }
}

// Funzione per recuperare la descrizione di un libro da Open Library
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

console.log("File JavaScript caricato correttamente!");
