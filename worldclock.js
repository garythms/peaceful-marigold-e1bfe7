/* Header widget: a clock and the weather for London, then the same for the destination of a live deal.
   Weather and place lookups come from Open-Meteo (free, no account). Fails quietly if anything is unavailable. */
(() => {
  const box = document.getElementById('worldclock');
  if (!box) return;
  const DEALS = 'https://crm.vttravel.co.uk/api/deals.json';
  const LONDON = { name: 'London', lat: 51.5072, lon: -0.1276, tz: 'Europe/London' };
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };

  const CODES = [[0, '☀️', 'Clear'], [2, '⛅', 'Part cloud'], [3, '☁️', 'Cloudy'], [48, '🌫️', 'Fog'], [57, '🌦️', 'Drizzle'],
    [67, '🌧️', 'Rain'], [77, '❄️', 'Snow'], [82, '🌧️', 'Showers'], [86, '❄️', 'Snow showers'], [99, '⛈️', 'Storms']];
  const sky = (c) => (CODES.find((x) => c <= x[0]) || CODES[CODES.length - 1]).slice(1);

  function build(id) {
    const n = el('div', 'wc-item');
    n.id = id;
    n.append(el('span', 'wc-place'), el('b', 'wc-time'), el('span', 'wc-wx'));
    return n;
  }
  const slots = [build('wc-a'), build('wc-b')];
  slots[1].hidden = true;
  box.append(...slots);

  const clocks = [];
  function setPlace(slot, place) {
    slot.querySelector('.wc-place').textContent = place.name;
    const t = slot.querySelector('.wc-time');
    const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: place.tz });
    const tick = () => { t.textContent = fmt.format(new Date()); };
    tick();
    clocks[slots.indexOf(slot)] = tick;
    slot.dataset.tz = place.tz;
  }
  setInterval(() => clocks.forEach((f) => f && f()), 10000);

  const wxCache = new Map();
  async function weather(place) {
    const key = place.lat + ',' + place.lon;
    const hit = wxCache.get(key);
    if (hit && Date.now() - hit.at < 900000) return hit.v;
    const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + place.lat + '&longitude=' + place.lon +
      '&current=temperature_2m,weather_code&timezone=auto');
    const j = await r.json();
    const v = { t: Math.round(j.current.temperature_2m), s: sky(j.current.weather_code) };
    wxCache.set(key, { at: Date.now(), v });
    return v;
  }
  async function show(slot, place) {
    setPlace(slot, place);
    const wx = slot.querySelector('.wc-wx');
    try {
      const w = await weather(place);
      wx.textContent = w.s[0] + ' ' + w.t + '°C';
      wx.title = w.s[1];
    } catch { wx.textContent = ''; }
    slot.hidden = false;
  }

  async function geocode(dest) {
    const q = dest.split(',')[0].trim();
    const r = await fetch('https://geocoding-api.open-meteo.com/v1/search?count=1&language=en&name=' + encodeURIComponent(q));
    const j = await r.json();
    const g = j.results && j.results[0];
    return g ? { name: q, lat: g.latitude, lon: g.longitude, tz: g.timezone } : null;
  }

  show(slots[0], LONDON);

  fetch(DEALS).then((r) => r.json()).then(async (data) => {
    const seen = new Set(), places = [];
    for (const d of (data.deals || [])) {
      const dest = (d.destination || '').trim();
      if (!dest || seen.has(dest.toLowerCase()) || places.length >= 5) continue;
      seen.add(dest.toLowerCase());
      try { const p = await geocode(dest); if (p && p.tz) places.push(p); } catch { /* skip this one */ }
    }
    if (!places.length) return;
    let i = 0;
    await show(slots[1], places[0]);
    if (places.length > 1) setInterval(() => { i = (i + 1) % places.length; show(slots[1], places[i]); }, 10000);
  }).catch(() => {});
})();
