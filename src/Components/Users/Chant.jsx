
// // import React, { useEffect, useMemo, useState } from "react";
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   Plus,
//   Menu,
//   Trash2,
//   RotateCcw,
//   Flag,
//   BookOpen,
//   Download,
//   X,
//   Eye,
//   Volume2,
//   VolumeX,
// } from "lucide-react";

// import axios from "axios";

// import lordVishnu from "../../assets/Theme/lord vishnu.jpg";
// import hanumanImage from "../../assets/Theme/hanuman.png";
// import shivaImage from "../../assets/Theme/shiva.jpg";
// import lotusImage from "../../assets/Theme/lotus.jpg";
// // import ganeshaImage from "../../assets/Theme/ganesha.jpg";
// import ganeshaImage from "../../assets/Theme/ganesha1.jpg";
// import swamiSamarthImage from "../../assets/Theme/swami_samrth.jpg";

// import "../../CSS/Chant.css";

// const MALA_SIZE = 108;

// const KEYS = {
//   chants: "sks_chants",
//   selected: "sks_selected_chant",
//   counts: "sks_jaap_counts",
//   history: "sks_jaap_history",
//   paused: "sks_jaap_paused",
// };



// // Add this below KEYS
// const OLD_DEFAULT_IDS = [
//   "ram",
//   "krishna",
//   "shiv",
//   "shiv-namastubhyam",
//   "hanuman",
// ];

// function readSaved(key, fallback) {
//   try {
//     const value = localStorage.getItem(key);
//     return value === null ? fallback : JSON.parse(value);
//   } catch {
//     return fallback;
//   }
// }

// function createId() {
//   if (typeof crypto !== "undefined" && crypto.randomUUID) {
//     return crypto.randomUUID();
//   }

//   return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
// }

// function getTheme(chant) {
//   if (!chant) return "vishnu";

//   const name = String(chant.name || "")
//     .normalize("NFC")
//     .toLowerCase();


//   const swamiKeywords = [
//     "स्वामी समर्थ",
//     "श्री स्वामी समर्थ",
//     "swami samarth",
//     "akkalkot",
//   ]

//   // SHIVA
//   const shivaKeywords = [
//     "शिव",
//     "शिवाय",
//     "शंकर",
//     "महादेव",
//     "महेश",
//     "भोले",
//     "रुद्र",
//     "shiv",
//     "shiva",
//     "shankar",
//     "mahadev",
//     "mahesh",
//     "bholenath",
//     "rudra",
//   ];

//   // HANUMAN
//   const hanumanKeywords = [
//     "हनुमान",
//     "हनुमते",
//     "बजरंग",
//     "मारुति",
//     "पवनपुत्र",
//     "अंजनी",
//     "hanuman",
//     "hanumate",
//     "bajrang",
//     "maruti",
//     "pavanputra",
//     "anjaney",
//   ];

//   // RAM
//   const ramKeywords = [
//     "राम",
//     "रघुनाथ",
//     "रघुवीर",
//     "सीताराम",
//     "ram",
//     "rama",
//     "raghunath",
//     "raghuveer",
//     "sitaram",
//   ];

//   // KRISHNA / VISHNU
//   const vishnuKeywords = [
//     "कृष्ण",
//     "कान्हा",
//     "गोविंद",
//     "गोपाल",
//     "श्याम",
//     "माधव",
//     "विष्णु",
//     "नारायण",
//     "हरि",
//     "krishna",
//     "krishan",
//     "kanha",
//     "govind",
//     "gopal",
//     "shyam",
//     "madhav",
//     "vishnu",
//     "narayan",
//     "hari",
//   ];

//   const ganeshaKeywords = [
//     "गणेश",
//     "गणपति",
//     "गणपतये",
//     "गणेशाय",
//     "गणपती",
//     "गजानन",
//     "एकदन्त",
//     "एकदंत",
//     "वक्रतुण्ड",
//     "वक्रतुंड",
//     "विघ्नेश्वर",
//     "गं",
//     "ganesh",
//     "ganesha",
//     "ganpati",
//     "ganapati",
//     "gajanan",
//     "ekdant",
//     "vakratunda",
//     "vighneshwar",
//   ];

//   if (ganeshaKeywords.some((word) => name.includes(word))) {
//     return "ganesha";
//   }

//   if (swamiKeywords.some((word) => name.includes(word))) {
//     return "swami";
//   }

//   if (shivaKeywords.some((word) => name.includes(word))) {
//     return "shiva";
//   }

//   if (hanumanKeywords.some((word) => name.includes(word))) {
//     return "hanuman";
//   }

//   if (ramKeywords.some((word) => name.includes(word))) {
//     return "hanuman";
//   }

//   if (vishnuKeywords.some((word) => name.includes(word))) {
//     return "vishnu";
//   }

//   // Fallback for existing saved default chants.
//   if (
//     chant.id === "shiv" ||
//     chant.id === "shiv-namastubhyam"
//   ) {
//     return "shiva";
//   }

//   if (chant.id === "ram" || chant.id === "hanuman") {
//     return "hanuman";
//   }

//   return "vishnu";
// }

// function formatDate(date) {
//   const parsed = new Date(date);

//   if (Number.isNaN(parsed.getTime())) {
//     return "—";
//   }

//   return parsed.toLocaleString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }

// export default function Chant() {
//   // ---------------------------------------
//   // SAVED CHANTS
//   // ---------------------------------------

//   const [chants, setChants] = useState(() => {
//     const savedChants = readSaved(KEYS.chants, []);

//     if (!Array.isArray(savedChants)) {
//       return [];
//     }

//     return savedChants.filter(
//       (chant) => !OLD_DEFAULT_IDS.includes(chant.id)
//     );
//   });



//   const [selectedChantId, setSelectedChantId] = useState(() =>
//     readSaved(KEYS.selected, "")
//   );

//   const [counts, setCounts] = useState(() =>
//     readSaved(KEYS.counts, {})
//   );

//   const [selectedVoice, setSelectedVoice] = useState("kanha");
//   const [isMuted, setIsMuted] = useState(false);

//   const [history, setHistory] = useState(() =>
//     readSaved(KEYS.history, [])
//   );
//   const [pausedJaaps, setPausedJaaps] = useState(() =>
//     readSaved(KEYS.paused, {})
//   );


//   const [resumedJaaps, setResumedJaaps] = useState(() =>
//     readSaved("sks_jaap_resumed", {})
//   );

//   // ---------------------------------------
//   // UI STATES
//   // ---------------------------------------

//   const [showAddForm, setShowAddForm] = useState(false);
//   const [mobileDrawer, setMobileDrawer] = useState(null);
//   const [newChantName, setNewChantName] = useState("");
//   const [notice, setNotice] = useState("");

//   const [previewEntry, setPreviewEntry] = useState(null);
//   const [exportingId, setExportingId] = useState(null);

//   const audioRef = useRef(null);
//   const [playingChantId, setPlayingChantId] = useState(null);

//   async function playKanhaVoice(text, voice = "kanha") {
//     const token = sessionStorage.getItem("authToken");

//     if (!token) {
//       throw new Error("Please login again");
//     }

//     const response = await axios.post(
//       // "http://localhost:4000/api/chant-tts/speak" || "https://sks-serverproject-new.onrender.com/api/chant-tts/speak",
//       "https://sks-serverproject-new.onrender.com/api/chant-tts/speak",
//       { text, voice },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         responseType: "blob",
//         timeout: 45000,
//       }
//     );

//     return URL.createObjectURL(response.data);
//   }

//   const chantAudio = {
//     shivaya: "/Audio/ShriShivayNamastubhyamm.mp3",
//   };

//   function getChantAudio(chant) {
//     const name = String(chant?.name || "")
//       .normalize("NFC")
//       .replace(/[।॥|]/g, "")
//       .replace(/\s+/g, "")
//       .trim();

//     if (name.includes("शिवायनमस्तुभ्यम्")) {
//       return chantAudio.shivaya;
//     }

//     return null;
//   }


//   async function handlePlayChant(chant) {



//     if (isMuted) return;
//     // Stop any currently playing audio.
//     if (audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current = null;
//     }

//     // Clicking the same speaker again stops playback.
//     if (playingChantId === chant.id) {
//       setPlayingChantId(null);
//       return;
//     }

//     setPlayingChantId(chant.id);
//     setNotice("");

//     let audioUrl = null;

//     try {
//       // Generate or retrieve cached Kanha audio.
//       audioUrl = await playKanhaVoice(chant.name, selectedVoice);

//       const audio = new Audio(audioUrl);
//       audioRef.current = audio;

//       const cleanup = () => {
//         URL.revokeObjectURL(audioUrl);

//         if (audioRef.current === audio) {
//           audioRef.current = null;
//           setPlayingChantId(null);
//         }
//       };

//       audio.onended = cleanup;
//       audio.onerror = cleanup;

//       await audio.play();
//     } catch (error) {
//       if (audioUrl) {
//         URL.revokeObjectURL(audioUrl);
//       }

//       console.error("Kanha voice playback failed:", error);
//       setPlayingChantId(null);
//       setNotice("Unable to play Kanha voice. Check Console.");
//     }
//   }


//   function handleToggleMute() {
//     setIsMuted((previous) => !previous);

//     if (!isMuted && audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current.currentTime = 0;
//       audioRef.current = null;
//       setPlayingChantId(null);
//     }
//   }

//   useEffect(() => {
//     return () => {
//       audioRef.current?.pause();
//       audioRef.current = null;
//     };
//   }, []);

//   // Parent dashboard hamburger can open the existing Chant drawer.
//   useEffect(() => {
//     const openFromDashboard = (event) => {
//       if (event.detail === "chants" || event.detail === "history") {
//         setMobileDrawer(event.detail);
//       }
//     };
//     window.addEventListener("sks:chant-menu", openFromDashboard);
//     return () => window.removeEventListener("sks:chant-menu", openFromDashboard);
//   }, []);

