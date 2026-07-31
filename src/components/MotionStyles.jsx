// Global keyframes for subtle, tasteful motion — mounted once at the app root.
function MotionStyles() {
  return (
    <style>{`
      @keyframes floatY { 0% { transform: translateY(0); } 50% { transform: translateY(-16px); } 100% { transform: translateY(0); } }
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      @keyframes pulseSoft { 0%, 100% { opacity: 0.55; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
      @keyframes badgePulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.07); } }
      @keyframes scrollCue { 0%, 100% { transform: translateY(0); opacity: 0.5; } 50% { transform: translateY(8px); opacity: 1; } }
      @keyframes auroraFlow { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
      @keyframes floatDrift1 { 0%,100% { transform: translate(0,0) rotate(0deg); } 25% { transform: translate(16px,-22px) rotate(6deg); } 50% { transform: translate(-8px,-36px) rotate(-4deg); } 75% { transform: translate(-18px,-12px) rotate(3deg); } }
      @keyframes floatDrift2 { 0%,100% { transform: translate(0,0) rotate(0deg); } 33% { transform: translate(-20px,-16px) rotate(-6deg); } 66% { transform: translate(14px,-28px) rotate(5deg); } }
      @keyframes floatDrift3 { 0%,100% { transform: translate(0,0) rotate(0deg); } 40% { transform: translate(18px,18px) rotate(4deg); } 70% { transform: translate(-12px,-16px) rotate(-5deg); } }
      .float-drift-1 { animation-name: floatDrift1; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
      .float-drift-2 { animation-name: floatDrift2; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
      .float-drift-3 { animation-name: floatDrift3; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
      @keyframes logoShimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
      @keyframes logoPop { 0% { opacity: 0; transform: scale(0.7) rotate(-8deg); } 60% { opacity: 1; transform: scale(1.08) rotate(3deg); } 100% { opacity: 1; transform: scale(1) rotate(0deg); } }
      @keyframes dotChase {
        0% { opacity: 0.22; transform: scale(0.75); box-shadow: none; }
        14% { opacity: 1; transform: scale(1.25); box-shadow: 0 0 6px 2px rgba(255,4,33,0.65); }
        30% { opacity: 0.22; transform: scale(0.75); box-shadow: none; }
        100% { opacity: 0.22; transform: scale(0.75); box-shadow: none; }
      }
      @keyframes dotPulse { 0%, 100% { opacity: 0.22; transform: translate(-50%, -50%) scale(0.75); } 30% { opacity: 1; transform: translate(-50%, -50%) scale(1.25); } 60% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.8); } }
      @keyframes dotChase {
        0%, 100% { opacity: 0.25; transform: scale(0.75); box-shadow: none; }
        30% { opacity: 1; transform: scale(1.2); box-shadow: 0 0 6px 2px rgba(255,4,33,0.7); }
      }
      .fade-up { animation: fadeInUp 700ms cubic-bezier(0.16,1,0.3,1) both; }
      .float-slow { animation: floatY 9s ease-in-out infinite; }
      .float-slower { animation: floatY 13s ease-in-out infinite; }
      .logo-mark { animation: logoPop 700ms cubic-bezier(0.34,1.56,0.64,1) both; transition: transform 300ms ease; }
      .logo-word { background-size: 200% auto; animation: logoShimmer 4s linear infinite; }
      .logo-group:hover .logo-mark { transform: rotate(-8deg) scale(1.12); }
      .nav-mobile-toggle { display: none; }
      .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      @media (max-width: 880px) {
        .nav-links-desktop, .nav-actions-desktop { display: none !important; }
        .nav-mobile-toggle { display: flex !important; }
      }
      @media (max-width: 480px) {
        .hide-xs { display: none !important; }
      }

      /* ---------------------------------------------
         Space theme: drifting shooting stars + twinkles
         --------------------------------------------- */
      @keyframes shootingStar {
        0% { transform: translate(0, 0) rotate(215deg); opacity: 0; }
        6% { opacity: 1; }
        80% { opacity: 1; }
        100% { transform: translate(-620px, 460px) rotate(215deg); opacity: 0; }
      }
      @keyframes twinkleStar {
        0%, 100% { opacity: 0.25; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1.15); }
      }
      @keyframes driftCloud {
        0% { transform: translateX(0); }
        100% { transform: translateX(40px); }
      }
      .space-starfield {
        position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0;
      }
      .space-shooting-star {
        position: absolute; width: 2px; height: 2px; border-radius: 999px;
        background: linear-gradient(90deg, rgba(79,142,247,0), #ffffff 60%, #bcdcff);
        box-shadow: 0 0 6px 1px rgba(255,255,255,0.9);
        animation-name: shootingStar; animation-timing-function: ease-in;
        animation-iteration-count: infinite;
      }
      .space-shooting-star::before {
        content: ""; position: absolute; top: 50%; right: 0; width: 90px; height: 1.5px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.9));
        transform: translateY(-50%);
      }
      .space-twinkle {
        position: absolute; border-radius: 999px; background: #ffffff;
        animation-name: twinkleStar; animation-timing-function: ease-in-out; animation-iteration-count: infinite;
      }
    `}</style>
  );
}

// ---------------------------------------------
// Decorative pattern layers
// ---------------------------------------------
export default MotionStyles;
