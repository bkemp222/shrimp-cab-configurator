import { useEffect, useMemo, useState } from "react";
import "./App.css";

const EMPTY_STAGE = "/empty/stage_empty.jpg";
const LOADING_SHRIMP = "/ui/loading/loading_shrimp.png";
const BUILDER_LOGO = "/logo/build_your_shrimp_logo.png";
const INSTRUMENT_SELECT = "/title/instrument_select.png";

const instruments = [
  {
    id: "guitar",
    label: "Guitar",
    idleButton: "/ui/buttons/guitar_idle.png",
    activeButton: "/ui/buttons/guitar_active.png",
  },
];

const loadingPhrases = [
  "Cutting Tolex…",
  "Reloading Staple Gun…",
  "Spilling Glue…",
  "Looking for pencil…",
  "Reticulating Splines…",
  "Drinking Coffee…",
];

const cabSizes = [
  {
    id: "112",
    label: "1x12",
    dimensions: '20" H x 22" W x 12" D',
    impedance: "8 Ohms",
watts: "65 Watts",
    base: "/base/112_base.jpg",
    button: "/ui/buttons/112.png",
    loadedPrice: 795,
    unloadedPrice: 695,
    loadedDescription: "G12M-65 Creamback",
  },
  {
    id: "212",
    label: "2x12",
    dimensions: '22" H x 30" W x 12" D',
    impedance: "8 Ohms",
watts: "130 Watts",
    base: "/base/212_base.jpg",
    button: "/ui/buttons/212.png",
    loadedPrice: 1095,
    unloadedPrice: 895,
    loadedDescription: "Dual G12M-65 Creamback",
  },
  {
    id: "412",
    label: "4x12",
    dimensions: '34" H x 30" W x 14" D',
    impedance: "16 Ohms",
watts: "250 Watts",
    base: "/base/412_base.jpg",
    button: "/ui/buttons/412.png",
    loadedPrice: 1595,
    unloadedPrice: 1195,
    loadedDescription: "V30 x Creamback Cross Pattern",
  },
];

const liveries = [
  { id: "tiger", label: "Tiger" },
  { id: "nitro", label: "Nitro" },
  { id: "shock", label: "Shock" },
];

const colorways = [
  { id: "bigcat", label: "Big Cat", liveries: ["tiger", "nitro"] },
  { id: "badkitty", label: "Bad Kitty", liveries: ["tiger", "nitro"] },
  { id: "miami", label: "Miami", liveries: ["tiger", "nitro"] },
  { id: "dig", label: "Digger", liveries: ["tiger", "nitro"] },
  { id: "mania", label: "Mania", liveries: ["tiger", "nitro"] },
  { id: "marley", label: "Irie", liveries: ["shock"] },
  { id: "grateful", label: "Grateful", liveries: ["shock"] },
];

const speakerOptions = [
  {
    id: "loaded",
    label: "Loaded",
    idleButton: "/ui/buttons/loaded_idle.png",
    activeButton: "/ui/buttons/loaded_active.png",
  },
  {
    id: "unloaded",
    label: "Unloaded",
    idleButton: "/ui/buttons/unloaded_idle.png",
    activeButton: "/ui/buttons/unloaded_active.png",
  },
];

const casterOption = {
  id: "casters",
  label: "Casters",
  price: 100,
  idleButton: "/ui/buttons/casters_idle.png",
  activeButton: "/ui/buttons/casters_active.png",
};

function buttonPath(id, active) {
  return `/ui/buttons/${id}_${active ? "active" : "idle"}.png`;
}

function overlayFor(size, livery, colorway) {
  return `/overlays/${size}_${livery}_${colorway}.png`;
}

