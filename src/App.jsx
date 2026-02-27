import { useState, useEffect, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Calendar, MapPin, Clock, PartyPopper, Gem, ExternalLink, Music, Volume2, VolumeX } from "lucide-react";

/* ════════════════════════════════════════════
   STYLES
════════════════════════════════════════════ */
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { overflow-x: hidden; }

    .font-script  { font-family: 'Pinyon Script', cursive !important; }
    .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
    .font-body    { font-family: 'Trebuchet MS', sans-serif; }

    .text-gradient-romantic {
      background: linear-gradient(135deg, hsl(350,65%,50%), hsl(15,65%,65%), hsl(45,80%,55%));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    @keyframes floatBtn {
      0%,100% { transform: translateY(0) rotate(0deg); }
      30%     { transform: translateY(-7px) rotate(-4deg); }
      70%     { transform: translateY(-4px) rotate(3deg); }
    }
    @keyframes rippleOut {
      0%   { transform: scale(1); opacity: .55; }
      100% { transform: scale(2.8); opacity: 0; }
    }
    @keyframes bar {
      0%,100% { height: 3px; }
      50%     { height: 20px; }
    }
    @keyframes promptPulse {
      0%,100% { box-shadow: 0 0 0 0 hsl(350,65%,55%,.5), 0 8px 32px hsl(350,65%,55%,.35); }
      60%     { box-shadow: 0 0 0 14px hsl(350,65%,55%,0), 0 8px 32px hsl(350,65%,55%,.35); }
    }
    @keyframes twinkle {
      0%,100% { opacity:0; transform:scale(.4); }
      50%     { opacity:1; transform:scale(1.2); }
    }
    @keyframes riseHeart {
      0%   { transform: translateY(0) translateX(0) rotate(0deg) scale(.8); opacity:0; }
      8%   { opacity:1; }
      90%  { opacity:.85; }
      100% { transform: translateY(-110vh) translateX(var(--dx)) rotate(var(--dr)) scale(1.1); opacity:0; }
    }
    @keyframes glowPulse {
      0%,100% { opacity:.07; transform:scale(1); }
      50%     { opacity:.22; transform:scale(1.28); }
    }

    .btn-float       { animation: floatBtn 3.2s ease-in-out infinite; }
    .btn-float:hover { animation-play-state: paused; }
    .btn-prompt      { animation: promptPulse 1.8s ease-out infinite; }
    .bar  { animation: bar .65s ease-in-out infinite; border-radius: 3px; width: 4px; background: white; }
    .b1   { animation-delay: 0s; }
    .b2   { animation-delay: .13s; }
    .b3   { animation-delay: .26s; }
    .b4   { animation-delay: .39s; }
    .rise-heart { animation: riseHeart var(--dur) var(--delay) linear infinite; }
    .glow-heart { animation: glowPulse var(--dur) var(--delay) ease-in-out infinite; }
  `}</style>
);

/* ════════════════════════════════════════════
   COLORS
════════════════════════════════════════════ */
const C = {
  bg:         "hsl(20,30%,98%)",
  bgGrad:     "linear-gradient(180deg,hsl(20,30%,98%),hsl(350,40%,95%))",
  cream:      "hsl(35,40%,95%)",
  primary:    "hsl(350,65%,55%)",
  primaryFg:  "hsl(20,30%,98%)",
  muted:      "hsl(350,20%,45%)",
  fg:         "hsl(350,30%,15%)",
  fg80:       "hsl(350,30%,15%,.8)",
  fg60:       "hsl(350,30%,15%,.6)",
  blush:      "hsl(350,50%,88%)",
  roseGold:   "hsl(15,50%,85%)",
  gold:       "hsl(45,80%,55%)",
  border:     "hsl(350,25%,88%,.5)",
  grad:       "linear-gradient(135deg,hsl(350,65%,55%),hsl(15,60%,70%))",
  shadowRose: "0 10px 40px -10px hsl(350,65%,55%,.3)",
  shadowSoft: "0 4px 20px -5px hsl(350,30%,50%,.15)",
  shadowGlow: "0 0 30px hsl(350,65%,55%,.2)",
};

/* ════════════════════════════════════════════
   HEART SVG helper
════════════════════════════════════════════ */
const HeartSvg = ({ size, fill, stroke, strokeWidth = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill={fill} stroke={stroke} strokeWidth={strokeWidth}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

/* ════════════════════════════════════════════
   LAYER 1: Rising hearts (CSS animation — zero JS overhead)
════════════════════════════════════════════ */
const RisingHearts = memo(() => {
  const items = useRef(
    Array.from({ length: 26 }, (_, i) => {
      const big   = Math.random() > .52;
      const size  = big ? 30 + Math.random() * 24 : 10 + Math.random() * 18;
      const hues  = [350, 350, 15, 45];
      const hue   = hues[i % 4];
      const alpha = big ? .15 + Math.random() * .13 : .1 + Math.random() * .1;
      return {
        id:     i,
        left:   (Math.random() * 100).toFixed(1),
        size,
        dur:    (11 + Math.random() * 11).toFixed(1),
        delay:  (Math.random() * 18).toFixed(1),
        dx:     ((Math.random() - .5) * 150).toFixed(0),
        dr:     ((Math.random() - .5) * 440).toFixed(0),
        hue,
        alpha,
        filled: Math.random() > .38,
        big,
      };
    })
  ).current;

  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
      {items.map(h => (
        <div key={h.id} className="rise-heart"
          style={{
            position: "absolute",
            left: `${h.left}%`,
            bottom: -70,
            "--dur":   `${h.dur}s`,
            "--delay": `${h.delay}s`,
            "--dx":    `${h.dx}px`,
            "--dr":    `${h.dr}deg`,
            filter: h.big
              ? `drop-shadow(0 0 ${7 + h.size * .14}px hsl(${h.hue},65%,58%,.4))`
              : "none",
          }}
        >
          <HeartSvg
            size={h.size}
            fill={h.filled ? `hsl(${h.hue},65%,60%,${h.alpha})` : "none"}
            stroke={`hsl(${h.hue},65%,55%,${h.alpha * 2.3})`}
            strokeWidth={h.filled ? 1 : 1.6}
          />
        </div>
      ))}
    </div>
  );
});

/* ════════════════════════════════════════════
   LAYER 2: Ambient glow hearts — large, blurred, pulsing
════════════════════════════════════════════ */
const GlowHearts = memo(() => {
  const items = useRef(
    Array.from({ length: 11 }, (_, i) => ({
      id:    i,
      left:  ((i * 9.5 + 3) % 100).toFixed(1),
      top:   ((i * 8.7 + 5) % 92).toFixed(1),
      size:  55 + Math.random() * 75,
      dur:   (2.8 + Math.random() * 2.4).toFixed(2),
      delay: (i * .42).toFixed(2),
      hue:   i % 2 === 0 ? 350 : 15,
    }))
  ).current;

  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
      {items.map(h => (
        <div key={h.id} className="glow-heart"
          style={{
            position: "absolute",
            left: `${h.left}%`,
            top:  `${h.top}%`,
            "--dur":   `${h.dur}s`,
            "--delay": `${h.delay}s`,
            filter: `blur(2.5px) drop-shadow(0 0 16px hsl(${h.hue},65%,55%,.22))`,
          }}
        >
          <HeartSvg
            size={h.size}
            fill={`hsl(${h.hue},65%,60%,.09)`}
            stroke={`hsl(${h.hue},65%,55%,.15)`}
            strokeWidth={.7}
          />
        </div>
      ))}
    </div>
  );
});

/* ════════════════════════════════════════════
   LAYER 3: Twinkling gold dots
════════════════════════════════════════════ */
const Twinkles = memo(() => {
  const dots = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      id:    i,
      x:     (Math.random() * 100).toFixed(1),
      y:     (Math.random() * 100).toFixed(1),
      size:  1.5 + Math.random() * 2.5,
      delay: (Math.random() * 5).toFixed(2),
      dur:   (2.5 + Math.random() * 3).toFixed(2),
    }))
  ).current;

  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}>
      {dots.map(d => (
        <div key={d.id} style={{
          position:  "absolute",
          left:      `${d.x}%`,
          top:       `${d.y}%`,
          width:     d.size,
          height:    d.size,
          borderRadius: "50%",
          background: C.gold,
          animation: `twinkle ${d.dur}s ${d.delay}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
});


