import { useMemo, useState } from "react";
import "./App.css";

const cabSizes = [
  { id: "112", label: "1x12", price: 950, base: "/base/112_base.jpg", button: "/ui/buttons/112.png" },
  { id: "212", label: "2x12", price: 1250, base: "/base/212_base.jpg", button: "/ui/buttons/212.png" },
  { id: "412", label: "4x12", price: 1650, base: "/base/412_base.jpg", button: "/ui/buttons/412.png" },
];

const liveries = [
  { id: "tiger", label: "Tiger", price: 0 },
  { id: "nitro", label: "Nitro", price: 0 },
  { id: "shock", label: "Shock", price: 150 },
];

const colorways = [
  { id: "bigcat", label: "Big Cat", price: 0, liveries: ["tiger", "nitro"] },
  { id: "badkitty", label: "Bad Kitty", price: 0, liveries: ["tiger", "nitro"] },
  { id: "miami", label: "Miami", price: 0, liveries: ["tiger", "nitro"] },
  { id: "dig", label: "Dig", price: 0, liveries: ["tiger", "nitro"] },
  { id: "mania", label: "Mania", price: 0, liveries: ["tiger", "nitro"] },
  { id: "marley", label: "Marley", price: 100, liveries: ["shock"] },
  { id: "grateful", label: "Grateful", price: 100, liveries: ["shock"] },
];

function buttonPath(id, active) {
  return `/ui/buttons/${id}_${active ? "active" : "idle"}.png`;
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [size, setSize] = useState("112");
  const [livery, setLivery] = useState("tiger");
  const [colorway, setColorway] = useState("bigcat");
  const [cart, setCart] = useState([]);

  const selectedSize = cabSizes.find((item) => item.id === size);
  const selectedLivery = liveries.find((item) => item.id === livery);
  const selectedColorway = colorways.find((item) => item.id === colorway);

  const validColorways = useMemo(() => {
    return colorways.filter((item) => item.liveries.includes(livery));
  }, [livery]);

  const overlayPath =
    size && livery && colorway
      ? `/overlays/${size}_${livery}_${colorway}.png`
      : null;

  const price =
    (selectedSize?.price || 0) +
    (selectedLivery?.price || 0) +
    (selectedColorway?.price || 0);

  function chooseLivery(nextLivery) {
    setLivery(nextLivery);

    const currentStillValid = colorways
      .find((cw) => cw.id === colorway)
      ?.liveries.includes(nextLivery);

    if (!currentStillValid) {
      const firstValidColorway = colorways.find((cw) =>
        cw.liveries.includes(nextLivery)
      );
      setColorway(firstValidColorway.id);
    }
  }

  function finalizeCab() {
    const item = {
      size: selectedSize.label,
      livery: selectedLivery.label,
      colorway: selectedColorway.label,
      price,
    };

    setCart([...cart, item]);
    alert(`${item.size} ${item.livery} ${item.colorway} added to cart.`);
  }

  if (!started) {
    return (
      <main className="start-screen">
        <img src="/empty/start_screen.jpg" className="start-bg" alt="Shrimp Cab start screen" />

        <button className="press-start" onClick={() => setStarted(true)}>
          <img src="/ui/buttons/press_start.png" alt="Press Start" />
        </button>
      </main>
    );
  }

  return (
    <main className="app">
      <section className="viewer">
        <img
          className="stage"
          src={selectedSize ? selectedSize.base : "/empty/stage_empty.jpg"}
          alt="Cab stage"
        />

        {overlayPath && (
          <img
            className="cab-overlay"
            src={overlayPath}
            alt={`${selectedSize.label} ${selectedLivery.label} ${selectedColorway.label}`}
          />
        )}
      </section>

      <section className="menu">
        <div className="product-info">
          <div className="brand-kicker">Shrimp Cab Co.</div>
          <h1>
            {selectedSize.label} {selectedLivery.label} {selectedColorway.label}
          </h1>
          <div className="price">${price.toLocaleString()}</div>

          <div className="spec-row">
            <span>Hand Built</span>
            <span>Baltic Birch</span>
            <span>Made in Georgia</span>
          </div>
        </div>

        <section className="option-group">
          <h2><span>Cab Size</span></h2>
          <div className="button-grid">
            {cabSizes.map((item) => (
              <button
                key={item.id}
                className={`image-button ${size === item.id ? "selected" : ""}`}
                onClick={() => setSize(item.id)}
              >
                <img src={item.button} alt={item.label} />
                <span>{item.label} — ${item.price}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="option-group">
          <h2><span>Livery</span></h2>
          <div className="button-grid">
            {liveries.map((item) => (
              <button
                key={item.id}
                className={`image-button ${livery === item.id ? "selected" : ""}`}
                onClick={() => chooseLivery(item.id)}
              >
                <img src={buttonPath(item.id, livery === item.id)} alt={item.label} />
                <span>
                  {item.label}
                  {item.price > 0 ? ` — +$${item.price}` : ""}
                </span>
              </button>
            ))}

            <div className="locked-icon">
              <img src="/ui/buttons/locked.png" alt="Locked" />
              <span>More coming</span>
            </div>
          </div>
        </section>

        <section className="option-group">
          <h2><span>Colorway</span></h2>
          <div className="button-grid">
            {validColorways.map((item) => (
              <button
                key={item.id}
                className={`image-button ${colorway === item.id ? "selected" : ""}`}
                onClick={() => setColorway(item.id)}
              >
                <img src={buttonPath(item.id, colorway === item.id)} alt={item.label} />
                <span>
                  {item.label}
                  {item.price > 0 ? ` — +$${item.price}` : ""}
                </span>
              </button>
            ))}
          </div>
        </section>

        <button className="finalize" onClick={finalizeCab}>
          Finalize Cab
        </button>

        {cart.length > 0 && (
          <section className="cart">
            <h2>Cart</h2>
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                {item.size} / {item.livery} / {item.colorway}
                <strong>${item.price.toLocaleString()}</strong>
              </div>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}