function getAllAssetPaths() {
  const overlayPaths = [];

  cabSizes.forEach((size) => {
    liveries.forEach((livery) => {
      colorways.forEach((colorway) => {
        if (colorway.liveries.includes(livery.id)) {
          overlayPaths.push(overlayFor(size.id, livery.id, colorway.id));
        }
      });
    });
  });
  
  

  return [
    EMPTY_STAGE,
    LOADING_SHRIMP,
    BUILDER_LOGO,
    INSTRUMENT_SELECT,
"/ui/buttons/guitar_idle.png",
"/ui/buttons/guitar_active.png",
"/ui/buttons/bass_locked.png",
    "/ui/buttons/locked.png",

    ...cabSizes.map((item) => item.base),
    ...cabSizes.map((item) => item.button),

    ...liveries.flatMap((item) => [
      buttonPath(item.id, false),
      buttonPath(item.id, true),
    ]),

    ...colorways.flatMap((item) => [
      buttonPath(item.id, false),
      buttonPath(item.id, true),
    ]),

    ...speakerOptions.flatMap((item) => [
      item.idleButton,
      item.activeButton,
    ]),

    casterOption.idleButton,
    casterOption.activeButton,

    ...overlayPaths,
  ];
}

export default function App() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [instrument, setInstrument] = useState(null);
const [showConfigurator, setShowConfigurator] = useState(false);
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);

  const [size, setSize] = useState("112");
  const [livery, setLivery] = useState("tiger");
  const [colorway, setColorway] = useState("bigcat");
  const [speaker, setSpeaker] = useState("loaded");
  const [casters, setCasters] = useState(false);
  const [cart, setCart] = useState([]);

  const [isChangingSize, setIsChangingSize] = useState(false);

  const selectedSize = cabSizes.find((item) => item.id === size);
  const selectedLivery = liveries.find((item) => item.id === livery);
  const selectedColorway = colorways.find((item) => item.id === colorway);
  const selectedSpeaker = speakerOptions.find((item) => item.id === speaker);

  const validColorways = useMemo(() => {
    return colorways.filter((item) => item.liveries.includes(livery));
  }, [livery]);

  const overlayPath = overlayFor(size, livery, colorway);

  const stageImage = isChangingSize ? EMPTY_STAGE : selectedSize.base;
  const showOverlay = !isChangingSize && overlayPath;

  const basePrice =
    speaker === "loaded"
      ? selectedSize.loadedPrice
      : selectedSize.unloadedPrice;

  const casterPrice = casters && size !== "112" ? casterOption.price : 0;
  const price = basePrice + casterPrice;

useEffect(() => {
  const phraseTimer = setInterval(() => {
    setLoadingPhraseIndex((current) => (current + 1) % loadingPhrases.length);
  }, 900);

  const assetPaths = [...new Set(getAllAssetPaths())];

  let loadedCount = 0;
  let finished = false;

  function finishLoading() {
    if (finished) return;

    finished = true;
    setAssetsLoaded(true);
    clearInterval(phraseTimer);
  }

  function markLoaded() {
    loadedCount += 1;

    if (loadedCount >= assetPaths.length) {
      setTimeout(finishLoading, 350);
    }
  }

  assetPaths.forEach((path) => {
    if (!path) {
      markLoaded();
      return;
    }

    const img = new Image();
    img.onload = markLoaded;
    img.onerror = markLoaded;
    img.src = path;
  });

  const failsafeTimer = setTimeout(finishLoading, 20000);

  return () => {
    finished = true;
    clearInterval(phraseTimer);
    clearTimeout(failsafeTimer);
  };
}, []);

  useEffect(() => {
    if (size === "112" && casters) {
      setCasters(false);
    }
  }, [size, casters]);

  function chooseSize(nextSize) {
    if (nextSize === size || isChangingSize) return;

    setIsChangingSize(true);

    setTimeout(() => {
      setSize(nextSize);
      setIsChangingSize(false);
    }, 220);
  }

  function chooseLivery(nextLivery) {
    setLivery(nextLivery);

    const currentStillValid = colorways
      .find((cw) => cw.id === colorway)
      ?.liveries.includes(nextLivery);

    if (!currentStillValid) {
      const firstValidColorway = colorways.find((cw) =>
        cw.liveries.includes(nextLivery)
      );

      if (firstValidColorway) {
        setColorway(firstValidColorway.id);
      }
    }
  }

  function chooseInstrument(nextInstrument) {
  setInstrument(nextInstrument);

  setTimeout(() => {
    setShowConfigurator(true);
  }, 250);
}