//   // Mobile drawer: Escape closes it; lock page scroll while open.
//   useEffect(() => {
//     if (!mobileDrawer) return;
//     const onKeyDown = (event) => {
//       if (event.key === "Escape") setMobileDrawer(null);
//     };
//     window.addEventListener("keydown", onKeyDown);
//     const previousOverflow = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       window.removeEventListener("keydown", onKeyDown);
//       document.body.style.overflow = previousOverflow;
//     };
//   }, [mobileDrawer]);

//   // ---------------------------------------
//   // SELECTED CHANT
//   // ---------------------------------------

//   const selectedChant =
//     chants.find((chant) => chant.id === selectedChantId) ||
//     chants[0] ||
//     null;

//   const activeId = selectedChant?.id || "";

//   const theme = getTheme(selectedChant);

//   const deityImage =
//     theme === "shiva"
//       ? shivaImage
//       : theme === "hanuman"
//         ? hanumanImage
//         : theme === "ganesha"
//           ? ganeshaImage
//           : theme === "swami"
//             ? swamiSamarthImage
//             : lordVishnu;


//   const currentCount = Math.min(
//     MALA_SIZE - 1,
//     Math.max(0, Number(counts[activeId]) || 0)
//   );

//   // ---------------------------------------
//   // COMPLETED MALAS
//   // ---------------------------------------

//   const completedByChant = useMemo(() => {
//     const result = {};

//     history.forEach((entry) => {
//       if (entry.status === "Completed") {
//         result[entry.chantId] =
//           (result[entry.chantId] || 0) + 1;
//       }
//     });

//     return result;
//   }, [history]);

//   const completedMalas = completedByChant[activeId] || 0;

//   // A legacy incomplete entry may exist without a saved pause ID.
//   // Use the latest incomplete entry for the selected mantra.
//   const latestIncompleteEntry = history.find(
//     (entry) =>
//       entry.chantId === activeId &&
//       entry.status === "Not Completed" &&
//       Number(entry.jaapCount) > 0 &&
//       Number(entry.jaapCount) < MALA_SIZE
//   );

//   const linkedSessionId = pausedJaaps[activeId] || null;
//   const isJaapPaused = Boolean(linkedSessionId) && !resumedJaaps[activeId];
//   const canResumeOldEntry =
//     !linkedSessionId && currentCount === 0 && Boolean(latestIncompleteEntry);
//   const showResumeButton = isJaapPaused || canResumeOldEntry;

//   // ---------------------------------------
//   // LOCAL STORAGE
//   // ---------------------------------------

//   useEffect(() => {
//     localStorage.setItem(KEYS.chants, JSON.stringify(chants));
//   }, [chants]);

//   useEffect(() => {
//     localStorage.setItem(KEYS.selected, JSON.stringify(selectedChantId)
//     );
//   }, [selectedChantId]);

//   useEffect(() => {
//     localStorage.setItem(KEYS.counts, JSON.stringify(counts));
//   }, [counts]);

//   useEffect(() => {
//     localStorage.setItem(KEYS.history, JSON.stringify(history));
//   }, [history]);


//   useEffect(() => {
//     localStorage.setItem(KEYS.paused, JSON.stringify(pausedJaaps)
//     );
//   }, [pausedJaaps]);

//   useEffect(() => {
//     localStorage.setItem("sks_jaap_resumed", JSON.stringify(resumedJaaps)
//     );
//   }, [resumedJaaps]);

//   // ---------------------------------------
//   // CHANT +1
//   // ---------------------------------------

//   function handleChant() {
//     if (!selectedChant || showResumeButton) return;

//     setNotice("");
//     // Play the saved Kanha voice when Chant is clicked.
//     // Play selected mantra using ElevenLabs Kanha TTS.
//     // Jaap counter continues independently of audio playback.
//     void handlePlayChant(selectedChant);
//     const nextCount = currentCount + 1;
//     const sessionId = pausedJaaps[activeId];

//     if (nextCount === MALA_SIZE) {
//       const nextMala = completedMalas + 1;
//       const activity = {
//         id: sessionId || createId(),
//         chantId: activeId,
//         chantName: selectedChant.name,
//         date: new Date().toISOString(),
//         repetitions: nextMala,
//         jaapCount: MALA_SIZE,
//         status: "Completed",
//       };

//       setHistory((previous) => {
//         if (sessionId && previous.some((entry) => entry.id === sessionId)) {
//           return previous.map((entry) =>
//             entry.id === sessionId
//               ? { ...entry, repetitions: nextMala, jaapCount: MALA_SIZE, status: "Completed" }
//               : entry
//           );
//         }
//         return [activity, ...previous];
//       });

//       setCounts((previous) => ({ ...previous, [activeId]: 0 }));
//       setPausedJaaps((previous) => {
//         const next = { ...previous };
//         delete next[activeId];
//         return next;
//       });
//       setResumedJaaps((previous) => {
//         const next = { ...previous };
//         delete next[activeId];
//         return next;
//       });
//       setNotice(`🙏 Mala ${nextMala} completed! Your Jaap Book is ready.`);
//     } else {
//       setCounts((previous) => ({ ...previous, [activeId]: nextCount }));
//       if (sessionId) {
//         setHistory((previous) =>
//           previous.map((entry) =>
//             entry.id === sessionId ? { ...entry, jaapCount: nextCount } : entry
//           )
//         );
//       }
//     }
//   }

//   // ---------------------------------------
//   // RESET CURRENT MALA ONLY
//   // ---------------------------------------

//   function handleReset() {
//     if (!selectedChant || (currentCount === 0 && !showResumeButton)) return;
//     if (!window.confirm("Reset current Mala progress? Completed Malas will remain saved.")) return;

//     // Remove the incomplete session so it cannot reappear as Resume Jaap.
//     const incompleteId = linkedSessionId || latestIncompleteEntry?.id;
//     if (incompleteId) {
//       setHistory((previous) => previous.filter((entry) => entry.id !== incompleteId));
//     }

//     setCounts((previous) => ({ ...previous, [activeId]: 0 }));
//     setPausedJaaps((previous) => {
//       const next = { ...previous };
//       delete next[activeId];
//       return next;
//     });
//     setResumedJaaps((previous) => {
//       const next = { ...previous };
//       delete next[activeId];
//       return next;
//     });
//     setNotice("Current Mala reset. Start chanting from 1 again. Completed Malas are safe.");
//   }

//   // ---------------------------------------
//   // FINISH / PAUSE JAAP
//   // ---------------------------------------

//   function handleEndJaap() {
//     if (!selectedChant || currentCount === 0 || showResumeButton) return;

//     const sessionId = pausedJaaps[activeId];
//     const activity = {
//       id: sessionId || createId(),
//       chantId: activeId,
//       chantName: selectedChant.name,
//       date: new Date().toISOString(),
//       repetitions: completedMalas,
//       jaapCount: currentCount,
//       status: "Not Completed",
//     };

//     setHistory((previous) => {
//       if (sessionId && previous.some((entry) => entry.id === sessionId)) {
//         return previous.map((entry) =>
//           entry.id === sessionId
//             ? { ...entry, jaapCount: currentCount, status: "Not Completed" }
//             : entry
//         );
//       }
//       return [activity, ...previous];
//     });
//     setPausedJaaps((previous) => ({ ...previous, [activeId]: activity.id }));
//     setResumedJaaps((previous) => ({ ...previous, [activeId]: false }));
//     setNotice(`⏸ Jaap paused at ${currentCount}/108. Click Resume Jaap to continue.`);
//   }

//   // ---------------------------------------
//   // RESUME CURRENT OR LEGACY INCOMPLETE JAAP
//   // ---------------------------------------

//   function handleResumeJaap() {
//     if (!selectedChant || !showResumeButton) return;

//     // Old entries were saved before pause IDs existed; restore their count.
//     const entry = linkedSessionId
//       ? history.find((item) => item.id === linkedSessionId)
//       : latestIncompleteEntry;

//     if (!entry) {
//       setNotice("Saved Jaap session not found.");
//       return;
//     }

//     const savedCount = Math.max(0, Math.min(MALA_SIZE - 1, Number(entry.jaapCount) || 0));
//     const resumeCount = linkedSessionId ? currentCount : savedCount;

//     setCounts((previous) => ({ ...previous, [activeId]: resumeCount }));
//     setPausedJaaps((previous) => ({ ...previous, [activeId]: entry.id }));
//     setResumedJaaps((previous) => ({ ...previous, [activeId]: true }));
//     setNotice(`🙏 Jaap resumed from ${resumeCount}/108.`);
//   }

//   // ---------------------------------------
//   // ADD CHANT
//   // ---------------------------------------

//   function handleAddChant(event) {
//     event.preventDefault();

//     const name = newChantName.trim();

//     if (!name) return;

//     const newChant = {
//       id: createId(),
//       name,
//     };

//     setChants((previous) => [...previous, newChant]);
//     setSelectedChantId(newChant.id);
//     setNewChantName("");
//     setShowAddForm(false);
//     setNotice("");
//   }

//   // ---------------------------------------
//   // DELETE CUSTOM CHANT
//   // ---------------------------------------

//   function handleDeleteChant(id) {
//     const chant = chants.find((item) => item.id === id);

//     if (!chant) return;

//     if (!window.confirm(`Delete "${chant.name}"?`)) {
//       return;
//     }

//     const remaining = chants.filter(
//       (item) => item.id !== id
//     );

//     setChants(remaining);

//     if (activeId === id) {
//       setSelectedChantId(remaining[0]?.id || "");
//     }

//     setCounts((previous) => {
//       const next = { ...previous };
//       delete next[id];
//       return next;
//     });

//     // Previously completed Mala history is preserved.
//     setNotice("");
//   }

//   // ---------------------------------------
//   // CLEAR JAAP ACTIVITY (CONFIRM FIRST)
//   // ---------------------------------------

//   function handleClearActivity() {
//     if (history.length === 0) return;

//     const confirmed = window.confirm(
//       "Clear all Jaap activity? Completed Mala records, incomplete sessions, and current Jaap progress will be reset. Your added chants will stay saved. This cannot be undone."
//     );

//     if (!confirmed) return;

//     setHistory([]);
//     setCounts({});
//     setPausedJaaps({});
//     setResumedJaaps({});
//     setPreviewEntry(null);
//     setNotice("Jaap activity cleared. Your added chants are safe.");
//   }

