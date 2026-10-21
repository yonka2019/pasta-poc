import { useEffect, useRef, useState } from 'react'
import { SAUCES, PASTAS, EXTRAS, DRINKS, INFO } from './data'

const P = {
  cart: 'M6 6h15l-1.5 9h-12zM6 6 5 3H2M9 20a1 1 0 1 0 0-.01M18 20a1 1 0 1 0 0-.01',
  left: 'M15 6l-6 6 6 6',
  right: 'M9 6l6 6-6 6',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  x: 'M6 6l12 12M18 6 6 18',
  pin: 'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  card: 'M3 6h18v12H3zM3 10h18',
  shield: 'M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6zM9 12l2 2 4-4',
  leaf: 'M5 19c0-9 6-14 15-14 0 9-5 15-14 15M5 19l7-7',
  check: 'M5 12l5 5 9-10',
  ig: 'M4 4h16v16H4zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8M17 7h.01',
  tiktok: 'M14 3v11a3.5 3.5 0 1 1-3.5-3.5M14 3c.5 2.5 2.5 4.5 5 4.5',
}
const Icon = ({ n, s = 20 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={P[n]} /></svg>
)

const Basil = ({ className }) => (
  <svg className={className} viewBox="0 0 100 70" aria-hidden="true">
    <path d="M4 36C22 6 70 0 96 34 70 66 24 66 4 36z" fill="#3f8f3a" />
    <path d="M4 36C30 30 64 30 96 34 70 66 24 66 4 36z" fill="#2f7a2c" />
    <path d="M8 36Q50 30 92 34" stroke="#6fbf5f" strokeWidth="2" fill="none" />
  </svg>
)
const Tomato = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
    <defs><radialGradient id="tg" cx=".35" cy=".35"><stop offset="0" stopColor="#ff6a55" /><stop offset=".6" stopColor="#e1251b" /><stop offset="1" stopColor="#a30f0a" /></radialGradient></defs>
    <circle cx="50" cy="54" r="42" fill="url(#tg)" />
    <ellipse cx="36" cy="38" rx="10" ry="6" fill="#fff" opacity=".35" />
    <path d="M50 18l6 10 12-4-8 10 10 6-13 0-7 9-7-9-13 0 10-6-8-10 12 4z" fill="#2f7a2c" />
  </svg>
)

const ils = (n) => `₪${n}`
const load = () => { try { return JSON.parse(localStorage.getItem('cart')) || [] } catch { return [] } }

export default function App() {
  const [cart, setCart] = useState(load)
  const [ordering, setOrdering] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const count = cart.reduce((s, i) => s + i.qty, 0)

  useEffect(() => { try { localStorage.setItem('cart', JSON.stringify(cart)) } catch {} }, [cart])

  const add = (items) => setCart((c) => {
    const next = [...c]
    for (const it of items) {
      const hit = next.find((x) => x.key === it.key)
      if (hit) hit.qty += it.qty
      else next.push(it)
    }
    return next.map((x) => ({ ...x }))
  })
  const setQty = (key, d) => setCart((c) => c.map((x) => (x.key === key ? { ...x, qty: x.qty + d } : x)).filter((x) => x.qty > 0))

  return (
    <>
      <Header count={count} onCart={() => setCartOpen(true)} />
      <main>
        <Hero />
        <Menu onPick={setOrdering} />
        <How />
        <Contact />
      </main>
      <footer className="footer">© Pasta La Vista · הרטבים של מלכת הפסטה</footer>

      {ordering && (
        <OrderDialog
          sauce={ordering}
          onClose={() => setOrdering(null)}
          onDone={(items) => { add(items); setOrdering(null); setCartOpen(true) }}
        />
      )}
      {cartOpen && <CartDialog cart={cart} setQty={setQty} clear={() => setCart([])} onClose={() => setCartOpen(false)} />}
    </>
  )
}

function Header({ count, onCart }) {
  return (
    <header className="header">
      <a href="#top" className="brand" aria-label="Pasta La Vista">
        <img src="/img/logo-256.png" alt="" width="44" height="44" />
        <span>Pasta <em>La</em> Vista</span>
      </a>
      <nav className="nav">
        <a href="#top" className="active">בית</a>
        <a href="#menu">תפריט</a>
        <a href="#how">איך מזמינים</a>
        <a href="#contact">צור קשר</a>
      </nav>
      <div className="header-actions">
        <button className="icon-btn" onClick={onCart} aria-label={`סל קניות, ${count} פריטים`}>
          <Icon n="cart" />
          {count > 0 && <span className="badge">{count}</span>}
        </button>
        <a href="#menu" className="btn btn-red btn-sm">להזמנה</a>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <Basil className="float leaf-a" />
      <Basil className="float leaf-b" />
      <div className="hero-text">
        <p className="eyebrow">מלכת הפסטה · אשקלון</p>
        <h1>זו לא רק פסטה,<br />זו <span className="red">חוויה.</span></h1>
        <p className="lead">פסטה צבעונית מאיטליה, ברטבים ביתיים עשירים. באיסוף עצמי.</p>
        <div className="hero-cta">
          <a href="#menu" className="btn btn-red">לתפריט</a>
          <a href="#how" className="btn btn-light">איך מזמינים</a>
        </div>
        <ul className="trust">
          <li><Icon n="shield" s={18} /> כשר למהדרין</li>
          <li><Icon n="leaf" s={18} /> חומרי גלם איכותיים</li>
          <li><Icon n="card" s={18} /> אשראי · ביט</li>
        </ul>
      </div>
      <div className="hero-art">
        <div className="bowl"><img src="/img/tomato.jpg" alt="פסטה ברוטב עגבניות של הבית" /></div>
        <div className="chip"><b>{ils(62)}</b><span>מנה מלאה</span></div>
        <Tomato className="float tomato" />
        <Basil className="float leaf-c" />
      </div>
    </section>
  )
}