const SONG_URL = "/i-found-love.mpeg"; 

const MusicPlayer = memo(() => {
  const [playing,  setPlaying]  = useState(false);
  const [muted,    setMuted]    = useState(false);
  const [prompted, setPrompted] = useState(false);
  const [ripples,  setRipples]  = useState([]);
  const audioRef   = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio(SONG_URL);
    audio.loop    = true;
    audio.volume  = 0.55;
    audio.preload = "auto";
    audioRef.current = audio;

    /* try immediate autoplay */
    audio.play()
      .then(() => { startedRef.current = true; setPlaying(true); })
      .catch(() => setPrompted(true));  // browser blocked → show nudge

    /* fallback: first gesture */
    const onGesture = () => {
      if (startedRef.current) return;
      audio.play().then(() => {
        startedRef.current = true;
        setPlaying(true);
        setPrompted(false);
      }).catch(() => {});
    };
    ["click","touchstart","scroll","keydown"].forEach(e =>
      window.addEventListener(e, onGesture, { once:true, passive:true })
    );

    return () => {
      audio.pause(); audio.src = "";
      ["click","touchstart","scroll","keydown"].forEach(e =>
        window.removeEventListener(e, onGesture)
      );
    };
  }, []);

  const addRipple = () => {
    const id = Date.now();
    setRipples(p => [...p, id]);
    setTimeout(() => setRipples(p => p.filter(r => r !== id)), 900);
  };

  const toggle = useCallback(() => {
    const a = audioRef.current; if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else         { a.play().catch(()=>{}); setPlaying(true); startedRef.current = true; setPrompted(false); }
    addRipple();
  }, [playing]);

  const toggleMute = useCallback(() => {
    const a = audioRef.current; if (!a) return;
    a.muted = !muted; setMuted(m => !m);
  }, [muted]);

  return (
    <div style={{ position:"fixed", bottom:28, right:28, zIndex:200,
                  display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8 }}>

      {/* tap-to-play nudge */}
      <AnimatePresence>
        {prompted && (
          <motion.div
            initial={{ opacity:0, x:20, scale:.85 }} animate={{ opacity:1, x:0, scale:1 }}
            exit={{ opacity:0, x:20, scale:.85 }}
            style={{ background:"white", borderRadius:14, padding:"9px 16px",
                     boxShadow:C.shadowRose, border:`1px solid ${C.border}`,
                     fontSize:".8rem", color:C.fg, fontFamily:"Trebuchet MS,sans-serif",
                     display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap" }}>
            <motion.span animate={{ scale:[1,1.4,1] }} transition={{ duration:1.2, repeat:Infinity }}>🎵</motion.span>
            Tap to play music
          </motion.div>
        )}
      </AnimatePresence>

      {/* main button */}
      <div style={{ position:"relative" }}>
        {ripples.map(id => (
          <div key={id} style={{ position:"absolute", inset:0, borderRadius:"50%",
                                  background:C.primary, animation:"rippleOut .9s ease-out forwards" }} />
        ))}
        {playing && (<>
          <motion.div style={{ position:"absolute", inset:-7, borderRadius:"50%", border:`2px solid ${C.primary}` }}
            animate={{ scale:[1,1.55,1], opacity:[.5,0,.5] }} transition={{ duration:2.2, repeat:Infinity }} />
          <motion.div style={{ position:"absolute", inset:-17, borderRadius:"50%", border:`1.5px solid ${C.blush}` }}
            animate={{ scale:[1,1.4,1], opacity:[.3,0,.3] }} transition={{ duration:2.2, repeat:Infinity, delay:.6 }} />
        </>)}

        <button onClick={toggle}
          className={`btn-float${prompted ? " btn-prompt" : ""}`}
          style={{ position:"relative", width:62, height:62, borderRadius:"50%",
                   background:C.grad, border:"none", cursor:"pointer",
                   display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:2,
                   boxShadow:`${C.shadowRose}, 0 0 0 3px white` }}>
          {playing
            ? <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:22 }}>
                {["b1","b2","b3","b4"].map(c => <div key={c} className={`bar ${c}`} />)}
              </div>
            : <Music style={{ width:26, height:26, color:"white" }} />}
        </button>
      </div>

      {/* song label */}
      <AnimatePresence>
        {playing && (
          <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:4 }}
            style={{ background:"white", borderRadius:20, padding:"5px 13px",
                     boxShadow:C.shadowSoft, border:`1px solid ${C.border}`,
                     fontSize:".7rem", color:C.muted, fontFamily:"Trebuchet MS,sans-serif",
                     display:"flex", alignItems:"center", gap:5 }}>
            <motion.span animate={{ opacity:[1,.3,1] }} transition={{ duration:1.2, repeat:Infinity }}>♪</motion.span>
            Perfect — Ed Sheeran
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

/* ════════════════════════════════════════════
   SPARKLE BG (hero only, Framer)
════════════════════════════════════════════ */
const SparklesBg = memo(() => {
  const dots = useRef(
    Array.from({ length: 16 }, (_, i) => ({
      id:i, x:Math.random()*100, y:Math.random()*100,
      size:2+Math.random()*2.5, delay:Math.random()*4, dur:3+Math.random()*3,
    }))
  ).current;
  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
      {dots.map(d => (
        <motion.div key={d.id}
          style={{ position:"absolute", left:`${d.x}%`, top:`${d.y}%`,
                   width:d.size, height:d.size, borderRadius:"50%", background:C.gold }}
          animate={{ opacity:[0,1,0] }}
          transition={{ duration:d.dur, delay:d.delay, repeat:Infinity }}
        />
      ))}
    </div>
  );
});