//   // ---------------------------------------
//   // OPEN SCROLLABLE BOOK
//   // ---------------------------------------

//   function openBook(entry) {
//     if (!entry || entry.status !== "Completed") {
//       return;
//     }

//     setPreviewEntry(entry);
//   }

//   // ---------------------------------------
//   // PDF DOWNLOAD
//   // ---------------------------------------

//   async function downloadMala(entry) {
//     if (!entry || entry.status !== "Completed") return;
//     if (exportingId !== null) return;

//     setExportingId(entry.id);
//     setNotice("");

//     let wrapper = null;

//     try {
//       const [{ default: html2canvas }, { jsPDF }] =
//         await Promise.all([
//           import("html2canvas"),
//           import("jspdf"),
//         ]);

//       // Create a separate book element for PDF rendering.
//       wrapper = document.createElement("div");
//       wrapper.className = "sks-single-pdf-wrapper";

//       const sheet = document.createElement("div");
//       sheet.className = "sks-single-pdf-sheet";


//       const heading = document.createElement("div");
//       heading.className = "sks-single-pdf-heading";

//       heading.textContent = String(entry.chantName ?? "");


//       sheet.appendChild(heading);

//       const grid = document.createElement("div");
//       grid.className = "sks-single-pdf-grid";

//       grid.style.cssText = `
//         display: grid;
//         grid-template-columns: repeat(4, minmax(0, 1fr));
//         gap: 8px;
//         width: 100%;
//         box-sizing: border-box;
//       `;

//       // Exactly 108 repetitions.
//       for (let i = 0; i < MALA_SIZE; i++) {
//         const item = document.createElement("div");

//         item.className = "sks-single-pdf-item";

//         item.style.cssText = `
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           min-width: 0;
//           min-height: 42px;
//           padding: 6px 4px;
//           box-sizing: border-box;
//           border: 1px solid #dca15a;
//           border-radius: 4px;
//           background: #fffdf5;
//           color: #7b461f;
//           font-size: 13px;
//           line-height: 1.5;
//           text-align: center;
//           overflow-wrap: anywhere;
//          `;




//         item.textContent = entry.chantName;

//         grid.appendChild(item);
//       }

//       sheet.appendChild(grid);
//       wrapper.appendChild(sheet);

//       document.body.appendChild(wrapper);

//       if (document.fonts?.ready) {
//         await document.fonts.ready;
//       }

//       // Wait for the temporary book to be laid out.
//       await new Promise((resolve) => {
//         requestAnimationFrame(() => {
//           requestAnimationFrame(resolve);
//         });
//       });

//       const bounds = wrapper.getBoundingClientRect();

//       console.log("Jaap PDF HTML check:", {
//         pages: 1,
//         mantras: grid.children.length,
//         width: bounds.width,
//         height: bounds.height,
//       });

//       if (
//         bounds.width <= 0 ||
//         bounds.height <= 0 ||
//         grid.children.length !== MALA_SIZE
//       ) {
//         throw new Error("PDF book HTML is not ready.");
//       }

//       const canvas = await html2canvas(wrapper, {
//         scale: 2,
//         backgroundColor: "#f7e9ce",
//         useCORS: true,
//         logging: false,
//         scrollX: 0,
//         scrollY: -window.scrollY,
//         windowWidth: Math.max(
//           document.documentElement.clientWidth,
//           794
//         ),
//         windowHeight: Math.max(
//           document.documentElement.clientHeight,
//           Math.ceil(bounds.height)
//         ),
//       });

//       console.log("Jaap PDF canvas check:", {
//         width: canvas.width,
//         height: canvas.height,
//       });

//       if (!canvas.width || !canvas.height) {
//         throw new Error("PDF canvas is empty.");
//       }

//       const image = canvas.toDataURL("image/png");

//       const pdfWidth = 210;
//       const pdfHeight =
//         (canvas.height * pdfWidth) / canvas.width;

//       const pdf = new jsPDF({
//         orientation: "portrait",
//         unit: "mm",
//         format: [pdfWidth, pdfHeight],
//         compress: true,
//       });

//       pdf.addImage(
//         image,
//         "PNG",
//         0,
//         0,
//         pdfWidth,
//         pdfHeight
//       );

//       const safeId = String(entry.id).slice(0, 8);

//       pdf.save(
//         `SKS-Jaap-Mala-${entry.repetitions}-${safeId}.pdf`
//       );
//     } catch (error) {
//       console.error("Jaap PDF error:", error);

//       setNotice(
//         "PDF download failed. Please check the browser console."
//       );
//     } finally {
//       if (wrapper) {
//         wrapper.remove();
//       }

//       setExportingId(null);
//     }
//   }

//   // ---------------------------------------
//   // MAIN UI
//   // ---------------------------------------

//   return (
//     <section className={`sks-chant-page sks-theme-${theme} ${mobileDrawer ? `sks-drawer-${mobileDrawer}` : ""}`}>

//       <div className="sks-mobile-header">
//         <button
//           type="button"
//           className="sks-mobile-menu-button"
//           aria-label="Open Jaap menu"
//           aria-expanded={Boolean(mobileDrawer)}
//           aria-controls="sks-mobile-drawer"
//           onClick={() => setMobileDrawer("chants")}
//         >
//           <Menu size={22} />
//         </button>
//         <div className="sks-mobile-header-copy">
//           <strong>🙏 Jaap Counter</strong>
//           <span>{selectedChant?.name || "Select a mantra"}</span>
//         </div>
//         <button
//           type="button"
//           className="sks-mobile-history-shortcut"
//           onClick={() => setMobileDrawer("history")}
//         >
//           History
//         </button>
//       </div>

//       {mobileDrawer && (
//         <button
//           type="button"
//           className="sks-mobile-drawer-backdrop"
//           aria-label="Close menu"
//           onClick={() => setMobileDrawer(null)}
//         />
//       )}
//       <div
//         id="sks-mobile-drawer"
//         className={`sks-mobile-drawer ${mobileDrawer ? "is-open" : ""}`}
//         aria-hidden={!mobileDrawer}
//       >
//         <div className="sks-mobile-drawer-header">
//           <strong>☰ Jaap Menu</strong>
//           <button
//             type="button"
//             aria-label="Close menu"
//             onClick={() => setMobileDrawer(null)}
//           >
//             <X size={20} />
//           </button>
//         </div>
//         <button
//           type="button"
//           className="sks-mobile-add-chant"
//           onClick={() => {
//             setMobileDrawer(null);
//             setShowAddForm(true);
//           }}
//         >
//           <Plus size={16} /> Add Chant
//         </button>
//         <div className="sks-mobile-drawer-tabs">
//           <button
//             type="button"
//             className={mobileDrawer === "chants" ? "is-active" : ""}
//             onClick={() => setMobileDrawer("chants")}
//           >
//             📿 Select Jaap
//           </button>
//           <button
//             type="button"
//             className={mobileDrawer === "history" ? "is-active" : ""}
//             onClick={() => setMobileDrawer("history")}
//           >
//             📊 Activity
//           </button>
//         </div>
//         <div className="sks-mobile-drawer-content">
//           {mobileDrawer === "chants" && (
//             <div className="sks-mobile-mantra-list">
//               {chants.length === 0 && <p>No Jaap added yet. Use Add Chant above.</p>}
//               {chants.map((chant) => (
//                 <div className="sks-mobile-mantra-row" key={chant.id}>
//                   <button
//                     type="button"
//                     className={chant.id === activeId ? "is-selected" : ""}
//                     onClick={() => {
//                       setSelectedChantId(chant.id);
//                       setNotice("");
//                       setMobileDrawer(null);
//                     }}
//                   >
//                     <span>{chant.name}</span>
//                     <small>{completedByChant[chant.id] || 0} completed Mala(s)</small>
//                   </button>
//                   <button
//                     type="button"
//                     className="sks-mobile-mantra-delete"
//                     aria-label={`Delete ${chant.name}`}
//                     onClick={() => handleDeleteChant(chant.id)}
//                   ><Trash2 size={16} /></button>
//                 </div>
//               ))}
//             </div>
//           )}
//           {mobileDrawer === "history" && (
//             <div className="sks-mobile-history-list">
//               <button type="button" className="sks-mobile-clear-history"
//                 onClick={handleClearActivity} disabled={!history.length}>
//                 Clear Activity
//               </button>
//               {history.length === 0 && <p>No Jaap activity yet.</p>}
//               {history.map((entry) => (
//                 <div key={entry.id} className="sks-mobile-history-item">
//                   <strong>{entry.chantName}</strong>
//                   <small>{formatDate(entry.date)} · {entry.jaapCount}/108 · {entry.status}</small>
//                   {entry.status === "Completed" && (
//                     <div className="sks-mobile-history-actions">
//                       <button type="button" onClick={() => { setMobileDrawer(null); openBook(entry); }}>View Book</button>
//                       <button type="button" disabled={exportingId !== null} onClick={() => downloadMala(entry)}>Download PDF</button>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* PAGE HEADING */}

//       <div className="sks-chant-top">
//         <div className="sks-chant-heading">
//           <img
//             src={lotusImage}
//             alt="Lotus"
//             className="sks-chant-lotus"
//           />

//           <div>
//             <h2>Chant Counter System</h2>


//             <p>
//               Track your daily Jaap and grow your
//               spiritual practice
//             </p>
//           </div>
//         </div>

//         <button
//           type="button"
//           className="sks-premium-button"
//           onClick={() =>
//             setShowAddForm((value) => !value)
//           }
//         >
//           <Plus size={17} />
//           Add Chant
//         </button>
//       </div>

//       {/* ADD CHANT FORM */}

//       {showAddForm && (
//         <form
//           className="sks-add-chant-form"
//           onSubmit={handleAddChant}
//         >
//           <label htmlFor="sks-new-chant">
//             Add your own mantra
//           </label>

//           <div className="sks-add-chant-fields">
//             <input
//               id="sks-new-chant"
//               value={newChantName}
//               onChange={(event) =>
//                 setNewChantName(event.target.value)
//               }
//               placeholder="Enter mantra name"
//               maxLength={150}
//               required
//             />

