import {
  Calculator, Scale, Landmark, LineChart, FileSignature, FolderLock,
  Receipt, MessageSquare, ShieldCheck, FileCheck2,
} from "lucide-react";
import { COLORS } from "../theme";
import { useParallax } from "../hooks";

function DotGridPattern({ style }) {
  return (
    <svg style={{ position: "absolute", pointerEvents: "none", ...style }} width="420" height="420" viewBox="0 0 420 420">
      <defs>
        <pattern id="dotgrid" width="26" height="26" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.6" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="420" height="420" fill="url(#dotgrid)" />
    </svg>
  );
}

function PlusPattern({ style }) {
  return (
    <svg style={{ position: "absolute", pointerEvents: "none", ...style }} width="360" height="360" viewBox="0 0 360 360">
      <defs>
        <pattern id="pluspattern" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M8 4 v8 M4 8 h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </pattern>
      </defs>
      <rect width="360" height="360" fill="url(#pluspattern)" />
    </svg>
  );
}

const FLOATING_ICON_ITEMS = [
  { Icon: Calculator, top: "10%", left: "8%", size: 46, iconSize: 20, color: COLORS.blue, soft: COLORS.blueSoft, driftClass: "float-drift-1", duration: 10, delay: 0 },
  { Icon: Scale, top: "18%", left: "88%", size: 40, iconSize: 18, color: COLORS.orange, soft: COLORS.orangeSoft, driftClass: "float-drift-2", duration: 12, delay: 0.6 },
  { Icon: Landmark, top: "62%", left: "5%", size: 42, iconSize: 19, color: COLORS.green, soft: COLORS.greenSoft, driftClass: "float-drift-3", duration: 11, delay: 1.1 },
  { Icon: LineChart, top: "70%", left: "92%", size: 44, iconSize: 20, color: COLORS.purple, soft: COLORS.purpleSoft, driftClass: "float-drift-1", duration: 13, delay: 1.8 },
  { Icon: FileSignature, top: "4%", left: "38%", size: 36, iconSize: 16, color: COLORS.red, soft: COLORS.redSoft, driftClass: "float-drift-2", duration: 9, delay: 0.3 },
  { Icon: FolderLock, top: "82%", left: "30%", size: 38, iconSize: 17, color: COLORS.blue, soft: COLORS.blueSoft, driftClass: "float-drift-3", duration: 14, delay: 2.2 },
  { Icon: Receipt, top: "30%", left: "18%", size: 34, iconSize: 15, color: COLORS.orange, soft: COLORS.orangeSoft, driftClass: "float-drift-1", duration: 10, delay: 2.6 },
  { Icon: MessageSquare, top: "24%", left: "70%", size: 38, iconSize: 17, color: COLORS.green, soft: COLORS.greenSoft, driftClass: "float-drift-2", duration: 12, delay: 1.4 },
  { Icon: ShieldCheck, top: "50%", left: "94%", size: 34, iconSize: 15, color: COLORS.red, soft: COLORS.redSoft, driftClass: "float-drift-3", duration: 9, delay: 0.9 },
  { Icon: FileCheck2, top: "48%", left: "3%", size: 32, iconSize: 14, color: COLORS.purple, soft: COLORS.purpleSoft, driftClass: "float-drift-1", duration: 11, delay: 1.6 },
];

function FloatingIcons() {
  return (
    <div style={{ position: "absolute", inset: 0, height: 460, overflow: "hidden", pointerEvents: "none" }}>
      {FLOATING_ICON_ITEMS.map(({ Icon, top, left, size, iconSize, color, soft, driftClass, duration, delay }, i) => (
        <div
          key={i}
          className={driftClass}
          style={{
            position: "absolute", top, left, width: size, height: size, borderRadius: size * 0.3,
            background: soft, display: "flex", alignItems: "center", justifyContent: "center",
            animationDuration: `${duration}s`, animationDelay: `${delay}s`,
            boxShadow: "0 8px 20px -10px rgba(20,18,30,0.12)",
          }}
        >
          <Icon size={iconSize} color={color} />
        </div>
      ))}
    </div>
  );
}

function AmbientBlobs() {
  const [ref1, y1] = useParallax(0.06);
  const [ref2, y2] = useParallax(0.1);
  return (
    <>
      <div ref={ref1} style={{ position: "absolute", top: -260, left: -120, width: 560, height: 560, transform: `translateY(${y1}px)`, willChange: "transform" }}>
        <div className="float-slow" style={{
          width: "100%", height: "100%",
          background: "radial-gradient(circle, rgba(255,4,33,0.14) 0%, rgba(255,4,33,0) 70%)",
          filter: "blur(10px)", pointerEvents: "none",
        }} />
      </div>
      <div ref={ref2} style={{ position: "absolute", top: -180, right: -160, width: 620, height: 620, transform: `translateY(${y2}px)`, willChange: "transform" }}>
        <div className="float-slower" style={{
          width: "100%", height: "100%",
          background: "radial-gradient(circle, rgba(201,3,26,0.10) 0%, rgba(201,3,26,0) 70%)",
          filter: "blur(10px)", pointerEvents: "none",
        }} />
      </div>
      <DotGridPattern style={{ top: 90, right: 0, color: COLORS.red, opacity: 0.14 }} />
      <PlusPattern style={{ bottom: 40, left: 0, color: COLORS.red, opacity: 0.12 }} />
    </>
  );
}

// ---------------------------------------------
// Shared hooks
// ---------------------------------------------
export { DotGridPattern, PlusPattern, FloatingIcons, AmbientBlobs };
