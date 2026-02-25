import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Calendar, MapPin, Clock, PartyPopper, Gem, ExternalLink } from "lucide-react";

/* ─── Inject Pinyon Script font ─── */
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap');
    .font-script { 
      font-family: 'Pinyon Script', cursive !important;
    }
  `}</style>
);
const colors = {
  bg: "hsl(20, 30%, 98%)",
  bgSoft: "linear-gradient(180deg, hsl(20, 30%, 98%), hsl(350, 40%, 95%))",
  cream: "hsl(35, 40%, 95%)",
  primary: "hsl(350, 65%, 55%)",
  primaryFg: "hsl(20, 30%, 98%)",
  muted: "hsl(350, 20%, 45%)",
  foreground: "hsl(350, 30%, 15%)",
  foreground80: "hsl(350, 30%, 15%, 0.8)",
  foreground60: "hsl(350, 30%, 15%, 0.6)",
  blush: "hsl(350, 50%, 88%)",
  roseGoldLight: "hsl(15, 50%, 85%)",
  gold: "hsl(45, 80%, 55%)",
  border: "hsl(350, 25%, 88%, 0.5)",
  gradientRomantic: "linear-gradient(135deg, hsl(350, 65%, 55%), hsl(15, 60%, 70%))",
  shadowRomantic: "0 10px 40px -10px hsl(350, 65%, 55%, 0.3)",
  shadowSoft: "0 4px 20px -5px hsl(350, 30%, 50%, 0.15)",
  shadowGlow: "0 0 30px hsl(350, 65%, 55%, 0.2)",
};
/* ─── Sparkle Background ─── */
const SparklesBg = () => {
  const dots = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 3,
    delay: Math.random() * 4,
    dur: 2 + Math.random() * 3,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {dots.map((d) => (
        <motion.div
          key={d.id}
          style={{
            position: "absolute",
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            borderRadius: "50%",
            background: colors.gold,
          }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};
/* ─── Floating Hearts ─── */
const FloatingHearts = () => {
  const hearts = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 12 + Math.random() * 20,
    delay: Math.random() * 8,
    dur: 8 + Math.random() * 6,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          style={{ position: "absolute", left: `${h.x}%`, bottom: -30 }}
          animate={{ y: [0, -window.innerHeight - 100], x: [0, Math.sin(h.id) * 60], rotate: [0, 360] }}
          transition={{ duration: h.dur, delay: h.delay, repeat: Infinity, ease: "linear" }}
        >
          <Heart style={{ width: h.size, height: h.size, fill: "hsl(350,65%,55%,0.15)", color: "hsl(350,65%,55%,0.25)" }} />
        </motion.div>
      ))}
    </div>
  );
};
/* ─── Intro Animation (Rings) ─── */
const IntroAnimation = ({ onComplete }) => {
  const [showNames, setShowNames] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setShowNames(true), 1800);
    const t2 = setTimeout(() => onComplete(), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);
  return (
    <motion.div
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: colors.bgSoft }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <motion.div style={{ position: "relative", width: 192, height: 128 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div
            style={{ position: "absolute", left: 16, top: 0, width: 96, height: 96, borderRadius: "50%", border: `4px solid ${colors.gold}` }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, type: "spring", stiffness: 80 }}
          />
          <motion.div
            style={{ position: "absolute", right: 16, top: 0, width: 96, height: 96, borderRadius: "50%", border: "4px solid hsl(15,60%,70%)" }}
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, type: "spring", stiffness: 80, delay: 0.3 }}
          />
          <motion.div
            style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: -12 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <Gem style={{ width: 24, height: 24, color: colors.gold }} />
          </motion.div>
        </motion.div>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            style={{ position: "absolute", width: 8, height: 8, borderRadius: "50%", background: colors.gold, top: "45%", left: "50%" }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0], scale: [0, 1, 0],
              x: Math.cos((i * Math.PI * 2) / 8) * 100 - 4,
              y: Math.sin((i * Math.PI * 2) / 8) * 100 - 4,
            }}
            transition={{ duration: 1, delay: 1.5 + i * 0.08, ease: "easeOut" }}
          />
        ))}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={showNames ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ marginTop: 24, textAlign: "center" }}
        >
          <h1 className="font-script text-gradient-romantic" style={{ fontSize: "clamp(2.5rem, 6vw, 3.75rem)" }}>
            Ahmed &amp; Nouran
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={showNames ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="font-body"
            style={{ color: colors.muted, marginTop: 8, letterSpacing: "0.15em", textTransform: "uppercase", fontSize: "0.875rem" }}
          >
            We're getting engaged!
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};
/* ─── Hero Section ─── */
const HeroSection = () => (
  <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: colors.bgSoft }}>
    <SparklesBg />
    <motion.div
      style={{ position: "absolute", top: 80, left: 40, width: 128, height: 128, borderRadius: "50%", opacity: 0.5, filter: "blur(48px)", background: colors.blush }}
      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 5, repeat: Infinity }}
    />
    <motion.div
      style={{ position: "absolute", bottom: 80, right: 40, width: 192, height: 192, borderRadius: "50%", opacity: 0.4, filter: "blur(48px)", background: colors.roseGoldLight }}
      animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
      transition={{ duration: 6, repeat: Infinity }}
    />

    {/* ─── Main Content ─── */}
    <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "80px 16px 60px", maxWidth: 900, margin: "0 auto", width: "100%" }}>

      {/* YOU ARE INVITED */}
      <motion.div
        initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 24 }}
      >
        <motion.div animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 3, repeat: Infinity }}>
          <Sparkles style={{ width: 24, height: 24, color: colors.gold }} />
        </motion.div>
        <span className="font-body" style={{ color: colors.muted, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: "0.875rem" }}>
          You Are Invited
        </span>
        <motion.div animate={{ rotate: [10, -10, 10] }} transition={{ duration: 3, repeat: Infinity }}>
          <Sparkles style={{ width: 24, height: 24, color: colors.gold }} />
        </motion.div>
      </motion.div>

      {/* The Engagement of */}
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
        className="font-display" style={{ fontSize: "clamp(1.25rem, 3vw, 1.5rem)", color: colors.foreground60, marginBottom: 8 }}>
        The Engagement of
      </motion.p>

      {/* Ahmed - first */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.8, type: "spring", stiffness: 100 }}
        className="font-script text-gradient-romantic"
        style={{ fontSize: "clamp(4rem, 12vw, 10rem)", lineHeight: 1.15, marginBottom: 8, paddingTop: 16 }}
      >
        Ahmed
      </motion.h1>

      {/* Heart divider */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 1.2 }}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, margin: "16px 0" }}
      >
        <div style={{ height: 1, width: 64, background: colors.gradientRomantic }} />
        <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <Heart style={{ width: 32, height: 32, color: colors.primary, fill: colors.primary }} />
        </motion.div>
        <div style={{ height: 1, width: 64, background: colors.gradientRomantic }} />
      </motion.div>

      {/* Nouran - second */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 1.4, type: "spring", stiffness: 100 }}
        className="font-script text-gradient-romantic"
        style={{ fontSize: "clamp(4rem, 12vw, 10rem)", lineHeight: 1.15, marginBottom: 32 }}
      >
        Nouran
      </motion.h1>

      {/* Quote */}
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.8 }}
        className="font-body" style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)", color: colors.muted, maxWidth: 600, margin: "0px auto", fontStyle: "italic" }}>
        "Two hearts, one love, one beautiful beginning"
      </motion.p>
    </div>
  </section>
);
/* ─── Event Details ─── */
const DetailsSection = () => {
  const details = [
    { icon: Calendar, label: "Date", value: "March 24, 2026", sub: "Tuesday", link: null },
    { icon: Clock, label: "Time", value: "7:00 PM", sub: "Doors open at 7:00 PM", link: null },
    { icon: MapPin, label: "Location", value: "Rivera", sub: "Badrashin, Giza", link: "https://maps.app.goo.gl/acyXCUUHUgdjaxT98" },
  ];
  return (
    <section style={{ position: "relative", padding: "30px 0", overflow: "hidden", background: colors.cream }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", position: "relative", zIndex: 10 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="font-script" style={{ fontSize: "2.25rem", color: colors.primary, display: "block", marginBottom: 16 }}>Save The Date</span>
          <h2 className="font-display" style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", color: colors.foreground }}> Details</h2>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 32, maxWidth: 900, margin: "0 auto" }}>
          {details.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.15 }} viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.03 }}
              style={{ textAlign: "center" }}
            >
              <div
                onClick={() => d.link && window.open(d.link, "_blank")}
                style={{
                  borderRadius: 16, padding: 32, boxShadow: colors.shadowSoft, background: colors.bg,
                  border: `1px solid ${d.link ? colors.primary : colors.border}`,
                  transition: "all 0.5s",
                  cursor: d.link ? "pointer" : "default",
                  position: "relative",
                }}
              >
                {d.link && (
                  <div style={{ position: "absolute", top: 12, right: 12, display: "flex", alignItems: "center", gap: 4 }}>
                    <ExternalLink style={{ width: 14, height: 14, color: colors.primary }} />
                    <span className="font-body" style={{ fontSize: "0.7rem", color: colors.primary, letterSpacing: "0.05em" }}>Open Maps</span>
                  </div>
                )}
                <motion.div
                  style={{ width: 64, height: 64, margin: "0 auto 24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: colors.gradientRomantic, boxShadow: colors.shadowGlow }}
                  whileHover={{ rotate: 360 }} transition={{ duration: 0.8 }}
                >
                  <d.icon style={{ width: 28, height: 28, color: colors.primaryFg }} />
                </motion.div>
                <h3 className="font-display" style={{ fontSize: "1.125rem", color: colors.foreground, marginBottom: 4 }}>{d.label}</h3>
                <p className="font-display" style={{ fontSize: "1.25rem", fontWeight: 600, color: colors.foreground, marginBottom: 4 }}>{d.value}</p>
                <p className="font-body" style={{ fontSize: "0.875rem", color: colors.muted }}>{d.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
/* ─── Countdown ─── */
const CountdownSection = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const target = new Date("2026-03-24T19:00:00+02:00").getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];
  return (
    <section style={{ position: "relative", padding: "80px 0", overflow: "hidden", background: colors.bgSoft }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", position: "relative", zIndex: 10, textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <span className="font-script" style={{ fontSize: "2.25rem", color: colors.primary, display: "block", marginBottom: 16 }}>Counting Down</span>
          <h2 className="font-display" style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", color: colors.foreground, marginBottom: 48 }}>Until The Big Day</h2>
        </motion.div>
        <div style={{ display: "flex", justifyContent: "center", gap: "clamp(12px, 3vw, 32px)", flexWrap: "wrap" }}>
          {units.map((u, i) => (
            <motion.div key={u.label} initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}
              style={{ width: "clamp(80px, 15vw, 112px)" }}>
              <div style={{ borderRadius: 16, padding: "clamp(16px, 3vw, 24px)", boxShadow: colors.shadowRomantic, background: "hsl(20,30%,98%,0.9)", border: `1px solid ${colors.border}` }}>
                <motion.span key={u.value} initial={{ scale: 1.2 }} animate={{ scale: 1 }}
                  className="font-display text-gradient-romantic"
                  style={{ display: "block", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700 }}>
                  {String(u.value).padStart(2, "0")}
                </motion.span>
                <span className="font-body" style={{ fontSize: "clamp(0.7rem, 1.5vw, 0.875rem)", color: colors.muted, marginTop: 4, display: "block" }}>{u.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
/* ─── Love Quote ─── */
const QuoteSection = () => (
  <section style={{ position: "relative", padding: "80px 0", overflow: "hidden", background: colors.cream }}>
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 16px", textAlign: "center", position: "relative", zIndex: 10 }}>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ marginBottom: 32 }}>
          <Heart style={{ width: 48, height: 48, margin: "0 auto", color: colors.primary, fill: colors.primary }} />
        </motion.div>
        <p className="font-body" style={{ fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)", color: colors.foreground80, fontStyle: "italic", lineHeight: 1.8, marginBottom: 24 }}>
          "Every love story is beautiful, but ours is my favorite. Together we begin a new chapter filled with love, laughter, and happily ever after."
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <div style={{ height: 1, width: 80, background: colors.gradientRomantic }} />
          <span className="font-script" style={{ fontSize: "1.875rem", color: colors.primary }}>A &amp; N</span>
          <div style={{ height: 1, width: 80, background: colors.gradientRomantic }} />
        </div>
      </motion.div>
    </div>
  </section>
);
/* ─── Footer ─── */
const FooterComp = () => (
  <footer style={{ position: "relative", padding: "64px 0", overflow: "hidden", background: colors.bgSoft }}>
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", textAlign: "center", position: "relative", zIndex: 10 }}>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
        <PartyPopper style={{ width: 40, height: 40, margin: "0 auto 16px", color: colors.gold }} />
        <h2 className="font-script text-gradient-romantic" style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)", marginBottom: 16 }}>
          We Can't Wait To Celebrate With You!
        </h2>
        <p className="font-body" style={{ color: colors.muted, fontSize: "1.125rem", marginBottom: 32 }}>
          Your presence will make our special day even more magical
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <span className="font-body" style={{ color: colors.muted }}>Made with love</span>
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <Heart style={{ width: 20, height: 20, color: colors.primary, fill: colors.primary }} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  </footer>
);
/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */
function App() {
  const [showIntro, setShowIntro] = useState(true);
  return (
    <div style={{ position: "relative", minHeight: "100vh", overflowX: "hidden" }}>
      <FontStyle />
      <AnimatePresence>
        {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>
      {!showIntro && (
        <>
          <FloatingHearts />
          <HeroSection />
          <DetailsSection />
          <CountdownSection />
          <QuoteSection />
          <FooterComp />
        </>
      )}
    </div>
  );
}
export default App;