//             <button type="submit">
//               Save Chant
//             </button>

//             <button
//               type="button"
//               className="sks-cancel-button"
//               onClick={() => {
//                 setShowAddForm(false);
//                 setNewChantName("");
//               }}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       )}

//       {/* MAIN TWO-COLUMN LAYOUT */}

//       <div className="sks-chant-layout">

//         {/* LEFT — CHANT LIST */}

//         <div className="sks-chant-list">
//           <div className="sks-panel-heading">
//             <span aria-hidden="true">ॐ</span>
//             <h3>your chants</h3>

//             <span aria-hidden="true">ॐ</span>

//           </div>

//           <p className="sks-chant-helper">
//             Select a mantra to begin your Jaap
//           </p>

//           <div className="sks-chant-items">
//             {chants.length === 0 && (
//               <div className="sks-empty-chants" style={{ padding: "28px 12px", textAlign: "center", color: "#915018" }}>
//                 <p>🙏 No chants added yet.</p>
//                 <small>Click Add Chant to add your first mantra.</small>
//               </div>
//             )}
//             {chants.map((chant) => {
//               const isSelected =
//                 chant.id === activeId;

//               const malas =
//                 completedByChant[chant.id] || 0;

//               return (
//                 <div
//                   key={chant.id}
//                   className={`sks-chant-item ${isSelected ? "is-selected" : ""
//                     }`}
//                 >
//                   <button
//                     type="button"
//                     className="sks-chant-select"
//                     onClick={() => {
//                       setSelectedChantId(chant.id);
//                       setNotice("");
//                     }}
//                   >
//                     <span className="sks-chant-item-name">
//                       {chant.name}
//                     </span>

//                     <small>
//                       {malas} completed Mala
//                       {malas === 1 ? "" : "s"}
//                     </small>
//                   </button>



//                   <button
//                     type="button"
//                     className="sks-chant-speaker"
//                     aria-label={`${playingChantId === chant.id ? "Stop" : "Play"} ${chant.name}`}
//                     title={playingChantId === chant.id ? "Stop Kanha voice" : "Play Kanha voice"}
//                     disabled={false}
//                     onClick={() => handlePlayChant(chant)}
//                   >
//                     {playingChantId === chant.id ? (
//                       <VolumeX size={17} />
//                     ) : (
//                       <Volume2 size={17} />
//                     )}
//                   </button>
//                   <button
//                     type="button"
//                     className="sks-chant-start"
//                     onClick={() => {
//                       setSelectedChantId(chant.id);
//                       setNotice("");
//                     }}
//                   >
//                     {isSelected
//                       ? "Selected"
//                       : "Start Jaap"}
//                   </button>

//                   <button
//                     type="button"
//                     className="sks-chant-delete"
//                     aria-label={`Delete ${chant.name}`}
//                     title={`Delete ${chant.name}`}
//                     onClick={() => handleDeleteChant(chant.id)}
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* RIGHT — DEITY ARTWORK COUNTER */}

//         <div
//           className="sks-jaap-panel sks-jaap-artwork-panel"

//           style={{
//             "--deity-artwork": `url("${deityImage}")`,
//           }}
//         >
//           {theme === "shiva" && (
//             <video
//               className="sks-shiva-divine-video"
//               autoPlay
//               muted
//               loop
//               playsInline
//               preload="metadata"
//               aria-hidden="true"
//             >
//               <source
//                 src="/videos/shiva-divine.mp4"
//                 type="video/mp4"
//               />
//             </video>
//           )}

//           {theme === "vishnu" && (
//             <video
//               className="sks-vishnu-brahmand-video"
//               autoPlay
//               muted
//               loop
//               playsInline
//               preload="metadata"
//               aria-hidden="true"
//             >
//               <source
//                 src="/videos/krishna-brahmand.mp4"
//                 type="video/mp4"
//               />
//             </video>
//           )}


//           {theme === "ganesha" && (
//             <video
//               className="sks-ganesha-divine-video"
//               autoPlay
//               muted
//               loop
//               playsInline
//               preload="metadata"
//               aria-hidden="true"
//             >
//               <source
//                 src="/videos/ganesha-divine.mp4"
//                 type="video/mp4"
//               />
//             </video>
//           )}

//           <div
//             className="sks-artwork-shade"
//             aria-hidden="true"
//           />

//           <div
//             className="sks-artwork-top"
//             aria-hidden="true"
//           >
//             <span>✦</span>
//             <span>ॐ</span>
//             <span>✦</span>
//           </div>

//           <div className="sks-artwork-content">
//             <div className="sks-artwork-mantra">
//               {selectedChant?.name ||
//                 "Select a mantra"}
//             </div>

//             <div className="sks-artwork-counter">
//               <strong>
//                 {currentCount} / 108
//               </strong>

//               <span>
//                 Jaap Completed in Current Mala
//               </span>
//             </div>

           

//             <div
//               className="sks-jaap-progress"
//               role="progressbar"
//               aria-label="Current Mala progress"
//               aria-valuemin={0}
//               aria-valuemax={108}
//               aria-valuenow={currentCount}
//             >
//               <span
//                 style={{
//                   width: `${(currentCount / MALA_SIZE) * 100
//                     }%`,
//                 }}
//               />
//             </div>

//             <button
//               type="button"
//               className="sks-main-chant-button"
//               onClick={handleChant}
//               disabled={!selectedChant || showResumeButton}
//             >
//               {showResumeButton ? "⏸ Jaap Paused" : "🙏 Chant 🙏"}
//             </button>

//             <div className="sks-jaap-controls">
//               <button
//                 type="button"
//                 onClick={handleReset}
//                 disabled={
//                   !selectedChant ||
//                   (currentCount === 0 && !showResumeButton)
//                 }
//               >
//                 <RotateCcw size={15} />
//                 Reset
//               </button>

//               {showResumeButton ? (
//                 <button type="button" onClick={handleResumeJaap}>
//                   <Flag size={15} />
//                   Resume Jaap
//                 </button>
//               ) : (
//                 <button
//                   type="button"
//                   onClick={handleEndJaap}
//                   disabled={!selectedChant || currentCount === 0}
//                 >
//                   <Flag size={15} />
//                   Finish Jaap
//                 </button>
//               )}


//               <div className="sks-mobile-voice-controls">
//                 <button
//                   type="button"
//                   className="sks-voice-mute-btn"
//                   onClick={handleToggleMute}
//                   aria-label={isMuted ? "Unmute" : "Mute"}
//                 >
//                   {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
//                 </button>

//                 <select
//                   className="sks-voice-dropdown"
//                   value={selectedVoice}
//                   onChange={(e) => setSelectedVoice(e.target.value)}
//                   aria-label="Select voice"
//                 >
//                   <option value="kanha">Child</option>
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                 </select>
//               </div>
//             </div>

//             {notice && (
//               <p
//                 className="sks-jaap-notice"
//                 role="status"
//               >
//                 {notice}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* RECENT JAAP ACTIVITY */}

//       <div className="sks-jaap-history">
//         <div className="sks-history-header">
//           <div className="sks-history-title">
//             <img
//               src={lotusImage}
//               alt=""
//               className="sks-history-lotus"
//             />

//             <h3>Recent Jaap Activity</h3>

//             <img
//               src={lotusImage}
//               alt=""
//               className="sks-history-lotus"
//             />
//           </div>

//           <div className="sks-history-actions">
//             <div className="sks-history-actions">

//               {/* Speaker ON/OFF button */}
//               <button
//                 type="button"
//                 className="sks-voice-mute-btn"
//                 onClick={handleToggleMute}
//                 aria-label={isMuted ? "Unmute chant" : "Mute chant"}
//                 title={isMuted ? "Unmute" : "Mute"}
//               >
//                 {isMuted ? <VolumeX size={15} color="#ffffff" /> : <Volume2 size={15} color="#ffffff" />}
//               </button>

//               {/* Male / Female / Child dropdown */}
//               <select
//                 className="sks-voice-dropdown"
//                 aria-label="Select chant voice"
//                 value={selectedVoice}
//                 onChange={(e) => setSelectedVoice(e.target.value)}
//               >
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//                 <option value="kanha">Child</option>
//               </select>

//               {/* Existing Clear Activity button stays here */}

//             </div>

//             {/* Existing Clear Activity button yahan rahega */}
//           </div>

//           <button
//             type="button"
//             className="sks-clear-activity-btn"
//             onClick={handleClearActivity}
//             disabled={history.length === 0 || exportingId !== null}
//             title="Clear all Jaap activity"
//           >
//             <Trash2 size={15} />
//             Clear Activity
//           </button>
//         </div>

//         <div className="sks-history-table-wrap">
//           <table className="sks-history-table">
//             <thead>
//               <tr>
//                 <th>Date &amp; Time</th>
//                 <th>Chant</th>
//                 <th>Repetition (Malas)</th>
//                 <th>Status</th>
//                 <th>Jaap Book / PDF</th>
//               </tr>
//             </thead>

//             <tbody>
//               {history.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan="5"
//                     className="sks-history-empty"
//                   >
//                     <BookOpen size={19} />
//                     Your Jaap activity will appear here.
//                   </td>
//                 </tr>
//               ) : (
//                 history.map((entry) => (
//                   <tr key={entry.id}>
//                     <td>
//                       {formatDate(entry.date)}
//                     </td>

//                     <td>
//                       {entry.chantName}
//                     </td>

//                     <td>
//                       {entry.repetitions}
//                     </td>

//                     <td>
//                       <span
//                         className={`sks-status ${entry.status === "Completed"
//                           ? "is-completed"
//                           : "is-incomplete"
//                           }`}
//                       >
//                         {entry.status}
//                       </span>

//                       {entry.status ===
//                         "Not Completed" && (
//                           <small className="sks-incomplete-count">
//                             {entry.jaapCount}/108 Jaap
//                           </small>
//                         )}
//                     </td>

