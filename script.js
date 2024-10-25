document.getElementById('searchButton').addEventListener('click', () => {
  const category = document.getElementById('category').value.trim();

  
  console.log("Bottone cliccato! Categoria inserita: ", category);

  
  if (category) {
    console.log("Inizio ricerca per categoria: ", category);
    searchBooks(category);
  } else {
    alert("Per favore inserisci una categoria");
    console.error("Nessuna categoria inserita!");
  }
});

function searchBooks(category) {
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=subject:${category}`;
  console.log("URL generato: ", apiUrl);

  fetch(apiUrl)
    .then(response => {
      console.log("Risposta dell'API: ", response);
      if (!response.ok) {
        throw new Error(`Errore HTTP! Stato: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Dati ricevuti:", data);
      if (data.items && data.items.length > 0) {
        displayBooks(data.items);
      } else {
        alert("Nessun libro trovato in questa categoria.");
      }
    })
    .catch(error => {
      console.error("Errore nel recupero dei dati:", error);
      alert("Errore nel recupero dei dati, riprova.");
    });
}

function displayBooks(books) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';  
  console.log("Visualizzazione dei libri: ", books);

  books.forEach(book => {
    const bookDiv = document.createElement('div');
    bookDiv.className = 'book';
    
    const title = book.volumeInfo.title || "Titolo non disponibile";
    const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Autore non disponibile";
    const thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x198?text=No+Image';
    const description = book.volumeInfo.description ? book.volumeInfo.description : "Descrizione non disponibile";
    
    bookDiv.innerHTML = `
      <img src="${thumbnail}" alt="Copertina di ${title}" />
      <strong>${title}</strong><br>by ${authors}<br>
      <em>${description}</em>
    `;
    bookDiv.addEventListener('click', () => fetchBookDescription(book.id));
    resultsDiv.appendChild(bookDiv);
  });
}


function fetchBookDescription(bookKey) {
  const bookUrl = `https://openlibrary.org${bookKey}.json`;
  console.log("Richiesta della descrizione del libro da: ", bookUrl);  

  fetch(bookUrl)
    .then(response => response.json())
    .then(data => {
      console.log("Dati della descrizione del libro: ", data);
      alert(data.description ? data.description : "Descrizione non disponibile.");
    })
    .catch(error => {
      console.error("Errore nel recupero della descrizione del libro:", error);
    });
}