/* ════════════════════════════════════════════
   INTRO ANIMATION
════════════════════════════════════════════ */
const IntroAnimation = memo(({ onComplete }) => {
  const [showNames, setShowNames] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setShowNames(true), 1800);
    const t2 = setTimeout(onComplete, 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <motion.div style={{ position:"fixed", inset:0, zIndex:300,
                         display:"flex", alignItems:"center", justifyContent:"center", background:C.bgGrad }}
      exit={{ opacity:0 }} transition={{ duration:.8 }}>
      <GlowHearts />
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", position:"relative", zIndex:10 }}>
        <motion.div style={{ position:"relative", width:192, height:128 }} initial={{ opacity:0 }} animate={{ opacity:1 }}>
          <motion.div style={{ position:"absolute", left:16, top:0, width:96, height:96, borderRadius:"50%", border:`4px solid ${C.gold}` }}
            initial={{ scale:0, rotate:-180 }} animate={{ scale:1, rotate:0 }}
            transition={{ duration:1.2, type:"spring", stiffness:80 }} />
          <motion.div style={{ position:"absolute", right:16, top:0, width:96, height:96, borderRadius:"50%", border:"4px solid hsl(15,60%,70%)" }}
            initial={{ scale:0, rotate:180 }} animate={{ scale:1, rotate:0 }}
            transition={{ duration:1.2, type:"spring", stiffness:80, delay:.3 }} />
          <motion.div style={{ position:"absolute", left:"50%", transform:"translateX(-50%)", top:-12 }}
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.2, duration:.6 }}>
            <Gem style={{ width:24, height:24, color:C.gold }} />
          </motion.div>
        </motion.div>

        {[...Array(8)].map((_,i) => (
          <motion.div key={i}
            style={{ position:"absolute", width:8, height:8, borderRadius:"50%", background:C.gold, top:"45%", left:"50%" }}
            initial={{ opacity:0, scale:0 }}
            animate={{ opacity:[0,1,0], scale:[0,1,0],
              x:Math.cos(i*Math.PI*2/8)*100-4, y:Math.sin(i*Math.PI*2/8)*100-4 }}
            transition={{ duration:1, delay:1.5+i*.08, ease:"easeOut" }} />
        ))}

        <motion.div initial={{ opacity:0, y:20 }} animate={showNames?{opacity:1,y:0}:{}}
          transition={{ duration:.8 }} style={{ marginTop:24, textAlign:"center" }}>
          <h1 className="font-script text-gradient-romantic" style={{ fontSize:"clamp(2.5rem,6vw,3.75rem)" }}>
            Ahmed &amp; Nouran
          </h1>
          <motion.p initial={{ opacity:0 }} animate={showNames?{opacity:1}:{}} transition={{ duration:.5, delay:.3 }}
            className="font-body"
            style={{ color:C.muted, marginTop:8, letterSpacing:".15em", textTransform:"uppercase", fontSize:".875rem" }}>
            We're getting engaged!
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
});

