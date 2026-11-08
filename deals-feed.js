/* Shows the live deals from the VT Travel record base. Each card has "More info" and "Enquire" buttons. */
(() => {
  const HOST = 'https://crm.vttravel.co.uk';
  const feeds = document.querySelectorAll('[data-deals-feed]');
  if (!feeds.length) return;

  const ok = (u) => { try { const x = new URL(u); return x.origin === HOST ? x.href : null; } catch { return null; } };
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };

  function card(d) {
    const url = ok(d.url), enq = ok(d.enquire_url), img = ok(d.thumb);
    if (!url || !enq || !img) return null;
    const c = el('article', 'dealcard');
    const pic = el('a', 'dealpic'); pic.href = url; pic.tabIndex = -1; pic.setAttribute('aria-hidden', 'true');
    const im = el('img'); im.src = img; im.alt = ''; im.loading = 'lazy'; im.width = 640; im.height = 480;
    pic.append(im);
    if (d.badge) pic.append(el('span', 'dealbadge', d.badge));
    const body = el('div', 'dealbody');
    const h = el('h3'); const hl = el('a', '', d.title); hl.href = url; h.append(hl);
    body.append(h);
    if (d.summary) body.append(el('p', 'dealsum', d.summary));
    const meta = el('p', 'dealmeta');
    if (d.price) meta.append(el('b', '', d.price));
    if (d.label) meta.append(el('span', '', d.label));
    body.append(meta);
    const btns = el('div', 'dealbtns');
    const more = el('a', 'btn dealmore', 'More info'); more.href = url;
    const ask = el('a', 'btn primary', 'Enquire about this holiday'); ask.href = enq;
    btns.append(more, ask);
    body.append(btns);
    c.append(pic, body);
    return c;
  }

  function message(feed, text) {
    const p = el('p', 'feednote', text + ' ');
    const a = el('a', '', 'Request a personal quote'); a.href = 'quote.html';
    p.append(a);
    feed.replaceChildren(p);
    feed.setAttribute('aria-busy', 'false');
  }

  fetch(HOST + '/api/deals.json', { headers: { Accept: 'application/json' } })
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((data) => {
      const list = Array.isArray(data.deals) ? data.deals : [];
      feeds.forEach((feed) => {
        const limit = parseInt(feed.dataset.limit || '0', 10) || list.length;
        const cards = list.slice(0, limit).map(card).filter(Boolean);
        if (!cards.length) return message(feed, 'New deals are added all the time. Tell us where you would like to go and we will look for you.');
        feed.replaceChildren(...cards);
        feed.setAttribute('aria-busy', 'false');
      });
    })
    .catch(() => feeds.forEach((f) => message(f, 'Our latest deals are not loading right now.')));
})();
