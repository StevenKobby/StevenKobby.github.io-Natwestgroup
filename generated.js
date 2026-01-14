async function renderGenerated() {
  const container = document.getElementById('content');
  try {
    const res = await fetch('generated-content.json');
    const data = await res.json();

    const title = document.createElement('h1');
    title.textContent = data.title || 'Generated Page';
    title.style.color = '#5a287d';
    container.appendChild(title);

    if (data.intro) {
      const intro = document.createElement('p');
      intro.textContent = data.intro;
      intro.style.marginTop = '0.5rem';
      container.appendChild(intro);
    }

    const grid = document.createElement('div');
    grid.className = 'grid';
    data.sections?.forEach(sec => {
      const card = document.createElement('div');
      card.className = 'card';

      {
        const img = document.createElement('img');
        const seed = (sec.heading || 'placeholder').replace(/\s+/g, '-').toLowerCase();
        const fallback = `https://picsum.photos/seed/${encodeURIComponent(seed)}/900/600`;
        img.src = sec.imageUrl || fallback;
        img.alt = sec.heading || 'Section image';
        img.loading = 'lazy';
        card.appendChild(img);
      }

      const h3 = document.createElement('h3');
      h3.textContent = sec.heading || 'Section';
      card.appendChild(h3);

      if (sec.text) {
        const p = document.createElement('p');
        p.textContent = sec.text;
        card.appendChild(p);
      }

      grid.appendChild(card);
    });
    container.appendChild(grid);
  } catch (e) {
    const err = document.createElement('pre');
    err.textContent = 'Failed to load generated content: ' + e.message;
    err.style.color = 'crimson';
    container.appendChild(err);
  }
}

renderGenerated();