/* ════════════════════════════════════════════
   HERO
════════════════════════════════════════════ */
const HeroSection = memo(() => (
  <section style={{ position:"relative", minHeight:"100vh", display:"flex",
                    alignItems:"center", justifyContent:"center", background:C.bgGrad, overflow:"hidden" }}>
    <SparklesBg />
    <motion.div style={{ position:"absolute", top:80, left:40, width:128, height:128,
                         borderRadius:"50%", filter:"blur(48px)", background:C.blush }}
      animate={{ scale:[1,1.2,1], opacity:[.3,.5,.3] }} transition={{ duration:6, repeat:Infinity }} />
    <motion.div style={{ position:"absolute", bottom:80, right:40, width:192, height:192,
                         borderRadius:"50%", filter:"blur(48px)", background:C.roseGold }}
      animate={{ scale:[1.2,1,1.2], opacity:[.4,.2,.4] }} transition={{ duration:7, repeat:Infinity }} />

    <div style={{ position:"relative", zIndex:10, textAlign:"center",
                  padding:"80px 16px 60px", maxWidth:900, margin:"0 auto", width:"100%" }}>
      <motion.div initial={{ opacity:0, y:-30 }} animate={{ opacity:1, y:0 }} transition={{ duration:1, delay:.2 }}
        style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, marginBottom:24 }}>
        <motion.div animate={{ rotate:[-10,10,-10] }} transition={{ duration:3, repeat:Infinity }}>
          <Sparkles style={{ width:24, height:24, color:C.gold }} />
        </motion.div>
        <span className="font-body" style={{ color:C.muted, letterSpacing:".2em", textTransform:"uppercase", fontSize:".875rem" }}>
          You Are Invited
        </span>
        <motion.div animate={{ rotate:[10,-10,10] }} transition={{ duration:3, repeat:Infinity }}>
          <Sparkles style={{ width:24, height:24, color:C.gold }} />
        </motion.div>
      </motion.div>

      <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.8, delay:.5 }}
        className="font-display" style={{ fontSize:"clamp(1.25rem,3vw,1.5rem)", color:C.fg60, marginBottom:8 }}>
        The Engagement of
      </motion.p>

      <motion.h1 initial={{ opacity:0, scale:.8 }} animate={{ opacity:1, scale:1 }}
        transition={{ duration:1.2, delay:.8, type:"spring", stiffness:100 }}
        className="font-script text-gradient-romantic"
        style={{ fontSize:"clamp(4rem,12vw,10rem)", lineHeight:1.15, marginBottom:8, paddingTop:16 }}>
        Ahmed
      </motion.h1>

      <motion.div initial={{ opacity:0, scale:0 }} animate={{ opacity:1, scale:1 }}
        transition={{ duration:.6, delay:1.2 }}
        style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, margin:"16px 0" }}>
        <div style={{ height:1, width:64, background:C.grad }} />
        <motion.div animate={{ scale:[1,1.3,1] }} transition={{ duration:2, repeat:Infinity }}>
          <Heart style={{ width:32, height:32, color:C.primary, fill:C.primary }} />
        </motion.div>
        <div style={{ height:1, width:64, background:C.grad }} />
      </motion.div>

      <motion.h1 initial={{ opacity:0, scale:.8 }} animate={{ opacity:1, scale:1 }}
        transition={{ duration:1.2, delay:1.4, type:"spring", stiffness:100 }}
        className="font-script text-gradient-romantic"
        style={{ fontSize:"clamp(4rem,12vw,10rem)", lineHeight:1.15, marginBottom:32 }}>
        Nouran
      </motion.h1>

      <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.8, delay:1.8 }}
        className="font-body" style={{ fontSize:"clamp(1rem,2.5vw,1.25rem)", color:C.muted,
        maxWidth:600, margin:"0 auto", fontStyle:"italic" }}>
        "Two hearts, one love, one beautiful beginning"
      </motion.p>
    </div>
  </section>
));

