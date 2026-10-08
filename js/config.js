/* ==========================================================================
   QUANTUM CAT ($Schrodinger) - SITE CONFIG
   Edit the two constants below; everything else follows automatically.
   No emojis anywhere in copy.
   ========================================================================== */

// Official X account. The handle is about to be renamed: change it here only.
const X_URL = "https://x.com/Lkwaenzo12";

// Solana contract address (CA). Leave "" until launch.
// Once set, the DexScreener chart, the PumpSwap buy links and the Copy button switch on.
const CA = "";

const SOL_MINT = "So11111111111111111111111111111111111111112";

window.SITE = {
  name: "Quantum Cat",
  symbol: "Schrodinger",
  description: "A cat beyond certainty, roaming through waves of infinite possibility. Inspired by Schrödinger's famous thought experiment, Quantum Cat brings feline curiosity into a universe of superposition, glowing particles, and cosmic mystery. Both here and everywhere, it walks the line between what is real and what could be—with nine lives and countless realities to explore.",
  aboutLong: "Nobody knows what is inside the box until somebody looks. $Schrodinger lives on Solana in a permanent state of maybe: alive and asleep, here and everywhere, early and right on time. Open the box, observe the cat, and pick your reality.",
  chain: "solana",
  chainName: "Solana",
  contract: CA || "Coming soon",
  launched: Boolean(CA),
  domain: "schrodingerqcat.lol",
  links: {
    x: X_URL,
    telegram: "",                                   // leave empty to hide
    buy: CA ? `https://swap.pump.fun/?input=${SOL_MINT}&output=${CA}` : "",
    pumpfun: CA ? `https://pump.fun/coin/${CA}` : "",
    dexscreener: CA ? `https://dexscreener.com/solana/${CA}` : "",
    explorer: CA ? `https://solscan.io/token/${CA}` : ""
  },
  dexName: "PumpSwap",
  dexscreenerEmbed: CA ? `https://dexscreener.com/solana/${CA}?embed=1&theme=dark&trades=0&info=0` : "",
  icons: {
    chain: "assets/icons/solana.svg",
    dex: "assets/icons/pumpfun-logomark.svg",
    wallet: "assets/icons/phantom.svg"
  },
  wallet: "Phantom",
  gasToken: "SOL",
  steps: [
    { title: "Create a Wallet", icon: "assets/icons/phantom.svg", img: "assets/gen/scene-launch.webp",
      text: "Download Phantom from phantom.com or your app store and create a Solana wallet. Write down your recovery phrase and keep it private." },
    { title: "Get Some SOL", icon: "assets/icons/solana.svg", img: "assets/gen/scene-chain.webp",
      text: "Buy SOL inside Phantom or on an exchange and send it to your Phantom address. A small amount of SOL covers network fees." },
    { title: "Go to PumpSwap", icon: "assets/icons/pumpfun-logomark.svg", img: "assets/gen/about-scene.webp",
      text: "Open swap.pump.fun, connect Phantom, and paste the {symbol} contract address as the token to buy. Always double check the address." },
    { title: "Swap for {symbol}", icon: "assets/icons/dexscreener.svg", img: "assets/gen/scene-community.webp",
      text: "Enter the amount of SOL, confirm the swap in Phantom, and {symbol} lands in your wallet in seconds. Welcome to every reality at once." }
  ],
  marquee: ["Quantum Cat", "$Schrodinger", "|alive> + |asleep>", "Solana", "Nine Lives", "Superposition", "Open The Box"],
  stats: [
    { label: "Ticker", value: "$Schrodinger" },
    { label: "Chain", value: "Solana" },
    { label: "Lives", value: "9" },
    { label: "Realities", value: "Infinite" }
  ],
  // Lore gallery (opens in a lightbox). Images keep their aspect ratio.
  gallery: [
    { src: "assets/gen/about-scene.webp", caption: "State 01 - The Box", text: "A cat inside a cube of light. Observed or not, it is always watching." },
    { src: "assets/gen/scene-launch.webp", caption: "State 02 - The Path", text: "Every step leaves a trail of particles across the void." },
    { src: "assets/gen/scene-chain.webp", caption: "State 03 - Superposition", text: "One cat, many outcomes, all of them walking at once." },
    { src: "assets/gen/scene-community.webp", caption: "State 04 - The Multiverse Pack", text: "Every holder is another life in the infinite pack." }
  ],
  floaters: [                                      // transparent cutouts (white background removed)
    { src: "assets/gen/pose-sit.webp", cls: "fl-sit" },
    { src: "assets/gen/pose-leap.webp", cls: "fl-leap" }
  ],
  slots: { about: "assets/gen/about-scene.webp" },
  particles: { count: 80, speed: 0.3 }
};
