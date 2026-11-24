'use client';

import { FormEvent, useEffect, useState } from 'react';

const events = [
  { date: 'FRIDAY · 11 DECEMBER', name: 'Welcome Mixer', detail: 'A warm beginning to a beautiful weekend.', time: 'Time and venue to be announced' },
  { date: 'FRIDAY · 11 DECEMBER', name: 'Jos Tour', detail: 'A little time to discover the city and make memories together.', time: 'Details to follow' },
  { date: 'SATURDAY · 12 DECEMBER', name: 'The White Wedding', detail: 'The day we say “I do” and celebrate the beginning of forever.', time: 'Church ceremony · 11:00 AM', featured: true },
  { date: 'SUNDAY · 13 DECEMBER', name: 'Thanksgiving', detail: 'A moment of gratitude with family and friends.', time: 'Details to follow' }
];

export default function Home() {
  const [days, setDays] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const target = new Date('2026-12-12T11:00:00+01:00').getTime();
    const update = () => setDays(Math.max(0, Math.ceil((target - Date.now()) / 86400000)));
    update();
    const timer = window.setInterval(update, 60000);
    return () => window.clearInterval(timer);
  }, []);

  async function submitRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSending(true); setStatus('');
    const form = new FormData(formElement);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch('/api/rsvp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to submit your RSVP.');
      setStatus(result.emailSent ? 'Thank you! Your RSVP has been received, and a confirmation email is on its way.' : 'Thank you! Your RSVP has been received. We could not send the confirmation email just now.');
      formElement.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally { setSending(false); }
  }

  return <main>
    <div className="announcement">WITH FULL HEARTS & GRATEFUL SPIRITS · JOS, NIGERIA</div>
    <header className="site-header">
      <a className="brand" href="#home">N<span>&</span>E</a>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">☰</button>
      <nav className={menuOpen ? 'nav open' : 'nav'}>
        <a onClick={() => setMenuOpen(false)} href="#story">OUR STORY</a><a onClick={() => setMenuOpen(false)} href="#celebration">THE CELEBRATION</a><a onClick={() => setMenuOpen(false)} href="#travel">TRAVEL</a><a onClick={() => setMenuOpen(false)} href="#rsvp">RSVP</a>
      </nav>
    </header>

    <section className="hero" id="home">
      <div className="hero-wash" />
      <div className="hero-content">
        <p className="eyebrow light">A PROMISE · A PRAYER · A FOREVER</p>
        <h1>Nkasire <i>&</i><br/>Emmanuel</h1>
        <div className="hero-rule"><span /></div>
        <p className="hero-tagline">His purpose. His timing. Our forever.</p>
        <p className="hero-date">12 · 12 · 2026 <span>—</span> JOS, NIGERIA</p>
        <a className="button button-light" href="#celebration">CELEBRATE WITH US</a>
      </div>
      <div className="hero-bottom">#BAWASEVERAFTER</div>
    </section>

    <section className="countdown section-pad">
      <p className="eyebrow">THE COUNTDOWN TO FOREVER</p>
      <div className="count-number">{days === null ? '—' : days}</div>
      <p className="count-label">DAYS UNTIL WE SAY “I DO”</p>
    </section>

    <section className="story section-pad" id="story">
      <div className="section-kicker">01 / A LITTLE ABOUT US</div>
      <div className="story-copy"><p className="eyebrow">A LOVE WRITTEN IN HIS TIME</p><h2>Some things are<br/><i>worth the wait.</i></h2><p>Two journeys, one beautiful promise. We are grateful for the grace that brought us here, and for the family and friends who have made our story richer. Now, with joyful hearts, we invite you to witness the beginning of our forever.</p><p className="script-sign">With love, Nkasire & Emmanuel</p></div>
      <div className="story-art" aria-label="Decorative burgundy and blush wedding motif"><div className="art-frame"><span className="art-monogram">N<span>&</span>E</span><span className="art-caption">LOVE · FAITH · FOREVER</span></div></div>
    </section>

    <section className="celebration section-pad" id="celebration">
      <div className="section-kicker">02 / THE WEDDING WEEKEND</div>
      <p className="eyebrow">SAVE THE DATE</p><h2>Come for the love.<br/><i>Stay for the memories.</i></h2>
      <div className="event-grid">{events.map((item, index) => <article className={item.featured ? 'event-card featured' : 'event-card'} key={item.name}><span className="event-index">0{index + 1}</span><p className="event-date">{item.date}</p><h3>{item.name}</h3><p>{item.detail}</p><div className="event-time">{item.time}</div></article>)}</div>
    </section>

    <section className="details-band" id="travel"><div><p className="eyebrow light">A NOTE FOR OUR GUESTS</p><h2>Meet us in<br/><i>Jos.</i></h2><p className="details-text">We cannot wait to welcome you. We are putting together helpful information on accommodation, getting around and the weekend's locations. Please check back as details are confirmed.</p><a className="text-link" href="#rsvp">LET US KNOW YOU’RE COMING ↗</a></div><div className="details-stamp"><span>12</span><small>DECEMBER<br/>2026</small><i>JOS · NIGERIA</i></div></section>

    <section className="travel section-pad"><div className="section-kicker">03 / MAKING YOUR WAY HERE</div><p className="eyebrow">TRAVEL & ACCOMMODATION</p><h2>We’ll help you<br/><i>feel at home.</i></h2><div className="travel-grid"><div><span>01</span><h3>Getting to Jos</h3><p>Travel guidance and transport arrangements will be shared with guests as they are finalised.</p></div><div><span>02</span><h3>Where to stay</h3><p>Recommended accommodation options and booking guidance will be added here.</p></div><div><span>03</span><h3>Need a hand?</h3><p>For wedding-weekend enquiries, please contact the couple or your designated guest coordinator.</p></div></div></section>

    <section className="rsvp section-pad" id="rsvp"><div className="section-kicker">04 / THE HONOUR OF YOUR COMPANY</div><p className="eyebrow light">KINDLY RESPOND</p><h2>Will you join<br/><i>our forever?</i></h2><p className="rsvp-intro">Please let us know if you will be celebrating with us. We look forward to sharing this special day with you.</p>
      <form className="rsvp-form" onSubmit={submitRsvp}><label>YOUR FULL NAME<input name="full_name" required placeholder="Full name" /></label><label>EMAIL ADDRESS<input name="email" type="email" required placeholder="you@example.com" /></label><label>PHONE NUMBER <span>(OPTIONAL)</span><input name="phone" type="tel" placeholder="+234 ..." /></label><label>WILL YOU BE JOINING US?<select name="attendance" required defaultValue=""><option value="" disabled>Select your response</option><option value="yes">Joyfully accepts</option><option value="no">Regretfully declines</option></select></label><label>NUMBER OF GUESTS INCLUDING YOU<select name="guest_count" defaultValue="1"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></label><label>A NOTE FOR THE COUPLE <span>(OPTIONAL)</span><textarea name="message" rows={3} placeholder="Leave us a little note..." /></label><button className="button button-gold" disabled={sending}>{sending ? 'SENDING…' : 'SEND MY RSVP'}</button>{status && <p className="form-status" role="status">{status}</p>}<p className="privacy-note">Your details will only be used to coordinate the wedding celebration.</p></form>
    </section>

    <footer><div className="footer-monogram">N<span>&</span>E</div><p>HIS PURPOSE. HIS TIMING. OUR FOREVER.</p><h2>#Bawaseverafter</h2><small>WITH LOVE · 12 DECEMBER 2026 · JOS, NIGERIA</small></footer>
  </main>;
}