/* ════════════════════════════════════════════
   DETAILS
════════════════════════════════════════════ */
const DetailsSection = memo(() => {
  const details = [
    { icon:Calendar, label:"Date",     value:"March 24, 2026", sub:"Tuesday",               link:null },
    { icon:Clock,    label:"Time",     value:"7:00 PM",         sub:"Doors open at 7:00 PM", link:null },
    { icon:MapPin,   label:"Location", value:"Rivera",          sub:"Badrashin, Giza",       link:"https://maps.app.goo.gl/acyXCUUHUgdjaxT98" },
  ];
  return (
    <section style={{ position:"relative", padding:"80px 0", background:C.cream }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 16px" }}>
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
          transition={{ duration:.8 }} viewport={{ once:true, margin:"-50px" }}
          style={{ textAlign:"center", marginBottom:64 }}>
          <span className="font-script" style={{ fontSize:"2.25rem", color:C.primary, display:"block", marginBottom:16 }}>
            Save The Date
          </span>
          <h2 className="font-display" style={{ fontSize:"clamp(1.5rem,4vw,2.25rem)", color:C.fg }}>Details</h2>
        </motion.div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
                      gap:32, maxWidth:900, margin:"0 auto" }}>
          {details.map((d,i) => (
            <motion.div key={i} initial={{ opacity:0, y:50 }} whileInView={{ opacity:1, y:0 }}
              transition={{ duration:.6, delay:i*.15 }} viewport={{ once:true, margin:"-30px" }}
              whileHover={{ y:-8, scale:1.03 }}>
              <div onClick={() => d.link && window.open(d.link,"_blank")}
                style={{ borderRadius:16, padding:32, boxShadow:C.shadowSoft, background:C.bg,
                         border:`1px solid ${d.link?C.primary:C.border}`,
                         cursor:d.link?"pointer":"default", position:"relative", textAlign:"center" }}>
                {d.link && (
                  <div style={{ position:"absolute", top:12, right:12, display:"flex", alignItems:"center", gap:4 }}>
                    <ExternalLink style={{ width:14, height:14, color:C.primary }} />
                    <span className="font-body" style={{ fontSize:".7rem", color:C.primary }}>Open Maps</span>
                  </div>
                )}
                <motion.div style={{ width:64, height:64, margin:"0 auto 24px", borderRadius:"50%",
                                     display:"flex", alignItems:"center", justifyContent:"center",
                                     background:C.grad, boxShadow:C.shadowGlow }}
                  whileHover={{ rotate:360 }} transition={{ duration:.8 }}>
                  <d.icon style={{ width:28, height:28, color:C.primaryFg }} />
                </motion.div>
                <h3 className="font-display" style={{ fontSize:"1.125rem", color:C.fg, marginBottom:4 }}>{d.label}</h3>
                <p  className="font-display" style={{ fontSize:"1.25rem", fontWeight:600, color:C.fg, marginBottom:4 }}>{d.value}</p>
                <p  className="font-body"    style={{ fontSize:".875rem", color:C.muted }}>{d.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

/* ════════════════════════════════════════════
   COUNTDOWN
════════════════════════════════════════════ */
const CountdownSection = memo(() => {
  const [t, setT] = useState({ days:0, hours:0, minutes:0, seconds:0 });
  useEffect(() => {
    const target = new Date("2026-03-24T19:00:00+02:00").getTime();
    const tick = () => {
      const d = Math.max(0, target - Date.now());
      setT({ days:Math.floor(d/86400000), hours:Math.floor(d%86400000/3600000),
             minutes:Math.floor(d%3600000/60000), seconds:Math.floor(d%60000/1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const units = [
    { label:"Days", value:t.days }, { label:"Hours", value:t.hours },
    { label:"Minutes", value:t.minutes }, { label:"Seconds", value:t.seconds },
  ];
  return (
    <section style={{ padding:"80px 0", background:C.bgGrad }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 16px", textAlign:"center" }}>
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
          transition={{ duration:.8 }} viewport={{ once:true, margin:"-50px" }}>
          <span className="font-script" style={{ fontSize:"2.25rem", color:C.primary, display:"block", marginBottom:16 }}>
            Counting Down
          </span>
          <h2 className="font-display" style={{ fontSize:"clamp(1.5rem,4vw,2.25rem)", color:C.fg, marginBottom:48 }}>
            Until The Big Day
          </h2>
        </motion.div>
        <div style={{ display:"flex", justifyContent:"center", gap:"clamp(12px,3vw,32px)", flexWrap:"wrap" }}>
          {units.map((u,i) => (
            <motion.div key={u.label} initial={{ opacity:0, scale:.5 }} whileInView={{ opacity:1, scale:1 }}
              transition={{ duration:.5, delay:i*.1 }} viewport={{ once:true, margin:"-30px" }}
              style={{ width:"clamp(80px,15vw,112px)" }}>
              <div style={{ borderRadius:16, padding:"clamp(16px,3vw,24px)", boxShadow:C.shadowRose,
                            background:"hsl(20,30%,98%,.9)", border:`1px solid ${C.border}` }}>
                <motion.span key={u.value} initial={{ scale:1.2 }} animate={{ scale:1 }}
                  className="font-display text-gradient-romantic"
                  style={{ display:"block", fontSize:"clamp(1.75rem,4vw,2.5rem)", fontWeight:700 }}>
                  {String(u.value).padStart(2,"0")}
                </motion.span>
                <span className="font-body" style={{ fontSize:"clamp(.7rem,1.5vw,.875rem)", color:C.muted, marginTop:4, display:"block" }}>
                  {u.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

/* ════════════════════════════════════════════
   QUOTE
════════════════════════════════════════════ */
const QuoteSection = memo(() => (
  <section style={{ padding:"80px 0", background:C.cream }}>
    <div style={{ maxWidth:700, margin:"0 auto", padding:"0 16px", textAlign:"center" }}>
      <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
        transition={{ duration:.8 }} viewport={{ once:true, margin:"-50px" }}>
        <motion.div animate={{ scale:[1,1.2,1] }} transition={{ duration:2.5, repeat:Infinity }} style={{ marginBottom:32 }}>
          <Heart style={{ width:48, height:48, margin:"0 auto", color:C.primary, fill:C.primary }} />
        </motion.div>
        <p className="font-body" style={{ fontSize:"clamp(1.125rem,2.5vw,1.5rem)", color:C.fg80,
           fontStyle:"italic", lineHeight:1.8, marginBottom:24 }}>
          "Every love story is beautiful, but ours is my favorite. Together we begin a new chapter
           filled with love, laughter, and happily ever after."
        </p>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16 }}>
          <div style={{ height:1, width:80, background:C.grad }} />
          <span className="font-script" style={{ fontSize:"1.875rem", color:C.primary }}>A &amp; N</span>
          <div style={{ height:1, width:80, background:C.grad }} />
        </div>
      </motion.div>
    </div>
  </section>
));

/* ════════════════════════════════════════════
   FOOTER
════════════════════════════════════════════ */
const FooterComp = memo(() => (
  <footer style={{ padding:"64px 0", background:C.bgGrad }}>
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 16px", textAlign:"center" }}>
      <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
        transition={{ duration:.8 }} viewport={{ once:true, margin:"-50px" }}>
        <PartyPopper style={{ width:40, height:40, margin:"0 auto 16px", color:C.gold }} />
        <h2 className="font-script text-gradient-romantic"
          style={{ fontSize:"clamp(2rem,5vw,3.75rem)", marginBottom:16 }}>
          We Can't Wait To Celebrate With You!
        </h2>
        <p className="font-body" style={{ color:C.muted, fontSize:"1.125rem", marginBottom:32 }}>
          Your presence will make our special day even more magical
        </p>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}>
          <span className="font-body" style={{ color:C.muted }}>Made with love</span>
          <motion.div animate={{ scale:[1,1.3,1] }} transition={{ duration:1.5, repeat:Infinity }}>
            <Heart style={{ width:20, height:20, color:C.primary, fill:C.primary }} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  </footer>
));

/* ════════════════════════════════════════════
   APP
════════════════════════════════════════════ */
export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const done = useCallback(() => setShowIntro(false), []);
  return (
    <div style={{ position:"relative", minHeight:"100vh", overflowX:"hidden" }}>
      <FontStyle />
      <AnimatePresence>
        {showIntro && <IntroAnimation onComplete={done} />}
      </AnimatePresence>
      {!showIntro && (
        <>
          <GlowHearts />
          <RisingHearts />
          <Twinkles />
          <HeroSection />
          <DetailsSection />
          <CountdownSection />
          <QuoteSection />
          <FooterComp />
          <MusicPlayer />
        </>
      )}
    </div>
  );
}