(function () {
  const VIEW_HOME = 'view-home';
  const VIEW_BOOKS = 'view-books';
  const VIEW_ALBUMS = 'view-albums';
  const VIEW_PLAY = 'view-play';
  const VIEW_DONE = 'view-done';

  let booksData = [];
  let mode = 'study'; // 'study' | 'test'
  let currentBook = null;
  let currentAlbum = null;
  let items = [];
  let currentIndex = 0;
  let countdownTimer = null;
  let countdownValue = 0;

  const viewHome = document.getElementById('view-home');
  const viewBooks = document.getElementById('view-books');
  const viewAlbums = document.getElementById('view-albums');
  const viewPlay = document.getElementById('view-play');
  const viewDone = document.getElementById('view-done');
  const listBooks = document.getElementById('list-books');
  const listAlbums = document.getElementById('list-albums');
  const playWord = document.getElementById('play-word');
  const playMeaning = document.getElementById('play-meaning');
  const playCountdown = document.getElementById('play-countdown');
  const doneText = document.getElementById('done-text');

  const btnInnerBack = document.getElementById('btn-inner-back');

  function showView(viewId) {
    [viewHome, viewBooks, viewAlbums, viewPlay, viewDone].forEach(v => {
      v.classList.toggle('hidden', v.id !== viewId);
    });
    if (viewId === VIEW_HOME) {
      btnInnerBack.classList.add('hidden');
    } else {
      btnInnerBack.classList.remove('hidden');
      if (viewId === VIEW_BOOKS) btnInnerBack.onclick = goHome;
      else if (viewId === VIEW_ALBUMS) btnInnerBack.onclick = () => showView(VIEW_BOOKS);
      else if (viewId === VIEW_PLAY || viewId === VIEW_DONE) {
        btnInnerBack.onclick = () => {
          stopCountdown();
          showView(VIEW_ALBUMS);
        };
      }
    }
  }

  function parseLine(line) {
    const sep = line.indexOf('&&&') >= 0 ? '&&&' : '|';
    const i = line.indexOf(sep);
    if (i < 0) return { word: line.trim(), meaning: '' };
    return {
      word: line.substring(0, i).trim(),
      meaning: line.substring(i + sep.length).trim()
    };
  }

  function parseBook(raw) {
    const book = { title: raw.title, albums: [] };
    const booksObj = raw.books || {};
    Object.keys(booksObj).forEach(albumTitle => {
      const lines = booksObj[albumTitle];
      if (!Array.isArray(lines)) return;
      const dataItems = lines.map(l => {
        const p = parseLine(l);
        return { word: p.word, meaning: p.meaning, cutted: false };
      });
      book.albums.push({ title: albumTitle, dataItems });
    });
    return book;
  }

  function getNoCutDatas(album) {
    return album.dataItems.filter(item => !item.cutted);
  }

  function goHome() {
    mode = '';
    currentBook = null;
    currentAlbum = null;
    showView(VIEW_HOME);
  }

  function renderBooks() {
    listBooks.innerHTML = '';
    if (booksData.length === 0) {
      const li = document.createElement('li');
      li.className = 'mc-empty-tip';
      li.textContent = '暂无书籍。';
      listBooks.appendChild(li);
      return;
    }
    booksData.forEach((book, index) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mc-list-item';
      btn.textContent = book.title;
      btn.addEventListener('click', () => {
        currentBook = book;
        renderAlbums();
        showView(VIEW_ALBUMS);
      });
      li.appendChild(btn);
      listBooks.appendChild(li);
    });
  }

  function renderAlbums() {
    listAlbums.innerHTML = '';
    const sorted = [...currentBook.albums].sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
    );
    sorted.forEach(album => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mc-list-item mc-album-item';
      btn.innerHTML =
        '<span class="mc-album-title">' + escapeHtml(album.title) + '</span>' +
        '<span class="mc-album-count">(' + album.dataItems.length + ')个</span>';
      btn.addEventListener('click', () => {
        currentAlbum = album;
        startPlay();
      });
      li.appendChild(btn);
      listAlbums.appendChild(li);
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function startPlay() {
    items = getNoCutDatas(currentAlbum).map(item => ({ ...item }));
    currentIndex = 0;
    if (items.length === 0) {
      doneText.textContent = '本类别没有可学习的卡片。';
      showView(VIEW_DONE);
      return;
    }
    if (mode === 'test') {
      shuffleArray(items);
    }
    showView(VIEW_PLAY);
    showCurrentCard();
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function showCurrentCard() {
    const item = items[currentIndex];
    if (!item) {
      doneText.textContent = '没有了。';
      showView(VIEW_DONE);
      return;
    }
    playMeaning.classList.add('hidden');
    playCountdown.classList.add('hidden');
    playWord.textContent = item.word;
    if (mode === 'study') {
      playMeaning.textContent = item.meaning;
      playMeaning.classList.remove('hidden');
    } else {
      playMeaning.textContent = item.meaning;
      playMeaning.classList.add('hidden');
      startCountdown();
    }
  }

  function startCountdown() {
    stopCountdown();
    countdownValue = 8;
    playCountdown.textContent = String(countdownValue);
    playCountdown.classList.remove('hidden');
    countdownTimer = setInterval(() => {
      countdownValue--;
      playCountdown.textContent = String(countdownValue);
      if (countdownValue <= 0) {
        stopCountdown();
      }
    }, 1000);
  }

  function stopCountdown() {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
    playCountdown.classList.add('hidden');
  }

  function onPlayCardTap() {
    if (mode === 'test' && playMeaning.classList.contains('hidden')) {
      stopCountdown();
      playMeaning.classList.remove('hidden');
    }
  }

  function nextCard() {
    const item = items[currentIndex];
    if (item) {
      const orig = currentAlbum.dataItems.find(
        d => d.word === item.word && d.meaning === item.meaning
      );
      if (orig) orig.cutted = true;
    }
    currentIndex++;
    if (currentIndex >= items.length) {
      doneText.textContent = '没有了。';
      showView(VIEW_DONE);
      return;
    }
    showCurrentCard();
  }

  function cutCard() {
    const item = items[currentIndex];
    if (item) {
      const orig = currentAlbum.dataItems.find(
        d => d.word === item.word && d.meaning === item.meaning
      );
      if (orig) orig.cutted = true;
    }
    playWord.textContent = 'KO';
    playMeaning.classList.add('hidden');
    stopCountdown();
    playCountdown.classList.add('hidden');
  }

  document.getElementById('btn-next').addEventListener('click', nextCard);
  document.getElementById('btn-cut').addEventListener('click', cutCard);
  document.getElementById('btn-done-back').addEventListener('click', () => {
    showView(VIEW_ALBUMS);
  });

  document.getElementById('play-card').addEventListener('click', onPlayCardTap);

  window.addEventListener('popstate', () => {
    if (viewPlay.classList.contains('hidden') === false) {
      stopCountdown();
    }
  });

  (function initBooks() {
    var raw = typeof window !== 'undefined' && window.__MC_BOOKS_RAW__;
    if (raw != null) {
      booksData = Array.isArray(raw) ? raw.map(parseBook) : [parseBook(raw)];
    }
  })();

  document.getElementById('btn-study').addEventListener('click', () => {
    mode = 'study';
    renderBooks();
    showView(VIEW_BOOKS);
  });

  document.getElementById('btn-test').addEventListener('click', () => {
    mode = 'test';
    renderBooks();
    showView(VIEW_BOOKS);
  });
})();
