import { useRef, useState, useEffect, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { COLORS } from "../theme";
import { BracketLabel } from "./ui";
import { APPS, APP_PAGE_MAP } from "../data";

const CARD_WIDTH = 290;
const CARD_GAP = 20;

function AppGalleryCard({ app, setPage }) {
  const mapped = APP_PAGE_MAP[app.name];
  const color = mapped ? mapped.color : COLORS.red;
  const soft = mapped ? mapped.soft : COLORS.redSoft;

  return (
    <div
      style={{
        scrollSnapAlign: "start", flexShrink: 0, width: CARD_WIDTH,
        background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 20, overflow: "hidden",
        boxShadow: "0 16px 36px -20px rgba(20,18,30,0.16)",
        transition: "transform 320ms cubic-bezier(0.22,1,0.36,1), box-shadow 320ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 26px 50px -22px rgba(20,18,30,0.26)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 16px 36px -20px rgba(20,18,30,0.16)";
      }}
    >
      <div style={{ padding: "10px 14px", display: "flex", gap: 6, alignItems: "center", borderBottom: `1px solid ${COLORS.cardBorder}` }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#e5484d" }} />
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f5a623" }} />
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#2ecc71" }} />
      </div>
      <div style={{ padding: "22px 22px 26px", display: "flex", flexDirection: "column", gap: 13 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: soft, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <app.icon size={20} color={color} />
        </div>
        <div>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, color, letterSpacing: "0.05em" }}>{app.tag}</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.1rem", marginTop: 4, color: COLORS.text }}>{app.name}</div>
        </div>
        <div style={{ fontSize: "0.8rem", color: COLORS.textDim, lineHeight: 1.6, minHeight: 58 }}>{app.desc}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ height: 34, borderRadius: 8, background: soft }} />
          <div style={{ height: 34, borderRadius: 8, background: soft }} />
        </div>
        <div style={{ height: 56, borderRadius: 8, background: COLORS.cardAlt, border: `1px solid ${COLORS.cardBorder}` }} />
        {mapped && (
          <button
            onClick={() => setPage(mapped.key)}
            style={{ marginTop: 2, background: "none", border: "none", color, fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: 0 }}
          >
            เปิดดูแอปนี้ <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

function AppShowcaseSection({ setPage }) {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const dragState = useRef({ dragging: false, startX: 0, startScroll: 0, moved: false });

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    const step = CARD_WIDTH + CARD_GAP;
    setActiveIndex(Math.round(el.scrollLeft / step));
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollByCards = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (CARD_WIDTH + CARD_GAP) * 1.5, behavior: "smooth" });
  };

  const goTo = (i) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * (CARD_WIDTH + CARD_GAP), behavior: "smooth" });
  };

  // Drag-to-scroll for desktop mouse users
  const onPointerDown = (e) => {
    const el = trackRef.current;
    if (!el) return;
    dragState.current = { dragging: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    const el = trackRef.current;
    if (!el || !dragState.current.dragging) return;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > 4) dragState.current.moved = true;
    el.scrollLeft = dragState.current.startScroll - dx;
  };
  const endDrag = (e) => {
    const el = trackRef.current;
    if (el && dragState.current.dragging) {
      try { el.releasePointerCapture(e.pointerId); } catch {}
    }
    dragState.current.dragging = false;
  };

  return (
    <section style={{ position: "relative", zIndex: 2, maxWidth: 1180, margin: "0 auto", padding: "50px 24px 90px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <BracketLabel style={{ display: "inline-block" }}>APP SHOWCASE</BracketLabel>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.7rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em" }}>
          แอปทั้งหมดใน Obfice Base
        </div>
        <div style={{ color: COLORS.textDim, marginTop: 10, fontSize: "0.88rem" }}>เลื่อนดูแอปแต่ละตัวที่ช่วยให้งานสำนักงานง่ายขึ้น</div>
      </div>

      <div style={{ position: "relative" }}>
        <div style={{
          position: "absolute", top: 0, bottom: 12, left: 0, width: 48, zIndex: 3, pointerEvents: "none",
          background: "linear-gradient(90deg, #fff, rgba(255,255,255,0))",
          opacity: canScrollLeft ? 1 : 0, transition: "opacity 250ms ease",
        }} />
        <div style={{
          position: "absolute", top: 0, bottom: 12, right: 0, width: 48, zIndex: 3, pointerEvents: "none",
          background: "linear-gradient(270deg, #fff, rgba(255,255,255,0))",
          opacity: canScrollRight ? 1 : 0, transition: "opacity 250ms ease",
        }} />

        <div
          ref={trackRef}
          className="no-scrollbar"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onClickCapture={(e) => { if (dragState.current.moved) { e.stopPropagation(); e.preventDefault(); } }}
          style={{
            display: "flex", gap: CARD_GAP, overflowX: "auto", scrollSnapType: "x mandatory",
            padding: "6px 6px 20px", cursor: "grab", userSelect: "none", WebkitOverflowScrolling: "touch",
          }}
        >
          {APPS.map((app) => (
            <AppGalleryCard key={app.name} app={app} setPage={setPage} />
          ))}
        </div>

        <button
          aria-label="เลื่อนไปทางซ้าย"
          onClick={() => scrollByCards(-1)}
          disabled={!canScrollLeft}
          className="hide-xs"
          style={{
            position: "absolute", top: "40%", left: -18, transform: "translateY(-50%)", zIndex: 4,
            width: 42, height: 42, borderRadius: "50%", border: `1px solid ${COLORS.cardBorder}`, background: COLORS.card,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: canScrollLeft ? "pointer" : "default",
            boxShadow: "0 10px 24px -12px rgba(20,18,30,0.25)", opacity: canScrollLeft ? 1 : 0.35,
            transition: "opacity 200ms ease",
          }}
        >
          <ChevronLeft size={18} color={COLORS.text} />
        </button>
        <button
          aria-label="เลื่อนไปทางขวา"
          onClick={() => scrollByCards(1)}
          disabled={!canScrollRight}
          className="hide-xs"
          style={{
            position: "absolute", top: "40%", right: -18, transform: "translateY(-50%)", zIndex: 4,
            width: 42, height: 42, borderRadius: "50%", border: `1px solid ${COLORS.cardBorder}`, background: COLORS.card,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: canScrollRight ? "pointer" : "default",
            boxShadow: "0 10px 24px -12px rgba(20,18,30,0.25)", opacity: canScrollRight ? 1 : 0.35,
            transition: "opacity 200ms ease",
          }}
        >
          <ChevronRight size={18} color={COLORS.text} />
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
        {APPS.map((app, i) => (
          <button
            key={app.name}
            onClick={() => goTo(i)}
            style={{
              width: i === activeIndex ? 22 : 8, height: 8, borderRadius: 99, border: "none", cursor: "pointer", padding: 0,
              background: i === activeIndex ? COLORS.red : COLORS.cardBorder, transition: "all 250ms ease",
            }}
          />
        ))}
      </div>
    </section>
  );
}
export default AppShowcaseSection;