function backToInstrumentSelection() {
  setShowConfigurator(false);

  setTimeout(() => {
    setInstrument(null);
  }, 300);
}

function finalizeCab() {
  const params = new URLSearchParams({
    cab: selectedSize.label,
    livery: selectedLivery.label,
    colorway: selectedColorway.label,
    speaker: selectedSpeaker.label,
    casters: casters && size !== "112" ? "CASTERS" : "NO CASTERS",
    price: price.toString(),
  });

const checkoutUrl =
  size === "412"
    ? "https://www.shrimpcabs.com/store/p/bys-4x12"
    : "https://www.shrimpcabs.com/store/p/bys";

window.location.href = `${checkoutUrl}?${params.toString()}`;
}

  if (!assetsLoaded) {
    return (
      <main className="loading-screen">
        <div className="loading-card">
          <img
            className="loading-shrimp"
            src={LOADING_SHRIMP}
            alt="Loading Shrimp Cab configurator"
          />

          <div className="loading-phrase">
            {loadingPhrases[loadingPhraseIndex]}
          </div>

          <div className="loading-bar">
            <div className="loading-bar-fill" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="app">
      <div className="builder-logo">
        <img src={BUILDER_LOGO} alt="Build Your Shrimp" />
      </div>

      <section className="viewer">
       <img
  className={`stage ${showConfigurator ? "stage-fade" : ""}`}
  src={showConfigurator ? stageImage : INSTRUMENT_SELECT}
  alt="Cab stage"
/>

        {showConfigurator && showOverlay && (
          <img
            key={overlayPath}
            className="cab-overlay"
            src={overlayPath}
            alt={`${selectedSize.label} ${selectedLivery.label} ${selectedColorway.label}`}
          />
        )}
      </section>

     <section
  className={`menu ${
    showConfigurator ? "menu-visible" : "menu-hidden"
  }`}

>{!showConfigurator && (
  <section className="option-group">
    <h2>
      <span>Choose Your Instrument</span>
    </h2>

    <div className="button-grid option-button-grid">

  <div className="locked-icon">
    <img
      src="/ui/buttons/bass_locked.png"
      alt="Bass"
    />
    <span>Bass</span>
  </div>

  <button
    className="image-button selected"
    onClick={() => chooseInstrument("guitar")}
  >
    <img
      src="/ui/buttons/guitar_active.png"
      alt="Guitar"
    />
    <span>Guitar</span>
  </button>

</div>

  </section>
)}
{showConfigurator && (
  <>
  <button
  className="back-button"
  onClick={backToInstrumentSelection}
>
  ← Change Instrument
</button>
  <div className="product-info">
            <h1>
              {selectedSize.label} {selectedLivery.label} {selectedColorway.label}
            </h1>
            <div className="cab-dimensions">
  {selectedSize.dimensions}
</div>

            <div className="price">${price.toLocaleString()}</div>

            <div className="spec-row">
  <span>{selectedSize.impedance}</span>
  <span>{speaker === "loaded" ? selectedSize.loadedDescription : "Speaker Ready"}</span>
  <span>{speaker === "loaded" ? selectedSize.watts : "Unloaded"}</span>
</div>
          </div><section className="option-group">
              <h2><span>Cab Size</span></h2>

              <div className="scroll-row">
                <div className="scroll-arrow left">‹</div>

                <div className="button-grid">
                  {cabSizes.map((item) => (
                    <button
                      key={item.id}
                      className={`image-button ${size === item.id ? "selected" : ""}`}
                      onClick={() => chooseSize(item.id)}
                    >
                      <img src={item.button} alt={item.label} />
                      <span>
                        {item.label} — $
                        {(speaker === "loaded"
                          ? item.loadedPrice
                          : item.unloadedPrice
                        ).toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="scroll-arrow right">›</div>
              </div>
            </section><section className="option-group">
              <h2><span>Livery</span></h2>

              <div className="scroll-row">
                <div className="scroll-arrow left">‹</div>

                <div className="button-grid">
                  {liveries.map((item) => (
                    <button
                      key={item.id}
                      className={`image-button ${livery === item.id ? "selected" : ""}`}
                      onClick={() => chooseLivery(item.id)}
                    >
                      <img src={buttonPath(item.id, livery === item.id)} alt={item.label} />
                      <span>{item.label}</span>
                    </button>
                  ))}

                  <div className="locked-icon">
                    <img src="/ui/buttons/locked.png" alt="Locked" />
                    <span>Coming Soon</span>
                  </div>
                </div>

                <div className="scroll-arrow right">›</div>
              </div>
            </section><section className="option-group">
              <h2><span>Colorway</span></h2>

              <div className="scroll-row">
                <div className="scroll-arrow left">‹</div>

                <div className="button-grid">
                  {validColorways.map((item) => (
                    <button
                      key={item.id}
                      className={`image-button ${colorway === item.id ? "selected" : ""}`}
                      onClick={() => setColorway(item.id)}
                    >
                      <img src={buttonPath(item.id, colorway === item.id)} alt={item.label} />
                      <span>{item.label}</span>
                    </button>
                  ))}

                  <div className="locked-icon">
                    <img src="/ui/buttons/locked.png" alt="Locked" />
                    <span>Coming Soon</span>
                  </div>
                </div>

                <div className="scroll-arrow right">›</div>
              </div>
            </section><section className="option-group">
              <h2><span>Speaker</span></h2>

              <div className="scroll-row">
                <div className="scroll-arrow left">‹</div>

                <div className="button-grid option-button-grid">
                  {speakerOptions.map((item) => (
                    <button
                      key={item.id}
                      className={`image-button ${speaker === item.id ? "selected" : ""}`}
                      onClick={() => setSpeaker(item.id)}
                    >
                      <img
                        src={speaker === item.id ? item.activeButton : item.idleButton}
                        alt={item.label} />
                      <span>
                        {item.label} — $
                        {(item.id === "loaded"
                          ? selectedSize.loadedPrice
                          : selectedSize.unloadedPrice
                        ).toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="scroll-arrow right">›</div>
              </div>
            </section><section className="option-group">
              <h2><span>Caster Option</span></h2>

              <div className="scroll-row">
                <div className="scroll-arrow left">‹</div>

                <div className="button-grid option-button-grid">
                  <button
                    className={`image-button ${casters && size !== "112" ? "selected" : ""} ${size === "112" ? "disabled-option" : ""}`}
                    disabled={size === "112"}
                    onClick={() => setCasters((current) => !current)}
                  >
                    <img
                      src={casters && size !== "112"
                        ? casterOption.activeButton
                        : casterOption.idleButton}
                      alt={casterOption.label} />
                    <span>
                      {size === "112" ? "2x12 / 4x12 Only" : "Casters — +$100"}
                    </span>
                  </button>
                </div>

                <div className="scroll-arrow right">›</div>
              </div>
            </section><button className="finalize" onClick={finalizeCab}>
              Go to Checkout
            </button>  </>
)}

        {cart.length > 0 && (
          <section className="cart">
            <h2>Cart</h2>

            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <span>
                  {item.size} / {item.livery} / {item.colorway} / {item.speaker}
                  {item.casters ? " / Casters" : ""}
                </span>

                <strong>${item.price.toLocaleString()}</strong>
              </div>
            ))}
          </section>
        )}
  </section>
    </main>
  );
}