import axios from 'axios';
import _ from 'lodash';

// Evento al click del bottone di ricerca
document.getElementById('searchButton').addEventListener('click', async () => {
  const category = document.getElementById('category').value.trim();
  
  console.log("Bottone cliccato! Categoria inserita: ", category);
  
  if (category) {
    console.log("Inizio ricerca per categoria: ", category);
    await searchBooks(category); // Usa la funzione searchBooks con async/await
  } else {
    alert("Per favore inserisci una categoria");
    console.error("Nessuna categoria inserita!");
  }
});

// Evento di input nel campo di ricerca senza debounce
document.getElementById('category').addEventListener('input', async () => {
  const category = document.getElementById('category').value.trim();
  if (category) {
    await searchBooks(category); // Usa la funzione searchBooks con async/await
  }
});

// Evento per avviare la ricerca con 'Enter'
document.getElementById('category').addEventListener('keydown', async (event) => {
  const category = event.target.value.trim();

  if (event.key === 'Enter') {  
    if (category) {
      await searchBooks(category); // Usa la funzione searchBooks con async/await
    } else {
      alert("Per favore inserisci una categoria");
    }
  }
});

// Funzione di ricerca libri tramite API
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

// Funzione per visualizzare i libri
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

    if (book.id) {
      bookDiv.addEventListener('click', () => fetchBookDescription(book.id));
    } else {
      console.warn(`Nessun ID disponibile per il libro: ${title}`);
    }

    resultsDiv.appendChild(bookDiv);
  });
}

// Funzione per ottenere la descrizione del libro
function fetchBookDescription(bookKey) {
  const bookUrl = `https://openlibrary.org${bookKey}.json`;

  try {
    axios.get(bookUrl)
      .then(response => {
        alert(response.data.description ? response.data.description : "Descrizione non disponibile.");
      })
      .catch(error => {
        console.error("Errore nel recupero della descrizione del libro:", error);
        alert("Impossibile recuperare la descrizione del libro. Riprova più tardi.");
      });
  } catch (error) {
    console.error("Errore nella funzione fetchBookDescription:", error);
    alert("Errore inatteso durante il recupero della descrizione del libro.");
  }
}
