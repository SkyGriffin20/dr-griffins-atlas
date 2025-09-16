// Elements
const door = document.getElementById('door');
const enterBtn = document.getElementById('enterBtn');
const shelvesEl = document.getElementById('shelves');
const bookModal = document.getElementById('bookModal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');

// Door open
enterBtn?.addEventListener('click', () => door?.setAttribute('data-open','true'));
door?.addEventListener('click', (e) => {
  if (e.target === door || e.target.classList.contains('door-inner')) {
    door.setAttribute('data-open','true');
  }
});

// Load shelves from JSON (relative path for project sites)
fetch('./data/books.json')
  .then(r => r.json())
  .then(renderShelves)
  .catch(err => { console.error('Failed to load books.json', err); fallbackShelves(); });

function renderShelves(data){
  shelvesEl.innerHTML = '';
  data.shelves.forEach((shelf) => {
    const shelfEl = document.createElement('div');
    shelfEl.className = 'shelf';

    const plaque = document.createElement('div');
    plaque.className = 'plaque';
    plaque.textContent = shelf.title;
    shelfEl.appendChild(plaque);

    shelf.books.forEach(book => {
      const b = document.createElement('button');
      b.className = `book ${book.style || ''}`;
      b.dataset.book = book.id;
      b.innerHTML = `<span>${book.title}</span><span class="by"> • ${book.author}</span>`;
      b.addEventListener('click', () => openBook(book));
      shelfEl.appendChild(b);
    });

    shelvesEl.appendChild(shelfEl);
  });
  resizeBooks();
}

// Fallback if JSON fails
function fallbackShelves(){
  renderShelves({
    shelves: [
      { title: 'Vol. I — Beasts', books: [
        { id:'codex-naturalist', title:'Codex Naturalis', author:'Hart', style:'b-nat' },
        { id:'songs-sleepless', title:'Songs, Sleepless', author:'Ilyas', style:'b-poe' },
        { id:'unfathomed-things', title:'Unfathomed Things', author:'Merrit', style:'b-sai' }
      ]},
      { title: 'Vol. II — Places & Relics', books: [
        { id:'maps-stolen-twice', title:'Maps Stolen Twice', author:'Fen', style:'b-rog' }
      ]}
    ]
  });
}

// Modal logic
function openBook(book){
  modalTitle.textContent = `${book.title} — ${book.author}`;
  // Future: mount page-flip widget in #bookViewport based on book.id
  bookModal.showModal();
}
closeModal?.addEventListener('click', () => bookModal.close());
bookModal?.addEventListener('click', (e) => { if (e.target === bookModal) bookModal.close(); });

// Responsive: normalize book height to shelf
function resizeBooks(){
  document.querySelectorAll('.shelf').forEach(shelf => {
    const h = shelf.clientHeight;
    shelf.querySelectorAll('.book').forEach(b => {
      b.style.height = Math.max(100, Math.floor(h * 0.9)) + 'px';
    });
  });
}
window.addEventListener('resize', resizeBooks);
window.addEventListener('load', resizeBooks);
