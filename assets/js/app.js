// ===== Elements =====
const cabinetArea = document.getElementById('cabinetArea');
const shelvesEl   = document.getElementById('shelves');

const enterBtn  = document.getElementById('enterBtn');
const doorLeft  = document.getElementById('doorLeft');
const doorRight = document.getElementById('doorRight');

const bookModal = document.getElementById('bookModal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');

// ===== Open doors (glass windows) =====
function openCabinet(){ cabinetArea?.classList.add('open'); }
enterBtn?.addEventListener('click', openCabinet);
doorLeft?.addEventListener('click', openCabinet);
doorRight?.addEventListener('click', openCabinet);

// ===== Load shelves/books from JSON (relative path for project sites) =====
fetch('./data/books.json')
  .then(r => r.json())
  .then(renderShelves)
  .catch(err => { console.error('Failed to load books.json', err); fallbackShelves(); });

function renderShelves(data){
  shelvesEl.innerHTML = '';
  (data.shelves || []).forEach(shelf => {
    const shelfEl = document.createElement('div');
    shelfEl.className = 'shelf';

    const plaque = document.createElement('div');
    plaque.className = 'plaque';
    plaque.textContent = shelf.title || '';
    shelfEl.appendChild(plaque);

    (shelf.books || []).forEach(book => {
      const b = document.createElement('button');
      b.className = `book ${book.style || ''}`;
      b.dataset.book = book.id || '';
      b.innerHTML = `<span>${book.title || 'Untitled'}</span><span class="by"> • ${book.author || 'Unknown'}</span>`;
      b.addEventListener('click', () => openBook(book));
      shelfEl.appendChild(b);
    });

    shelvesEl.appendChild(shelfEl);
  });

  resizeBooks();
}

// ===== Fallback shelves if JSON fails =====
function fallbackShelves(){
  renderShelves({
    shelves: [
      { title: 'Vol. I — Beasts', books: [
        { id:'codex-naturalist',  title:'Codex Naturalis',  author:'Hart',   style:'b-nat' },
        { id:'songs-sleepless',   title:'Songs, Sleepless', author:'Ilyas',  style:'b-poe' },
        { id:'unfathomed-things', title:'Unfathomed Things',author:'Merrit', style:'b-sai' }
      ]},
      { title: 'Vol. II — Places & Relics', books: [
        { id:'maps-stolen-twice', title:'Maps Stolen Twice', author:'Fen',    style:'b-rog' }
      ]}
    ]
  });
}

// ===== Modal (book open) =====
function openBook(book){
  modalTitle.textContent = `${book.title || 'Book'} — ${book.author || 'Unknown'}`;
  // TODO: mount page-flip widget in #bookViewport using book.id
  bookModal?.showModal();
}
closeModal?.addEventListener('click', () => bookModal?.close());
bookModal?.addEventListener('click', (e)=>{ if (e.target === bookModal) bookModal.close(); });

// ===== Responsive helpers =====

// Scale the fixed-size cabinet down on small screens, keeping aspect ratio.
// Must match the CSS --cabinet-w/h design size.
function fitCabinet(){
  const baseW = 1100;   // matches --cabinet-w
  const baseH = 620;    // matches --cabinet-h
  const pad   = 40;     // breathing room around cabinet
  if(!cabinetArea) return;

  const availW = Math.max(320, window.innerWidth  - pad*2);
  const availH = Math.max(320, window.innerHeight - 180); // header + spacing
  const scale  = Math.min(availW / baseW, availH / baseH, 1); // never scale up

  cabinetArea.style.transform = `scale(${scale})`;
}

// Normalize book height to shelf height
function resizeBooks(){
  document.querySelectorAll('.shelf').forEach(shelf => {
    const h = shelf.clientHeight;
    shelf.querySelectorAll('.book').forEach(b => {
      b.style.height = Math.max(100, Math.floor(h * 0.9)) + 'px';
    });
  });
}

// Init on load/resize
window.addEventListener('load',  () => { fitCabinet(); resizeBooks(); });
window.addEventListener('resize',() => { fitCabinet(); resizeBooks(); });


enterBtn?.addEventListener('click', ()=> cabinetArea.classList.add('open'));

// (You can also let users click a door group if you want)
// document.querySelectorAll('.door-svg').forEach(d => d.addEventListener('click', ()=> cabinetArea.classList.add('open')));