//                     <td>
//                       {entry.status === "Completed" ? (
//                         <div className="sks-book-row-actions">
//                           <button
//                             type="button"
//                             onClick={() =>
//                               openBook(entry)
//                             }
//                           >
//                             <Eye size={14} />
//                             View Book
//                           </button>

//                           <button
//                             type="button"
//                             onClick={() =>
//                               downloadMala(entry)
//                             }
//                             disabled={
//                               exportingId !== null
//                             }
//                           >
//                             <Download size={14} />

//                             {exportingId === entry.id
//                               ? "Creating..."
//                               : "PDF"}
//                           </button>
//                         </div>
//                       ) : (
//                         <span className="sks-book-pending">
//                           Complete 108 Jaap to unlock
//                         </span>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* SINGLE SCROLLABLE JAAP BOOK */}

//       {previewEntry && (
//         <div
//           className="sks-book-modal-backdrop"
//           onClick={() => setPreviewEntry(null)}
//         >
//           <div
//             className="sks-book-modal"
//             role="dialog"
//             aria-modal="true"
//             aria-label="Sacred Jaap Book"
//             onClick={(event) =>
//               event.stopPropagation()
//             }
//           >
//             {/* BOOK HEADER */}

//             <div className="sks-book-modal-header">
//               <div>
//                 <strong>
//                   📖 Sacred Jaap Book
//                 </strong>

//                 <small>
//                   {previewEntry.chantName}
//                   {" · "}
//                   Mala {previewEntry.repetitions}
//                   {" · "}
//                   108 Jaap
//                 </small>
//               </div>

//               <div className="sks-book-modal-buttons">
//                 <button
//                   type="button"
//                   aria-label="Close Jaap Book"
//                   onClick={() =>
//                     setPreviewEntry(null)
//                   }
//                 >
//                   <X size={19} />
//                 </button>
//               </div>
//             </div>

//             {/* ONE CONTINUOUS SCROLLABLE PAGE */}

//             <div className="sks-book-pages">
//               <div className="sks-book-sheet">
//                 <div className="sks-book-sheet-heading">
//                   ॐ · {previewEntry.chantName} · माला{" "}
//                   {previewEntry.repetitions}
//                 </div>

//                 <div className="sks-book-grid">
//                   {Array.from(
//                     { length: MALA_SIZE },
//                     (_, index) => (
//                       <span
//                         key={index}
//                         title={`Jaap ${index + 1}`}
//                       >
//                         {previewEntry.chantName}
//                       </span>
//                     )
//                   )}
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>
//       )}

//     </section>
//   );
// }







// import React, { useEffect, useMemo, useState } from "react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Menu,
  Trash2,
  RotateCcw,
  Flag,
  BookOpen,
  Download,
  X,
  Eye,
  Volume2,
  VolumeX,
} from "lucide-react";

import axios from "axios";

import lordVishnu from "../../assets/Theme/lord vishnu.jpg";
import hanumanImage from "../../assets/Theme/hanuman.png";
import shivaImage from "../../assets/Theme/shiva.jpg";
import lotusImage from "../../assets/Theme/lotus.jpg";
// import ganeshaImage from "../../assets/Theme/ganesha.jpg";
import ganeshaImage from "../../assets/Theme/ganesha1.jpg";
import swamiSamarthImage from "../../assets/Theme/swami_samrth.jpg";

import "../../CSS/Chant.css";

const MALA_SIZE = 108;

const DEFAULT_CHANTS = [
  { id: "ram", name: "श्री राम जय राम जय जय राम" },
  { id: "krishna", name: "ॐ नमो भगवते वासुदेवाय" },
  { id: "shiv", name: "ॐ नमः शिवाय" },
  { id: "shiv-namastubhyam", name: "श्री शिवाय नमस्तुभ्यम्" },
  { id: "hanuman", name: "ॐ हनुमते नमः" },

  {
    id: "hare-krishna-mahamantra",
    name: "हरे कृष्ण हरे कृष्ण, कृष्ण कृष्ण हरे हरे। हरे राम हरे राम, राम राम हरे हरे।",
  },
  {
    id: "krishna-vasudevaya",
    name: "ॐ कृष्णाय वासुदेवाय हरये परमात्मने। प्रणतः क्लेशनाशाय गोविंदाय नमो नमः।",
  },
  {
    id: "gayatri-mantra",
    name: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्।",
  },
  {
    id: "radhikayai",
    name: "ॐ राधिकायै नमः",
  },
  {
    id: "radhe-radhe",
    name: "राधे राधे",
  },
  {
    id: "hanumate-ham",
    name: "ॐ हं हनुमते नमः",
  },
];

const KEYS = {
  chants: "sks_chants",
  selected: "sks_selected_chant",
  counts: "sks_jaap_counts",
  history: "sks_jaap_history",
  paused: "sks_jaap_paused",
};



// Add this below KEYS
const OLD_DEFAULT_IDS = [
  "ram",
  "krishna",
  "shiv",
  "shiv-namastubhyam",
  "hanuman",
];