function Menu({ onPick }) {
  const track = useRef(null)
  // RTL: "next" cards sit to the left, so next = negative scroll
  const scroll = (dir) => track.current.scrollBy({ left: dir * -track.current.clientWidth * 0.8, behavior: 'smooth' })
  return (
    <section className="menu" id="menu">
      <div className="section-head">
        <p className="eyebrow">התפריט</p>
        <h2>בחרו את הרוטב שלכם</h2>
      </div>
      <div className="carousel">
        <button className="arrow arrow-prev" onClick={() => scroll(-1)} aria-label="הקודם"><Icon n="right" /></button>
        <ul className="track" ref={track}>
          {SAUCES.map((s) => (
            <li key={s.id} className="dish">
              <div className="dish-bowl"><img src={s.img} alt={s.name} loading="lazy" /></div>
              <button className="dish-add" onClick={() => onPick(s)} aria-label={`הזמנת ${s.name}`}><Icon n="cart" s={18} /></button>
              <div className="dish-body">
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
                <div className="dish-foot">
                  <b>{ils(s.price)}</b>
                  <button className="link-btn" onClick={() => onPick(s)}>הזמינו ←</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button className="arrow arrow-next" onClick={() => scroll(1)} aria-label="הבא"><Icon n="left" /></button>
      </div>
    </section>
  )
}

function How() {
  const steps = [
    ['בוחרים רוטב', '5 רטבים ביתיים'],
    ['פסטה ותוספות', "פטוצ'יני, רגטוני או רדיאטורי"],
    ['אוספים', `${INFO.address} · פרטים ב-SMS`],
  ]
  return (
    <section className="how" id="how">
      <div className="section-head">
        <p className="eyebrow">איך מזמינים</p>
        <h2>שלושה צעדים לצלחת</h2>
      </div>
      <ol className="steps">
        {steps.map(([t, d], i) => (
          <li key={t}><span className="num">{i + 1}</span><h3>{t}</h3><p>{d}</p></li>
        ))}
      </ol>
    </section>
  )
}

function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="info-grid">
        <div className="info"><Icon n="pin" /><h3>כתובת</h3><p>{INFO.address}</p><small>איסוף עצמי בלבד</small></div>
        <div className="info"><Icon n="clock" /><h3>שעות</h3><p>{INFO.hours}</p><small>{INFO.closed}</small></div>
        <div className="info"><Icon n="card" /><h3>תשלום</h3><p>אשראי · ביט</p></div>
        <div className="info"><Icon n="shield" /><h3>כשרות</h3><p>כשר למהדרין</p><small>ללא תעודת כשרות</small></div>
      </div>
      <div className="social">
        <a href={INFO.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Icon n="ig" /></a>
        <a href={INFO.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok"><Icon n="tiktok" /></a>
      </div>
    </section>
  )
}

// Native <dialog>: focus trap + Esc for free
function Modal({ onClose, className = '', children, label }) {
  const ref = useRef(null)
  useEffect(() => { ref.current.showModal() }, [])
  return (
    <dialog ref={ref} className={`modal ${className}`} aria-label={label} onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}>
      <div className="modal-inner">
        <button className="icon-btn close" onClick={onClose} aria-label="סגירה"><Icon n="x" /></button>
        {children}
      </div>
    </dialog>
  )
}

function Stepper({ value, set, min = 0 }) {
  return (
    <div className="stepper">
      <button onClick={() => set(value + 1)} aria-label="הוספה"><Icon n="plus" s={16} /></button>
      <span aria-live="polite">{value}</span>
      <button onClick={() => set(Math.max(min, value - 1))} aria-label="הפחתה" disabled={value <= min}><Icon n="minus" s={16} /></button>
    </div>
  )
}

function OrderDialog({ sauce, onClose, onDone }) {
  const [step, setStep] = useState(0)
  const [pasta, setPasta] = useState(null)
  const [extras, setExtras] = useState([])
  const [qty, setQty] = useState(1)
  const [drinks, setDrinks] = useState({})

  const extraList = EXTRAS.filter((e) => extras.includes(e.id))
  const unit = sauce.price + extraList.reduce((s, e) => s + e.price, 0)
  const drinksTotal = DRINKS.reduce((s, d) => s + (drinks[d.id] || 0) * d.price, 0)

  const finish = () => onDone([
    {
      key: [sauce.id, pasta, ...[...extras].sort()].join('|'),
      title: sauce.name,
      sub: [pasta, ...extraList.map((e) => e.name)].join(' · '),
      unit, qty,
    },
    ...DRINKS.filter((d) => drinks[d.id]).map((d) => ({ key: d.id, title: d.name, sub: 'שתייה', unit: d.price, qty: drinks[d.id] })),
  ])

  return (
    <Modal onClose={onClose} label={`הזמנת ${sauce.name}`}>
      <div className="order-head">
        <div className="mini-bowl"><img src={sauce.img} alt="" /></div>
        <div>
          <h2>{sauce.name}</h2>
          <p className="muted">{[pasta, ...extraList.map((e) => e.name)].filter(Boolean).join(' · ') || sauce.desc}</p>
        </div>
      </div>
      <ol className="progress" aria-label={`שלב ${step + 1} מתוך 3`}>
        {['פסטה', 'תוספות', 'שתייה'].map((t, i) => <li key={t} className={i <= step ? 'on' : ''}>{t}</li>)}
      </ol>

      {step === 0 && (
        <div className="choices">
          {PASTAS.map((p) => (
            <button key={p} className="choice" onClick={() => { setPasta(p); setStep(1) }}>
              <span>{p}</span><b>{ils(sauce.price)}</b>
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <>
          <div className="choices">
            {EXTRAS.map((e) => {
              const on = extras.includes(e.id)
              return (
                <button key={e.id} className={`choice ${on ? 'on' : ''}`} aria-pressed={on}
                  onClick={() => setExtras(on ? extras.filter((x) => x !== e.id) : [...extras, e.id])}>
                  <span>{e.name}</span><b>{e.price ? `+${ils(e.price)}` : 'חינם'}</b>
                </button>
              )
            })}
          </div>
          <div className="row"><span>כמות מנות</span><Stepper value={qty} set={setQty} min={1} /></div>
          <div className="modal-foot">
            <button className="btn btn-light" onClick={() => setStep(0)}>חזרה</button>
            <button className="btn btn-red" onClick={() => setStep(2)}>המשך · {ils(unit * qty)}</button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="drinks">
            {DRINKS.map((d) => (
              <div key={d.id} className="row">
                <span>{d.name} <small className="muted">{ils(d.price)}</small></span>
                <Stepper value={drinks[d.id] || 0} set={(v) => setDrinks({ ...drinks, [d.id]: v })} />
              </div>
            ))}
          </div>
          <div className="modal-foot">
            <button className="btn btn-light" onClick={() => setStep(1)}>חזרה</button>
            <button className="btn btn-red" onClick={finish}>הוספה לסל · {ils(unit * qty + drinksTotal)}</button>
          </div>
        </>
      )}
    </Modal>
  )
}

function CartDialog({ cart, setQty, clear, onClose }) {
  const [sent, setSent] = useState(false)
  const total = cart.reduce((s, i) => s + i.unit * i.qty, 0)

  return (
    <Modal onClose={onClose} className="drawer" label="סל קניות">
      {sent ? (
        <div className="sent">
          <span className="sent-icon"><Icon n="check" s={36} /></span>
          <h2>ההזמנה התקבלה!</h2>
          <p className="muted">פרטי האיסוף יישלחו ב-SMS.</p>
          <p className="demo">דמו · ההזמנה לא נשלחה בפועל</p>
          <button className="btn btn-red" onClick={onClose}>סגירה</button>
        </div>
      ) : (
        <>
          <h2>הסל שלכם</h2>
          {cart.length === 0 ? (
            <div className="empty">
              <p className="muted">הסל ריק.</p>
              <a href="#menu" className="btn btn-red" onClick={onClose}>לתפריט</a>
            </div>
          ) : (
            <>
              <ul className="cart-list">
                {cart.map((i) => (
                  <li key={i.key}>
                    <div>
                      <b>{i.title}</b>
                      <small className="muted">{i.sub}</small>
                    </div>
                    <Stepper value={i.qty} set={(v) => setQty(i.key, v - i.qty)} />
                    <b className="price">{ils(i.unit * i.qty)}</b>
                  </li>
                ))}
              </ul>
              <div className="total"><span>סה״כ</span><b>{ils(total)}</b></div>
              <button className="btn btn-red btn-block" onClick={() => { clear(); setSent(true) }}>שליחת הזמנה</button>
              <p className="muted center">איסוף עצמי · {INFO.address}</p>
            </>
          )}
        </>
      )}
    </Modal>
  )
}
