(() => {
  const feed = document.getElementById('instagram-feed');
  if (!feed) return;

  const instagramUrl = 'https://www.instagram.com/vttravel2026/';

  function showMessage(message) {
    const note = document.createElement('p');
    note.className = 'feednote';
    note.textContent = message + ' ';
    const link = document.createElement('a');
    link.href = instagramUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Visit @vttravel2026 on Instagram.';
    note.append(link);
    feed.replaceChildren(note);
    feed.setAttribute('aria-busy', 'false');
  }

  function safeHttpsUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' ? url.href : null;
    } catch {
      return null;
    }
  }

  function createPost(post) {
    const permalink = safeHttpsUrl(post.permalink);
    const imageUrl = safeHttpsUrl(post.mediaUrl);
    if (!permalink || !imageUrl) return null;
    const instagramHost = new URL(permalink).hostname;
    if (instagramHost !== 'www.instagram.com' && instagramHost !== 'instagram.com') return null;

    const card = document.createElement('a');
    card.className = 'instapost';
    card.href = permalink;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.setAttribute('aria-label', 'View this post on Instagram');

    const image = document.createElement('img');
    image.src = imageUrl;
    image.alt = 'VT Travel Instagram post';
    image.loading = 'lazy';
    image.decoding = 'async';
    card.append(image);

    if (post.caption) {
      const caption = document.createElement('span');
      caption.className = 'instacaption';
      caption.textContent = post.caption.trim().replace(/\s+/g, ' ').slice(0, 140);
      card.append(caption);
    }

    const label = document.createElement('span');
    label.className = 'instaopen';
    label.setAttribute('aria-hidden', 'true');
    label.textContent = 'View on Instagram ↗';
    card.append(label);
    return card;
  }

  fetch('/.netlify/functions/instagram-feed', { headers: { Accept: 'application/json' } })
    .then((response) => {
      if (!response.ok) throw new Error('Feed request failed');
      return response.json();
    })
    .then((result) => {
      const posts = Array.isArray(result.data) ? result.data : [];
      const cards = posts.map(createPost).filter(Boolean);
      if (!cards.length) {
        showMessage('Instagram posts are not available right now.');
        return;
      }
      feed.replaceChildren(...cards);
      feed.setAttribute('aria-busy', 'false');
    })
    .catch(() => showMessage('Instagram posts are not available right now.'));
})();