function readSaved(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getTheme(chant) {
  if (!chant) return "vishnu";

  const name = String(chant.name || "")
    .normalize("NFC")
    .toLowerCase();


  const swamiKeywords = [
    "स्वामी समर्थ",
    "श्री स्वामी समर्थ",
    "swami samarth",
    "akkalkot",
  ]

  // SHIVA
  const shivaKeywords = [
    "शिव",
    "शिवाय",
    "शंकर",
    "महादेव",
    "महेश",
    "भोले",
    "रुद्र",
    "shiv",
    "shiva",
    "shankar",
    "mahadev",
    "mahesh",
    "bholenath",
    "rudra",
  ];

  // HANUMAN
  const hanumanKeywords = [
    "हनुमान",
    "हनुमते",
    "बजरंग",
    "मारुति",
    "पवनपुत्र",
    "अंजनी",
    "hanuman",
    "hanumate",
    "bajrang",
    "maruti",
    "pavanputra",
    "anjaney",
  ];

  // RAM
  const ramKeywords = [
    "राम",
    "रघुनाथ",
    "रघुवीर",
    "सीताराम",
    "ram",
    "rama",
    "raghunath",
    "raghuveer",
    "sitaram",
  ];

  // KRISHNA / VISHNU
  const vishnuKeywords = [
    "कृष्ण",
    "कान्हा",
    "गोविंद",
    "गोपाल",
    "श्याम",
    "माधव",
    "विष्णु",
    "नारायण",
    "हरि",
    "krishna",
    "krishan",
    "kanha",
    "govind",
    "gopal",
    "shyam",
    "madhav",
    "vishnu",
    "narayan",
    "hari",
  ];

  const ganeshaKeywords = [
    "गणेश",
    "गणपति",
    "गणपतये",
    "गणेशाय",
    "गणपती",
    "गजानन",
    "एकदन्त",
    "एकदंत",
    "वक्रतुण्ड",
    "वक्रतुंड",
    "विघ्नेश्वर",
    "गं",
    "ganesh",
    "ganesha",
    "ganpati",
    "ganapati",
    "gajanan",
    "ekdant",
    "vakratunda",
    "vighneshwar",
  ];

  if (ganeshaKeywords.some((word) => name.includes(word))) {
    return "ganesha";
  }

  if (swamiKeywords.some((word) => name.includes(word))) {
    return "swami";
  }

  if (shivaKeywords.some((word) => name.includes(word))) {
    return "shiva";
  }

  if (hanumanKeywords.some((word) => name.includes(word))) {
    return "hanuman";
  }

  if (ramKeywords.some((word) => name.includes(word))) {
    return "hanuman";
  }

  if (vishnuKeywords.some((word) => name.includes(word))) {
    return "vishnu";
  }

  // Fallback for existing saved default chants.
  if (
    chant.id === "shiv" ||
    chant.id === "shiv-namastubhyam"
  ) {
    return "shiva";
  }

  if (chant.id === "ram" || chant.id === "hanuman") {
    return "hanuman";
  }

  return "vishnu";
}

function formatDate(date) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Chant() {
  // ---------------------------------------
  // SAVED CHANTS
  // ---------------------------------------

  const [chants, setChants] = useState(() => {
    const savedChants = readSaved(KEYS.chants, []);

    const normalizeName = (value) =>
      String(value || "")
        .normalize("NFC")
        .replace(/[।॥,.]/g, "")
        .replace(/\s+/g, "")
        .trim();

    const defaultIds = new Set(DEFAULT_CHANTS.map((chant) => chant.id));

    const defaultNames = new Set(
      DEFAULT_CHANTS.map((chant) => normalizeName(chant.name))
    );

    const customChants = Array.isArray(savedChants)
      ? savedChants.filter(
        (chant) =>
          chant &&
          chant.id &&
          chant.name &&
          !defaultIds.has(chant.id) &&
          !defaultNames.has(normalizeName(chant.name))
      )
      : [];

    return [...DEFAULT_CHANTS, ...customChants];
  });



  const [selectedChantId, setSelectedChantId] = useState(() => {
    const savedId = readSaved(KEYS.selected, "");

    return savedId || DEFAULT_CHANTS[0].id;
  });

  const [counts, setCounts] = useState(() =>
    readSaved(KEYS.counts, {})
  );

  const [selectedVoice, setSelectedVoice] = useState("kanha");
  const [isMuted, setIsMuted] = useState(false);

  const [history, setHistory] = useState(() =>
    readSaved(KEYS.history, [])
  );
  const [pausedJaaps, setPausedJaaps] = useState(() =>
    readSaved(KEYS.paused, {})
  );


  const [resumedJaaps, setResumedJaaps] = useState(() =>
    readSaved("sks_jaap_resumed", {})
  );

  // ---------------------------------------
  // UI STATES
  // ---------------------------------------

  const [showAddForm, setShowAddForm] = useState(false);
  const [mobileDrawer, setMobileDrawer] = useState(null);
  const [newChantName, setNewChantName] = useState("");
  const [notice, setNotice] = useState("");

  const [previewEntry, setPreviewEntry] = useState(null);
  const [exportingId, setExportingId] = useState(null);

  const audioRef = useRef(null);
  const [playingChantId, setPlayingChantId] = useState(null);

  async function playKanhaVoice(text, voice = "kanha") {
    const token = sessionStorage.getItem("authToken");

    if (!token) {
      throw new Error("Please login again");
    }

    const response = await axios.post(
      // "http://localhost:4000/api/chant-tts/speak" || "https://sks-serverproject-new.onrender.com/api/chant-tts/speak",
      "https://sks-serverproject-new.onrender.com/api/chant-tts/speak",
      { text, voice },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
        timeout: 45000,
      }
    );

    return URL.createObjectURL(response.data);
  }

  const chantAudio = {
    shivaya: "/Audio/ShriShivayNamastubhyamm.mp3",
  };

  function getChantAudio(chant) {
    const name = String(chant?.name || "")
      .normalize("NFC")
      .replace(/[।॥|]/g, "")
      .replace(/\s+/g, "")
      .trim();

    if (name.includes("शिवायनमस्तुभ्यम्")) {
      return chantAudio.shivaya;
    }

    return null;
  }


  async function handlePlayChant(chant) {



    if (isMuted) return;
    // Stop any currently playing audio.
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Clicking the same speaker again stops playback.
    if (playingChantId === chant.id) {
      setPlayingChantId(null);
      return;
    }

    setPlayingChantId(chant.id);
    setNotice("");

    let audioUrl = null;

    try {
      // Generate or retrieve cached Kanha audio.
      audioUrl = await playKanhaVoice(chant.name, selectedVoice);

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      const cleanup = () => {
        URL.revokeObjectURL(audioUrl);

        if (audioRef.current === audio) {
          audioRef.current = null;
          setPlayingChantId(null);
        }
      }

      audio.onended = cleanup;
      audio.onerror = cleanup;

      await audio.play();
    } catch (error) {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      console.error("Kanha voice playback failed:", error);
      setPlayingChantId(null);
      setNotice("Unable to play Kanha voice. Check Console.");
    }
  }


  function handleToggleMute() {
    setIsMuted((previous) => !previous);

    if (!isMuted && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setPlayingChantId(null);
    }
  }

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  // Parent dashboard hamburger can open the existing Chant drawer.
  useEffect(() => {
    const openFromDashboard = (event) => {
      if (event.detail === "chants" || event.detail === "history") {
        setMobileDrawer(event.detail);
      }
    };
    window.addEventListener("sks:chant-menu", openFromDashboard);
    return () => window.removeEventListener("sks:chant-menu", openFromDashboard);
  }, []);

  // Mobile drawer: Escape closes it; lock page scroll while open.
  useEffect(() => {
    if (!mobileDrawer) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMobileDrawer(null);
    };
    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileDrawer]);

  // ---------------------------------------
  // SELECTED CHANT
  // ---------------------------------------

  const selectedChant =
    chants.find((chant) => chant.id === selectedChantId) ||
    chants[0] ||
    null;

  const activeId = selectedChant?.id || "";

  const theme = getTheme(selectedChant);

  const deityImage =
    theme === "shiva"
      ? shivaImage
      : theme === "hanuman"
        ? hanumanImage
        : theme === "ganesha"
          ? ganeshaImage
          : theme === "swami"
            ? swamiSamarthImage
            : lordVishnu;


  const currentCount = Math.min(
    MALA_SIZE - 1,
    Math.max(0, Number(counts[activeId]) || 0)
  );

  // ---------------------------------------
  // COMPLETED MALAS
  // ---------------------------------------

  const completedByChant = useMemo(() => {
    const result = {};

    history.forEach((entry) => {
      if (entry.status === "Completed") {
        result[entry.chantId] =
          (result[entry.chantId] || 0) + 1;
      }
    });

    return result;
  }, [history]);

  const completedMalas = completedByChant[activeId] || 0;

  // A legacy incomplete entry may exist without a saved pause ID.
  // Use the latest incomplete entry for the selected mantra.
  const latestIncompleteEntry = history.find(
    (entry) =>
      entry.chantId === activeId &&
      entry.status === "Not Completed" &&
      Number(entry.jaapCount) > 0 &&
      Number(entry.jaapCount) < MALA_SIZE
  );

  const linkedSessionId = pausedJaaps[activeId] || null;
  const isJaapPaused = Boolean(linkedSessionId) && !resumedJaaps[activeId];
  const canResumeOldEntry =
    !linkedSessionId && currentCount === 0 && Boolean(latestIncompleteEntry);
  const showResumeButton = isJaapPaused || canResumeOldEntry;

  // ---------------------------------------
  // LOCAL STORAGE
  // ---------------------------------------

  useEffect(() => {
    localStorage.setItem(KEYS.chants, JSON.stringify(chants));
  }, [chants]);

  useEffect(() => {
    localStorage.setItem(KEYS.selected, JSON.stringify(selectedChantId)
    );
  }, [selectedChantId]);

  useEffect(() => {
    localStorage.setItem(KEYS.counts, JSON.stringify(counts));
  }, [counts]);

  useEffect(() => {
    localStorage.setItem(KEYS.history, JSON.stringify(history));
  }, [history]);


  useEffect(() => {
    localStorage.setItem(KEYS.paused, JSON.stringify(pausedJaaps)
    );
  }, [pausedJaaps]);

  useEffect(() => {
    localStorage.setItem("sks_jaap_resumed", JSON.stringify(resumedJaaps)
    );
  }, [resumedJaaps]);

  // ---------------------------------------
  // CHANT +1
  // ---------------------------------------

  function handleChant() {
    if (!selectedChant || showResumeButton) return;

    setNotice("");
    // Play the saved Kanha voice when Chant is clicked.
    // Play selected mantra using ElevenLabs Kanha TTS.
    // Jaap counter continues independently of audio playback.
    void handlePlayChant(selectedChant);
    const nextCount = currentCount + 1;
    const sessionId = pausedJaaps[activeId];

    if (nextCount === MALA_SIZE) {
      const nextMala = completedMalas + 1;
      const activity = {
        id: sessionId || createId(),
        chantId: activeId,
        chantName: selectedChant.name,
        date: new Date().toISOString(),
        repetitions: nextMala,
        jaapCount: MALA_SIZE,
        status: "Completed",
      };

      setHistory((previous) => {
        if (sessionId && previous.some((entry) => entry.id === sessionId)) {
          return previous.map((entry) =>
            entry.id === sessionId
              ? { ...entry, repetitions: nextMala, jaapCount: MALA_SIZE, status: "Completed" }
              : entry
          );
        }
        return [activity, ...previous];
      });

      setCounts((previous) => ({ ...previous, [activeId]: 0 }));
      setPausedJaaps((previous) => {
        const next = { ...previous };
        delete next[activeId];
        return next;
      });
      setResumedJaaps((previous) => {
        const next = { ...previous };
        delete next[activeId];
        return next;
      });
      setNotice(`🙏 Mala ${nextMala} completed! Your Jaap Book is ready.`);
    } else {
      setCounts((previous) => ({ ...previous, [activeId]: nextCount }));
      if (sessionId) {
        setHistory((previous) =>
          previous.map((entry) =>
            entry.id === sessionId ? { ...entry, jaapCount: nextCount } : entry
          )
        );
      }
    }
  }

  // ---------------------------------------
  // RESET CURRENT MALA ONLY
  // ---------------------------------------

  function handleReset() {
    if (!selectedChant || (currentCount === 0 && !showResumeButton)) return;
    if (!window.confirm("Reset current Mala progress? Completed Malas will remain saved.")) return;

    // Remove the incomplete session so it cannot reappear as Resume Jaap.
    const incompleteId = linkedSessionId || latestIncompleteEntry?.id;
    if (incompleteId) {
      setHistory((previous) => previous.filter((entry) => entry.id !== incompleteId));
    }

    setCounts((previous) => ({ ...previous, [activeId]: 0 }));
    setPausedJaaps((previous) => {
      const next = { ...previous };
      delete next[activeId];
      return next;
    });
    setResumedJaaps((previous) => {
      const next = { ...previous };
      delete next[activeId];
      return next;
    });
    setNotice("Current Mala reset. Start chanting from 1 again. Completed Malas are safe.");
  }

  // ---------------------------------------
  // FINISH / PAUSE JAAP
  // ---------------------------------------

  function handleEndJaap() {
    if (!selectedChant || currentCount === 0 || showResumeButton) return;

    const sessionId = pausedJaaps[activeId];
    const activity = {
      id: sessionId || createId(),
      chantId: activeId,
      chantName: selectedChant.name,
      date: new Date().toISOString(),
      repetitions: completedMalas,
      jaapCount: currentCount,
      status: "Not Completed",
    };

    setHistory((previous) => {
      if (sessionId && previous.some((entry) => entry.id === sessionId)) {
        return previous.map((entry) =>
          entry.id === sessionId
            ? { ...entry, jaapCount: currentCount, status: "Not Completed" }
            : entry
        );
      }
      return [activity, ...previous];
    });
    setPausedJaaps((previous) => ({ ...previous, [activeId]: activity.id }));
    setResumedJaaps((previous) => ({ ...previous, [activeId]: false }));
    setNotice(`⏸ Jaap paused at ${currentCount}/108. Click Resume Jaap to continue.`);
  }

  // ---------------------------------------
  // RESUME CURRENT OR LEGACY INCOMPLETE JAAP
  // ---------------------------------------

  function handleResumeJaap() {
    if (!selectedChant || !showResumeButton) return;

    // Old entries were saved before pause IDs existed; restore their count.
    const entry = linkedSessionId
      ? history.find((item) => item.id === linkedSessionId)
      : latestIncompleteEntry;

    if (!entry) {
      setNotice("Saved Jaap session not found.");
      return;
    }

    const savedCount = Math.max(0, Math.min(MALA_SIZE - 1, Number(entry.jaapCount) || 0));
    const resumeCount = linkedSessionId ? currentCount : savedCount;

    setCounts((previous) => ({ ...previous, [activeId]: resumeCount }));
    setPausedJaaps((previous) => ({ ...previous, [activeId]: entry.id }));
    setResumedJaaps((previous) => ({ ...previous, [activeId]: true }));
    setNotice(`🙏 Jaap resumed from ${resumeCount}/108.`);
  }

  // ---------------------------------------
  // ADD CHANT
  // ---------------------------------------

  function handleAddChant(event) {
    event.preventDefault();

    const name = newChantName.trim();

    if (!name) return;

    const newChant = {
      id: createId(),
      name,
    };

    setChants((previous) => [...previous, newChant]);
    setSelectedChantId(newChant.id);
    setNewChantName("");
    setShowAddForm(false);
    setNotice("");
  }

  // ---------------------------------------
  // DELETE CUSTOM CHANT
  // ---------------------------------------

  function handleDeleteChant(id) {
    const chant = chants.find((item) => item.id === id);

    if (!chant) return;

    if (!window.confirm(`Delete "${chant.name}"?`)) {
      return;
    }

    const remaining = chants.filter(
      (item) => item.id !== id
    );

    setChants(remaining);

    if (activeId === id) {
      setSelectedChantId(remaining[0]?.id || "");
    }

    setCounts((previous) => {
      const next = { ...previous };
      delete next[id];
      return next;
    });

    // Previously completed Mala history is preserved.
    setNotice("");
  }

  // ---------------------------------------
  // CLEAR JAAP ACTIVITY (CONFIRM FIRST)
  // ---------------------------------------

  function handleClearActivity() {
    if (history.length === 0) return;

    const confirmed = window.confirm(
      "Clear all Jaap activity? Completed Mala records, incomplete sessions, and current Jaap progress will be reset. Your added chants will stay saved. This cannot be undone."
    );

    if (!confirmed) return;

    setHistory([]);
    setCounts({});
    setPausedJaaps({});
    setResumedJaaps({});
    setPreviewEntry(null);
    setNotice("Jaap activity cleared. Your added chants are safe.");
  }

  // ---------------------------------------
  // OPEN SCROLLABLE BOOK
  // ---------------------------------------

  function openBook(entry) {
    if (!entry || entry.status !== "Completed") {
      return;
    }

    setPreviewEntry(entry);
  }

  // ---------------------------------------
  // PDF DOWNLOAD
  // ---------------------------------------

  async function downloadMala(entry) {
    if (!entry || entry.status !== "Completed") return;
    if (exportingId !== null) return;

    setExportingId(entry.id);
    setNotice("");

    let wrapper = null;

    try {
      const [{ default: html2canvas }, { jsPDF }] =
        await Promise.all([
          import("html2canvas"),
          import("jspdf"),
        ]);

      // Create a separate book element for PDF rendering.
      wrapper = document.createElement("div");
      wrapper.className = "sks-single-pdf-wrapper";

      const sheet = document.createElement("div");
      sheet.className = "sks-single-pdf-sheet";


      const heading = document.createElement("div");
      heading.className = "sks-single-pdf-heading";

      heading.textContent = String(entry.chantName ?? "");


      sheet.appendChild(heading);

      const grid = document.createElement("div");
      grid.className = "sks-single-pdf-grid";

      grid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 8px;
        width: 100%;
        box-sizing: border-box;
      `;

      // Exactly 108 repetitions.
      for (let i = 0; i < MALA_SIZE; i++) {
        const item = document.createElement("div");

        item.className = "sks-single-pdf-item";

        item.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 0;
          min-height: 42px;
          padding: 6px 4px;
          box-sizing: border-box;
          border: 1px solid #dca15a;
          border-radius: 4px;
          background: #fffdf5;
          color: #7b461f;
          font-size: 13px;
          line-height: 1.5;
          text-align: center;
          overflow-wrap: anywhere;
         `;




        item.textContent = entry.chantName;

        grid.appendChild(item);
      }

      sheet.appendChild(grid);
      wrapper.appendChild(sheet);

      document.body.appendChild(wrapper);

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      // Wait for the temporary book to be laid out.
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });

      const bounds = wrapper.getBoundingClientRect();

      console.log("Jaap PDF HTML check:", {
        pages: 1,
        mantras: grid.children.length,
        width: bounds.width,
        height: bounds.height,
      });

      if (
        bounds.width <= 0 ||
        bounds.height <= 0 ||
        grid.children.length !== MALA_SIZE
      ) {
        throw new Error("PDF book HTML is not ready.");
      }

      const canvas = await html2canvas(wrapper, {
        scale: 2,
        backgroundColor: "#f7e9ce",
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: Math.max(
          document.documentElement.clientWidth,
          794
        ),
        windowHeight: Math.max(
          document.documentElement.clientHeight,
          Math.ceil(bounds.height)
        ),
      });

      console.log("Jaap PDF canvas check:", {
        width: canvas.width,
        height: canvas.height,
      });

      if (!canvas.width || !canvas.height) {
        throw new Error("PDF canvas is empty.");
      }

      const image = canvas.toDataURL("image/png");

      const pdfWidth = 210;
      const pdfHeight =
        (canvas.height * pdfWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
        compress: true,
      });

      pdf.addImage(
        image,
        "PNG",
        0,
        0,
        pdfWidth,
        pdfHeight
      );

      const safeId = String(entry.id).slice(0, 8);

      pdf.save(
        `SKS-Jaap-Mala-${entry.repetitions}-${safeId}.pdf`
      );
    } catch (error) {
      console.error("Jaap PDF error:", error);

      setNotice(
        "PDF download failed. Please check the browser console."
      );
    } finally {
      if (wrapper) {
        wrapper.remove();
      }

      setExportingId(null);
    }
  }

  // ---------------------------------------
  // MAIN UI
  // ---------------------------------------

  return (
    <section className={`sks-chant-page sks-theme-${theme} ${mobileDrawer ? `sks-drawer-${mobileDrawer}` : ""}`}>

      <div className="sks-mobile-header">
        <button
          type="button"
          className="sks-mobile-menu-button"
          aria-label="Open Jaap menu"
          aria-expanded={Boolean(mobileDrawer)}
          aria-controls="sks-mobile-drawer"
          onClick={() => setMobileDrawer("chants")}
        >
          <Menu size={22} />
        </button>
        <div className="sks-mobile-header-copy">
          <strong>🙏 Jaap Counter</strong>
          <span>{selectedChant?.name || "Select a mantra"}</span>
        </div>
        <button
          type="button"
          className="sks-mobile-history-shortcut"
          onClick={() => setMobileDrawer("history")}
        >
          History
        </button>
      </div>

      {mobileDrawer && (
        <button
          type="button"
          className="sks-mobile-drawer-backdrop"
          aria-label="Close menu"
          onClick={() => setMobileDrawer(null)}
        />
      )}
      <div
        id="sks-mobile-drawer"
        className={`sks-mobile-drawer ${mobileDrawer ? "is-open" : ""}`}
        aria-hidden={!mobileDrawer}
      >
        <div className="sks-mobile-drawer-header">
          <strong>☰ Jaap Menu</strong>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileDrawer(null)}
          >
            <X size={20} />
          </button>
        </div>
        <button
          type="button"
          className="sks-mobile-add-chant"
          onClick={() => {
            setMobileDrawer(null);
            setShowAddForm(true);
          }}
        >
          <Plus size={16} /> Add Chant
        </button>
        <div className="sks-mobile-drawer-tabs">
          <button
            type="button"
            className={mobileDrawer === "chants" ? "is-active" : ""}
            onClick={() => setMobileDrawer("chants")}
          >
            📿 Select Jaap
          </button>
          <button
            type="button"
            className={mobileDrawer === "history" ? "is-active" : ""}
            onClick={() => setMobileDrawer("history")}
          >
            📊 Activity
          </button>
        </div>
        <div className="sks-mobile-drawer-content">
          {mobileDrawer === "chants" && (
            <div className="sks-mobile-mantra-list">
              {chants.length === 0 && <p>No Jaap added yet. Use Add Chant above.</p>}
              {chants.map((chant) => (
                <div className="sks-mobile-mantra-row" key={chant.id}>
                  <button
                    type="button"
                    className={chant.id === activeId ? "is-selected" : ""}
                    onClick={() => {
                      setSelectedChantId(chant.id);
                      setNotice("");
                      setMobileDrawer(null);
                    }}
                  >
                    <span>{chant.name}</span>
                    <small>{completedByChant[chant.id] || 0} completed Mala(s)</small>
                  </button>
                  <button
                    type="button"
                    className="sks-mobile-mantra-delete"
                    aria-label={`Delete ${chant.name}`}
                    onClick={() => handleDeleteChant(chant.id)}
                  ><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          )}
          {mobileDrawer === "history" && (
            <div className="sks-mobile-history-list">
              <button type="button" className="sks-mobile-clear-history"
                onClick={handleClearActivity} disabled={!history.length}>
                Clear Activity
              </button>
              {history.length === 0 && <p>No Jaap activity yet.</p>}
              {history.map((entry) => (
                <div key={entry.id} className="sks-mobile-history-item">
                  <strong>{entry.chantName}</strong>
                  <small>{formatDate(entry.date)} · {entry.jaapCount}/108 · {entry.status}</small>
                  {entry.status === "Completed" && (
                    <div className="sks-mobile-history-actions">
                      <button type="button" onClick={() => { setMobileDrawer(null); openBook(entry); }}>View Book</button>
                      <button type="button" disabled={exportingId !== null} onClick={() => downloadMala(entry)}>Download PDF</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PAGE HEADING */}

      <div className="sks-chant-top">
        <div className="sks-chant-heading">
          <img
            src={lotusImage}
            alt="Lotus"
            className="sks-chant-lotus"
          />

          <div>
            <h2>Chant Counter System</h2>


            <p>
              Track your daily Jaap and grow your
              spiritual practice
            </p>
          </div>
        </div>

        <button
          type="button"
          className="sks-premium-button"
          onClick={() =>
            setShowAddForm((value) => !value)
          }
        >
          <Plus size={17} />
          Add Chant
        </button>
      </div>

      {/* ADD CHANT FORM */}

      {showAddForm && (
        <form
          className="sks-add-chant-form"
          onSubmit={handleAddChant}
        >
          <label htmlFor="sks-new-chant">
            Add your own mantra
          </label>

          <div className="sks-add-chant-fields">
            <input
              id="sks-new-chant"
              value={newChantName}
              onChange={(event) =>
                setNewChantName(event.target.value)
              }
              placeholder="Enter mantra name"
              maxLength={150}
              required
            />

            <button type="submit">
              Save Chant
            </button>

            <button
              type="button"
              className="sks-cancel-button"
              onClick={() => {
                setShowAddForm(false);
                setNewChantName("");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* MAIN TWO-COLUMN LAYOUT */}

      <div className="sks-chant-layout">

        {/* LEFT — CHANT LIST */}

        <div className="sks-chant-list">
          <div className="sks-panel-heading">
            <span aria-hidden="true">ॐ</span>
            <h3>your chants</h3>

            <span aria-hidden="true">ॐ</span>

          </div>

          <p className="sks-chant-helper">
            Select a mantra to begin your Jaap
          </p>

          <div className="sks-chant-items">
            {chants.length === 0 && (
              <div className="sks-empty-chants" style={{ padding: "28px 12px", textAlign: "center", color: "#915018" }}>
                <p>🙏 No chants added yet.</p>
                <small>Click Add Chant to add your first mantra.</small>
              </div>
            )}
            {chants.map((chant) => {
              const isSelected =
                chant.id === activeId;

              const malas =
                completedByChant[chant.id] || 0;

              return (
                <div
                  key={chant.id}
                  className={`sks-chant-item ${isSelected ? "is-selected" : ""
                    }`}
                >
                  <button
                    type="button"
                    className="sks-chant-select"
                    onClick={() => {
                      setSelectedChantId(chant.id);
                      setNotice("");
                    }}
                  >
                    <span className="sks-chant-item-name">
                      {chant.name}
                    </span>

                    <small>
                      {malas} completed Mala
                      {malas === 1 ? "" : "s"}
                    </small>
                  </button>



                  <button
                    type="button"
                    className="sks-chant-speaker"
                    aria-label={`${playingChantId === chant.id ? "Stop" : "Play"} ${chant.name}`}
                    title={playingChantId === chant.id ? "Stop Kanha voice" : "Play Kanha voice"}
                    disabled={false}
                    onClick={() => handlePlayChant(chant)}
                  >
                    {playingChantId === chant.id ? (
                      <VolumeX size={17} />
                    ) : (
                      <Volume2 size={17} />
                    )}
                  </button>
                  <button
                    type="button"
                    className="sks-chant-start"
                    onClick={() => {
                      setSelectedChantId(chant.id);
                      setNotice("");
                    }}
                  >
                    {isSelected
                      ? "Selected"
                      : "Start Jaap"}
                  </button>

                  <button
                    type="button"
                    className="sks-chant-delete"
                    aria-label={`Delete ${chant.name}`}
                    title={`Delete ${chant.name}`}
                    onClick={() => handleDeleteChant(chant.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — DEITY ARTWORK COUNTER */}

        <div
          className="sks-jaap-panel sks-jaap-artwork-panel"

          style={{
            "--deity-artwork": `url("${deityImage}")`,
          }}
        >
          {theme === "shiva" && (
            <video
              className="sks-shiva-divine-video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            >
              <source
                src="/videos/shiva-divine.mp4"
                type="video/mp4"
              />
            </video>
          )}

          {theme === "vishnu" && (
            <video
              className="sks-vishnu-brahmand-video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            >
              <source
                src="/videos/krishna-brahmand.mp4"
                type="video/mp4"
              />
            </video>
          )}


          {theme === "ganesha" && (
            <video
              className="sks-ganesha-divine-video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            >
              <source
                src="/videos/ganesha-divine.mp4"
                type="video/mp4"
              />
            </video>
          )}

          <div
            className="sks-artwork-shade"
            aria-hidden="true"
          />

          <div
            className="sks-artwork-top"
            aria-hidden="true"
          >
            <span>✦</span>
            <span>ॐ</span>
            <span>✦</span>
          </div>

          <div className="sks-artwork-content">
            <div className="sks-artwork-mantra">
              {selectedChant?.name ||
                "Select a mantra"}
            </div>

            <div className="sks-artwork-counter">
              <strong>
                {currentCount} / 108
              </strong>

              <span>
                Jaap Completed in Current Mala
              </span>
            </div>



            <div
              className="sks-jaap-progress"
              role="progressbar"
              aria-label="Current Mala progress"
              aria-valuemin={0}
              aria-valuemax={108}
              aria-valuenow={currentCount}
            >
              <span
                style={{
                  width: `${(currentCount / MALA_SIZE) * 100
                    }%`,
                }}
              />
            </div>

            <button
              type="button"
              className="sks-main-chant-button"
              onClick={handleChant}
              disabled={!selectedChant || showResumeButton}
            >
              {showResumeButton ? "⏸ Jaap Paused" : "🙏 Chant 🙏"}
            </button>

            <div className="sks-jaap-controls">
              <button
                type="button"
                onClick={handleReset}
                disabled={
                  !selectedChant ||
                  (currentCount === 0 && !showResumeButton)
                }
              >
                <RotateCcw size={15} />
                Reset
              </button>

              {showResumeButton ? (
                <button type="button" onClick={handleResumeJaap}>
                  <Flag size={15} />
                  Resume Jaap
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleEndJaap}
                  disabled={!selectedChant || currentCount === 0}
                >
                  <Flag size={15} />
                  Finish Jaap
                </button>
              )}


              <div className="sks-mobile-voice-controls">
                <button
                  type="button"
                  className="sks-voice-mute-btn"
                  onClick={handleToggleMute}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                </button>

                <select
                  className="sks-voice-dropdown"
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  aria-label="Select voice"
                >
                  <option value="kanha">Child</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            {notice && (
              <p
                className="sks-jaap-notice"
                role="status"
              >
                {notice}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* RECENT JAAP ACTIVITY */}

      <div className="sks-jaap-history">
        <div className="sks-history-header">
          <div className="sks-history-title">
            <img
              src={lotusImage}
              alt=""
              className="sks-history-lotus"
            />

            <h3>Recent Jaap Activity</h3>

            <img
              src={lotusImage}
              alt=""
              className="sks-history-lotus"
            />
          </div>

          <div className="sks-history-actions">
            <div className="sks-history-actions">

              {/* Speaker ON/OFF button */}
              <button
                type="button"
                className="sks-voice-mute-btn"
                onClick={handleToggleMute}
                aria-label={isMuted ? "Unmute chant" : "Mute chant"}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={15} color="#ffffff" /> : <Volume2 size={15} color="#ffffff" />}
              </button>

              {/* Male / Female / Child dropdown */}
              <select
                className="sks-voice-dropdown"
                aria-label="Select chant voice"
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="kanha">Child</option>
              </select>

              {/* Existing Clear Activity button stays here */}

            </div>

            {/* Existing Clear Activity button yahan rahega */}
          </div>

          <button
            type="button"
            className="sks-clear-activity-btn"
            onClick={handleClearActivity}
            disabled={history.length === 0 || exportingId !== null}
            title="Clear all Jaap activity"
          >
            <Trash2 size={15} />
            Clear Activity
          </button>
        </div>

        <div className="sks-history-table-wrap">
          <table className="sks-history-table">
            <thead>
              <tr>
                <th>Date &amp; Time</th>
                <th>Chant</th>
                <th>Repetition (Malas)</th>
                <th>Status</th>
                <th>Jaap Book / PDF</th>
              </tr>
            </thead>

            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="sks-history-empty"
                  >
                    <BookOpen size={19} />
                    Your Jaap activity will appear here.
                  </td>
                </tr>
              ) : (
                history.map((entry) => (
                  <tr key={entry.id}>
                    <td>
                      {formatDate(entry.date)}
                    </td>

                    <td>
                      {entry.chantName}
                    </td>

                    <td>
                      {entry.repetitions}
                    </td>

                    <td>
                      <span
                        className={`sks-status ${entry.status === "Completed"
                          ? "is-completed"
                          : "is-incomplete"
                          }`}
                      >
                        {entry.status}
                      </span>

                      {entry.status ===
                        "Not Completed" && (
                          <small className="sks-incomplete-count">
                            {entry.jaapCount}/108 Jaap
                          </small>
                        )}
                    </td>

                    <td>
                      {entry.status === "Completed" ? (
                        <div className="sks-book-row-actions">
                          <button
                            type="button"
                            onClick={() =>
                              openBook(entry)
                            }
                          >
                            <Eye size={14} />
                            View Book
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              downloadMala(entry)
                            }
                            disabled={
                              exportingId !== null
                            }
                          >
                            <Download size={14} />

                            {exportingId === entry.id
                              ? "Creating..."
                              : "PDF"}
                          </button>
                        </div>
                      ) : (
                        <span className="sks-book-pending">
                          Complete 108 Jaap to unlock
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SINGLE SCROLLABLE JAAP BOOK */}

      {previewEntry && (
        <div
          className="sks-book-modal-backdrop"
          onClick={() => setPreviewEntry(null)}
        >
          <div
            className="sks-book-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Sacred Jaap Book"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* BOOK HEADER */}

            <div className="sks-book-modal-header">
              <div>
                <strong>
                  📖 Sacred Jaap Book
                </strong>

                <small>
                  {previewEntry.chantName}
                  {" · "}
                  Mala {previewEntry.repetitions}
                  {" · "}
                  108 Jaap
                </small>
              </div>

              <div className="sks-book-modal-buttons">
                <button
                  type="button"
                  aria-label="Close Jaap Book"
                  onClick={() =>
                    setPreviewEntry(null)
                  }
                >
                  <X size={19} />
                </button>
              </div>
            </div>

            {/* ONE CONTINUOUS SCROLLABLE PAGE */}

            <div className="sks-book-pages">
              <div className="sks-book-sheet">
                <div className="sks-book-sheet-heading">
                  ॐ · {previewEntry.chantName} · माला{" "}
                  {previewEntry.repetitions}
                </div>

                <div className="sks-book-grid">
                  {Array.from(
                    { length: MALA_SIZE },
                    (_, index) => (
                      <span
                        key={index}
                        title={`Jaap ${index + 1}`}
                      >
                        {previewEntry.chantName}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}