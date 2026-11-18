import React, { useEffect, useRef, useState } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import logoMarkUrl from "./assets/manger_bien_logo_mark.png";
import grillUrl from "./assets/c32c84e3eaa3982b-image_20261112_120144.webp";
import pouletUrl from "./assets/d84d6561b69979f9-image_20261118_141609.webp";
import poissonUrl from "./assets/9beecc1168381105-image_20261112_120142_1.webp";
import sakaUrl from "./assets/6a297e264efa2eff-image_20261112_120149_1.webp";
import ponduUrl from "./assets/99a6b6132d930355-image_20261112_120149.webp";
import chefUrl from "./assets/1fc45abb4ac4e840-image_20261112_120142.webp";
import salleUrl from "./assets/676a9af082609d40-image_20261112_120144_1.webp";
import brochettesUrl from "./assets/0bdcf676dbe556d2-image_20261118_141608.webp";

const WA_NUMBER = "242053916891";
const WA_DISPLAY = "+242 05 39 16 891";
const wa = (msg: string) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

type Dish = { name: string; cat: string; price: string; desc: string; img: string; badge?: string; popular?: boolean };
const dishes: Dish[] = [
  { name: "Accras", cat: "Entrées", price: "3.500", desc: "Beignets dorés, croustillants dehors, moelleux dedans. L’entrée qui ouvre l’appétit.", img: sakaUrl },
  { name: "Beignets de manioc", cat: "Entrées", price: "2.500", desc: "Manioc fondant, légèrement sucré, à croquer chaud avec un sourire.", img: ponduUrl },
  { name: "Salade d’avocat", cat: "Entrées", price: "3.000", desc: "Avocat crémeux du marché, fraîcheur citronnée, croquant qui réveille.", img: salleUrl },
  { name: "Poulet bicyclette", cat: "Grillades", price: "7.500", desc: "Le poulet qui a fait notre réputation : grillé au feu, jus, caractère, vérité.", img: pouletUrl, badge: "Populaire", popular: true },
  { name: "Brochettes de bœuf", cat: "Grillades", price: "6.500", desc: "Bœuf mariné, grillé minute, fumé juste ce qu’il faut. On en reprend.", img: brochettesUrl, badge: "Populaire", popular: true },
  { name: "Côtes de porc", cat: "Grillades", price: "8.500", desc: "Généreuses, caramélisées au feu, fondantes. Pour les grandes faims.", img: grillUrl },
  { name: "Ailes pimentées", cat: "Grillades", price: "5.500", desc: "Piment dosé avec amour : ça pique, ça réchauffe, ça rend accro.", img: pouletUrl },
  { name: "Saka-saka + riz", cat: "Plats traditionnels", price: "6.000", desc: "Notre saka-saka mijoté longuement, riz parfumé, goût de maison.", img: sakaUrl, badge: "Plat du jour" },
  { name: "Pondu + fufu", cat: "Plats traditionnels", price: "6.500", desc: "Pondu généreux et fufu souple, la combinaison qui ne déçoit jamais.", img: ponduUrl },
  { name: "Poulet moambe", cat: "Plats traditionnels", price: "7.000", desc: "Sauce moambe onctueuse, poulet tendre, souvenir d’enfance à chaque bouchée.", img: pouletUrl },
  { name: "Maboké", cat: "Plats traditionnels", price: "8.000", desc: "Enveloppé, mijoté, parfumé. Le plat des jours de fête, tous les jours.", img: sakaUrl },
  { name: "Fufu + sauce arachide", cat: "Plats traditionnels", price: "5.500", desc: "Sauce arachide riche et douce, fufu parfait pour saucer sans retenue.", img: ponduUrl },
  { name: "Poisson braisé capitaine", cat: "Poissons", price: "9.000", desc: "Capitaine braisé au feu, peau croustillante, chair fine. Le roi de la braise.", img: poissonUrl, badge: "Populaire", popular: true },
  { name: "Tilapia braisé", cat: "Poissons", price: "8.000", desc: "Tilapia grillé entier, marinade maison, citron et piment à côté.", img: poissonUrl },
  { name: "Poisson salé + chikwangue", cat: "Poissons", price: "7.500", desc: "Poisson salé savoureux, chikwangue moelleuse, authenticité totale.", img: poissonUrl },
  { name: "Bissap", cat: "Boissons", price: "2.000", desc: "Bissap bien frais, acidulé, sucré juste comme il faut.", img: salleUrl },
  { name: "Jus de gingembre", cat: "Boissons", price: "2.000", desc: "Gingembre qui réveille, fraîcheur qui fait du bien.", img: salleUrl },
  { name: "Jus de tamarin", cat: "Boissons", price: "2.000", desc: "Tamarin doux-acidulé, la boisson des repas en famille.", img: salleUrl },
  { name: "Eau minérale", cat: "Boissons", price: "1.000", desc: "Fraîche, simple, indispensable à côté d’une bonne grillade.", img: salleUrl },
  { name: "Beignets sucrés", cat: "Desserts", price: "2.000", desc: "Dorés, saupoudrés, parfaits pour finir sur une note douce.", img: ponduUrl },
  { name: "Fruits de saison", cat: "Desserts", price: "2.500", desc: "Fruits frais du marché de Moungali, découpés minute.", img: salleUrl },
  { name: "Thiakry", cat: "Desserts", price: "3.000", desc: "Crémeux, parfumé, réconfortant. Le dessert qui clôture bien le repas.", img: ponduUrl },
];
const cats = ["Tous", "Entrées", "Grillades", "Plats traditionnels", "Poissons", "Boissons", "Desserts"];
const popular = dishes.filter(d => d.popular || d.name.includes("Saka") || d.name.includes("Pondu") || d.name.includes("Tilapia")).slice(0, 6);
const gallery = [
  { img: grillUrl, cap: "Grillades au feu — la braise de Moungali" },
  { img: pouletUrl, cap: "Poulet bicyclette, notre signature" },
  { img: poissonUrl, cap: "Poisson braisé capitaine" },
  { img: sakaUrl, cap: "Saka-saka mijoté" },
  { img: ponduUrl, cap: "Pondu + fufu" },
  { img: brochettesUrl, cap: "Brochettes de bœuf au feu" },
  { img: chefUrl, cap: "En cuisine, le geste juste" },
  { img: salleUrl, cap: "La salle, simple et chaleureuse" },
  { img: grillUrl, cap: "Soirée grill à Brazzaville" },
  { img: pouletUrl, cap: "Poulet moambe, sauce généreuse" },
  { img: poissonUrl, cap: "Tilapia braisé, citron et piment" },
  { img: brochettesUrl, cap: "Brochettes pour partager" },
];
const testimonials = [
  { name: "Grâce M.", text: "Le poulet bicyclette est exactement comme à la maison. On sent le feu, on sent le soin. Je reviens chaque semaine.", stars: "★★★★★" },
  { name: "Yannick O.", text: "Commande WhatsApp simple, livraison rapide à Moungali. Le poisson braisé capitaine est une merveille.", stars: "★★★★★" },
  { name: "Mireille K.", text: "Ambiance chaleureuse, plats généreux, prix justes. Le saka-saka du jour vaut le détour.", stars: "★★★★★" },
];
const place = { label: "MANGER BIEN - Moungali, Brazzaville", lat: -4.24838, lng: 15.26888 };

const mapsDirectionsUrl = (p: { lat: number; lng: number }) =>
  `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;

function MapBlock() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapObj = useRef<L.Map | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [selected, setSelected] = useState(true);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;

    const map = L.map(el, {
      center: [place.lat, place.lng],
      zoom: 15,
      scrollWheelZoom: false,
      zoomControl: true,
    });
    mapObj.current = map;

    let cancelled = false;
    const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    tiles.on("tileerror", () => {
      if (!cancelled) setUnavailable(true);
    });

    const icon = L.divIcon({
      className: "mb-pin",
      html: '<div class="pin"><span>★</span></div>',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
    L.marker([place.lat, place.lng], { icon, title: place.label, alt: place.label }).addTo(map);

    const t = window.setTimeout(() => map.invalidateSize(), 200);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
      try {
        map.remove();
      } catch {
        /* ignore */
      }
      mapObj.current = null;
    };
  }, []);

  const focusMap = () => {
    setSelected(true);
    mapObj.current?.flyTo([place.lat, place.lng], 16, { duration: 0.8 });
  };

  return (
    <div>
      {unavailable && (
        <p className="mb-3 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[13px] font-semibold text-amber-800">
          Carte indisponible (pas de connexion) — voici notre adresse ci-dessous.
        </p>
      )}
      <div
        ref={mapRef}
        className={`h-[420px] w-full overflow-hidden rounded-[20px] border border-[#E8DDC2] bg-[#FFF9E6] ${unavailable ? "hidden" : ""}`}
        aria-label="Carte — MANGER BIEN à Moungali"
      />
      <div className="mt-3">
        <div
          onClick={focusMap}
          className={`flex cursor-pointer flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E8DDC2] bg-white p-4 transition ${selected ? "map-selected" : "hover:border-[#EAB308]"}`}
        >
          <div className="min-w-0">
            <p className="font-display font-bold text-[15px]">1 — MANGER BIEN</p>
            <p className="text-[13px] text-gray-600">Moungali, Brazzaville • Mairie de Moungali, Avenue de la Paix</p>

          </div>
          <a
            href={mapsDirectionsUrl(place)}
            target="_blank"
            rel="noopener"
            onClick={(e) => e.stopPropagation()}
            className="rounded-full bg-[#1A1A1A] px-4 py-2.5 text-[13px] font-bold text-white"
          >
            Itinéraire ↗
          </a>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [section, setSection] = useState("accueil");
  const [filter, setFilter] = useState("Tous");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [form, setForm] = useState({ nom: "", tel: "", plat: "Poulet bicyclette", qty: "1", heure: "12:30", msg: "" });
  const [sentNote, setSentNote] = useState("");
  const topRef = useRef<HTMLDivElement>(null);
  const go = (s: string) => { setSection(s); setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 30); };
  const filtered = filter === "Tous" ? dishes : dishes.filter(d => d.cat === filter);
  const orderWhatsApp = (dish: Dish) => wa(`Bonjour MANGER BIEN ! Je veux commander : ${dish.name} — ${dish.price} FCFA. Merci !`);
  const submitOrder = () => {
    const text = `Bonjour MANGER BIEN ! Je suis ${form.nom || "un client"}. Je veux commander : ${form.qty} × ${form.plat} pour ${form.heure}. Tél : ${form.tel}. Message : ${form.msg || "—"}`;
    setSentNote("Votre commande s’ouvre dans WhatsApp — vérifiez le message puis envoyez.");
    window.open(wa(text), "_blank", "noopener");
  };
  const nav = [
    { id: "accueil", label: "Accueil" }, { id: "menu", label: "Menu" }, { id: "histoire", label: "Notre Histoire" }, { id: "galerie", label: "Galerie" }, { id: "contact", label: "Contact" },
  ];
  return (
    <div data-safe-area-inset-root style={{ boxSizing: "border-box", paddingTop: "var(--safe-area-inset-top)" }} className="min-h-screen bg-white text-[#1A1A1A] overflow-x-clip">
      {/* TOP BAR */}
      {/* <div className="bg-[#1A1A1A] text-white">
        <div className="container-x flex flex-wrap items-center justify-between gap-2 py-2 text-[12px] font-semibold">
          <span>📍 Moungali, Brazzaville • Lun – Dim • 08h – 23h</span>
          <span className="hidden sm:inline">Prix : 3.000 – 10.000 FCFA • Sur place & livraison</span>
          <a href={`tel:+${WA_NUMBER}`} className="text-[#EAB308]">📞 {WA_DISPLAY}</a>
        </div>
      </div> */}

      {/* NAVBAR sticky */}
      <header data-safe-area-sticky-top style={{ top: "var(--safe-area-inset-top)" }} className="sticky z-40 bg-white/95 backdrop-blur border-b border-[#E8DDC2]">
        <div className="container-x flex items-center justify-between gap-3 py-3">
          <button onClick={() => go("accueil")} className="flex items-center gap-2.5 text-left">
            <img src={logoMarkUrl} alt="Logo MANGER BIEN — restaurant africain à Brazzaville" className="h-11 w-11 shrink-0 object-contain sm:h-14 sm:w-14" />
            <span className="leading-none"><span className="block font-display text-[20px] font-black tracking-tight">MANGER <span className="text-[#EAB308]">BIEN</span></span><span className="hidden text-[11px] font-bold tracking-[0.16em] text-gray-500 sm:block">MOUNGALI • BRAZZAVILLE</span></span>
          </button>
          <nav className="hidden lg:flex items-center gap-1">{nav.map(n => <button key={n.id} onClick={() => go(n.id)} className={`nav-link-btn ${section === n.id ? "active" : "hover:bg-[#FFF9E6]"}`}>{n.label}</button>)}</nav>
          <div className="flex items-center gap-2">
            <a href={`tel:+${WA_NUMBER}`} className="hidden sm:inline-flex rounded-full border-2 border-[#1A1A1A] px-3 py-2 text-[13px] font-bold">Appeler</a>
            <a href={wa("Bonjour MANGER BIEN ! Je veux commander.")} target="_blank" rel="noopener" className="btn-wa rounded-full px-4 py-2.5 text-[13px]">WhatsApp</a>
          </div>
        </div>
        <div className="lg:hidden border-t border-gray-100"><div className="container-x flex gap-1 overflow-x-auto no-scrollbar py-2">{nav.map(n => <button key={n.id} onClick={() => go(n.id)} className={`nav-link-btn shrink-0 ${section === n.id ? "active" : "bg-[#FFF9E6]"}`}>{n.label}</button>)}</div></div>
      </header>

      <div ref={topRef} />

      {/* ACCUEIL */}
      {section === "accueil" && (
        <main>
          <section className="bg-[#1A1A1A] text-white overflow-hidden">
            <div className="container-x grid lg:grid-cols-2 gap-8 lg:gap-10 items-center py-8 sm:py-12">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#EAB308] text-[#1A1A1A] px-3 py-1.5 text-[12px] font-black">★ RESTAURANT AFRICAIN • MOUNGALI • 4,8/5</span>
                <h1 className="mt-4 font-display text-[clamp(34px,7vw,58px)] leading-[0.98] font-black">Le vrai goût de<br />l’Afrique, <span className="text-[#EAB308]">à Brazzaville.</span></h1>
                <p className="mt-4 text-[15px] sm:text-[17px] leading-relaxed text-white/80 max-w-[560px]">Grillades au feu, poulet bicyclette, poisson braisé, saka-saka et pondu. Des plats faits maison, généreux, à prix justes — tous les jours de 08h à 23h.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={() => go("menu")} className="btn-gold rounded-full px-5 py-3.5 text-[14px]">Voir le Menu →</button>
                  <a href={wa("Bonjour MANGER BIEN ! Je veux commander.")} target="_blank" rel="noopener" className="btn-wa rounded-full px-5 py-3.5 text-[14px]">Commander sur WhatsApp</a>
                </div>
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-semibold text-white/80"><span>⏱ Livraison rapide</span></div>
              </div>
              <div className="relative">
                <img src={grillUrl} alt="Grillades au feu chez MANGER BIEN" className="h-[300px] sm:h-[420px] w-full rounded-[24px] object-cover shadow-2xl" />
                {/* <div className="absolute left-3 bottom-3 sm:left-5 sm:bottom-5 bg-white text-[#1A1A1A] rounded-2xl px-4 py-3 card-shadow"><p className="text-[11px] font-black tracking-widest text-[#C0392B]">PLAT DU JOUR</p><p className="font-display font-bold">Saka-saka + riz — 6.000 FCFA</p></div> */}
                <div className="absolute right-3 top-3 bg-[#EAB308] text-[#1A1A1A] rounded-full px-3 py-2 text-[12px] font-black">Ouvert Lun – Dim • 08h – 23h</div>
              </div>
            </div>
          </section>

          <section className="container-x py-10">
            <div className="grid sm:grid-cols-3 gap-4">
              {[{ t: "Plats faits maison", d: "Produits frais du marché de Moungali, recettes traditionnelles, mijoté avec patience.", e: "🍲" }, { t: "Livraison rapide", d: "Commandez sur WhatsApp, on prépare, on vous livre chaud à Brazzaville.", e: "🛵" }, { t: "Ambiance chaleureuse", d: "Une salle simple, accueillante, pour manger en famille ou entre amis.", e: "❤️" }].map(x => (
                <div key={x.t} className="rounded-[20px] border border-[#E8DDC2] bg-[#FFF9E6] p-5"><div className="text-[32px]">{x.e}</div><h3 className="font-display font-bold text-[18px] mt-2">{x.t}</h3><p className="text-[14px] text-gray-600 leading-relaxed mt-1">{x.d}</p></div>
              ))}
            </div>
          </section>

          <section className="container-x pb-10">
            <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-display text-[clamp(26px,5vw,36px)] font-black">6 plats populaires</h2></div><button onClick={() => go("menu")} className="btn-dark rounded-full px-4 py-2.5 text-[13px]">Tout le menu →</button></div>
            <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popular.map(d => (
                <article key={d.name} className="overflow-hidden rounded-[20px] border border-gray-100 bg-white card-shadow">
                  <div className="relative h-[190px]"><img src={d.img} alt={d.name} className="img-cover" />{d.badge && <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-black ${d.badge === "Plat du jour" ? "badge-jour" : "badge-pop"}`}>{d.badge}</span>}<span className="absolute right-3 top-3 bg-[#1A1A1A] text-white rounded-full px-3 py-1.5 text-[13px] font-black">{d.price} FCFA</span></div>
                  <div className="p-4"><h3 className="font-display font-bold text-[17px]">{d.name}</h3><p className="mt-1 text-[13px] text-gray-600 leading-relaxed min-h-[52px]">{d.desc}</p><a href={orderWhatsApp(d)} target="_blank" rel="noopener" className="btn-wa mt-3 block rounded-full py-2.5 text-center text-[13px]">Commander sur WhatsApp</a></div>
                </article>
              ))}
            </div>
          </section>

          <section className="bg-[#FFF9E6] border-y border-[#E8DDC2]"><div className="container-x py-10"><h2 className="text-center font-display text-[28px] font-black mt-1">Ce que disent nos clients</h2><div className="mt-6 grid md:grid-cols-3 gap-4">{testimonials.map(t => <figure key={t.name} className="bg-white rounded-[20px] border border-gray-100 p-5 card-shadow"><div className="text-[#EAB308]">{t.stars}</div><blockquote className="mt-2 text-[14px] leading-relaxed text-gray-700">“{t.text}”</blockquote><figcaption className="mt-3 font-bold text-[14px]">— {t.name} <span className="font-normal text-gray-500">• Client à Brazzaville</span></figcaption></figure>)}</div></div></section>

          <section className="container-x py-10 grid lg:grid-cols-5 gap-6 items-start">
            <div className="lg:col-span-2 rounded-[20px] bg-[#1A1A1A] text-white p-6"><p className="text-[12px] font-black tracking-[0.18em] text-[#EAB308]">HORAIRES & ADRESSE</p><h3 className="font-display text-[24px] font-bold mt-2">Retrouvez-nous à Moungali</h3><div className="mt-4 space-y-3 text-[14px] text-white/85"><p>📍 Moungali, Brazzaville<br />Mairie de Moungali, Avenue de la Paix</p><p>🕐 Lun – Dim • 08h – 23h<br />Ouvert tous les jours</p><p>📞 <a href={`tel:+${WA_NUMBER}`} className="text-[#EAB308] font-bold">{WA_DISPLAY}</a></p><p>⭐ Avis Google : <b>4,8 / 5</b></p></div><div className="mt-5 grid grid-cols-2 gap-2"><a href={mapsDirectionsUrl(place)} target="_blank" rel="noopener" className="bg-white text-[#1A1A1A] rounded-full py-3 text-center text-[13px] font-bold">Itinéraire ↗</a><a href={wa("Bonjour MANGER BIEN ! Je veux commander.")} target="_blank" rel="noopener" className="btn-wa rounded-full py-3 text-center text-[13px]">WhatsApp</a></div></div>
            <div className="lg:col-span-3"><MapBlock /></div>
          </section>
        </main>
      )}

      {/* MENU */}
      {section === "menu" && (
        <main className="container-x py-8">
          <p className="text-[12px] font-black tracking-[0.18em] text-[#C0392B]">NOTRE MENU • PRIX EN FCFA</p>
          <h1 className="font-display text-[clamp(30px,6vw,44px)] font-black leading-tight">Un menu qui sent <span className="text-[#EAB308]">le feu et la maison.</span></h1>
          <p className="mt-2 text-gray-600 text-[15px] max-w-[680px]">Filtrez par envie. Chaque plat se commande en un clic sur WhatsApp — dites-nous juste le plat, la quantité et l’heure.</p>
          <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar pb-1">{cats.map(c => <button key={c} onClick={() => setFilter(c)} className={`chip ${filter === c ? "active" : ""}`}>{c} {c === "Tous" ? `(${dishes.length})` : `(${dishes.filter(d => d.cat === c).length})`}</button>)}</div>
          <p className="mt-4 text-[13px] font-bold text-gray-600">{filtered.length} plat{filtered.length > 1 ? "s" : ""} — {filter}</p>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(d => (
              <article key={d.name} className="overflow-hidden rounded-[20px] border border-gray-100 bg-white card-shadow flex flex-col">
                <div className="relative h-[200px]"><img src={d.img} alt={d.name} className="img-cover" /><span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-black">{d.cat}</span>{d.badge && <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-black ${d.badge === "Plat du jour" ? "badge-jour" : "badge-pop"}`}>{d.badge}</span>}</div>
                <div className="p-4 flex flex-1 flex-col"><div className="flex items-start justify-between gap-2"><h3 className="font-display font-bold text-[17px] leading-tight">{d.name}</h3><span className="shrink-0 rounded-full bg-[#1A1A1A] text-white px-3 py-1.5 text-[13px] font-black">{d.price} FCFA</span></div><p className="mt-2 text-[13px] text-gray-600 leading-relaxed flex-1">{d.desc}</p><a href={orderWhatsApp(d)} target="_blank" rel="noopener" className="btn-wa mt-4 block rounded-full py-2.5 text-center text-[13px]">Commander sur WhatsApp</a></div>
              </article>
            ))}
          </div>
          <div className="mt-8 rounded-[20px] bg-[#1A1A1A] text-white p-6 flex flex-wrap items-center justify-between gap-4"><div><h3 className="font-display font-bold text-[20px]">Une envie précise ?</h3><p className="text-white/70 text-[14px]">Écrivez-nous le plat, la quantité et l’heure. On s’occupe du reste.</p></div><a href={wa("Bonjour MANGER BIEN ! Je veux commander.")} target="_blank" rel="noopener" className="btn-gold rounded-full px-5 py-3 text-[14px]">Commander sur WhatsApp</a></div>
        </main>
      )}

      {/* HISTOIRE */}
      {section === "histoire" && (
        <main>
          <section className="container-x py-8 grid lg:grid-cols-2 gap-8 items-center">
            <div><p className="text-[12px] font-black tracking-[0.18em] text-[#C0392B]">NOTRE HISTOIRE</p><h1 className="font-display text-[clamp(30px,6vw,44px)] font-black leading-[1.02] mt-2">Née à Moungali,<br />autour du feu.</h1><p className="mt-4 text-[15px] leading-relaxed text-gray-700">MANGER BIEN est né d’une envie simple : servir à Brazzaville la cuisine qu’on aime partager en famille — généreuse, parfumée, honnête. Chaque matin, on choisit les produits au marché. Chaque midi, la braise s’allume. Chaque soir, la table se remplit.</p><p className="mt-3 text-[15px] leading-relaxed text-gray-700">Notre poulet bicyclette, notre poisson braisé, notre saka-saka : ce sont des recettes qui prennent le temps. Pas de raccourci, pas de triche. Juste le feu, les bons produits et le geste juste.</p><div className="mt-6 grid grid-cols-3 gap-3 text-center"><div className="rounded-2xl bg-[#FFF9E6] border border-[#E8DDC2] p-3"><p className="font-display font-black text-[20px]">08h – 23h</p><p className="text-[11px] font-bold text-gray-600">7J / 7 OUVERT</p></div><div className="rounded-2xl bg-[#FFF9E6] border border-[#E8DDC2] p-3"><p className="font-display font-black text-[20px]">22 plats</p><p className="text-[11px] font-bold text-gray-600">AU MENU</p></div><div className="rounded-2xl bg-[#FFF9E6] border border-[#E8DDC2] p-3"><p className="font-display font-black text-[20px]">4,8 / 5</p><p className="text-[11px] font-bold text-gray-600">AVIS GOOGLE</p></div></div></div>
            <div className="grid grid-cols-2 gap-3"><img src={chefUrl} alt="Le chef de MANGER BIEN en cuisine" className="h-[260px] sm:h-[340px] w-full rounded-[20px] object-cover card-shadow" /><img src={salleUrl} alt="La salle de MANGER BIEN à Moungali" className="h-[260px] sm:h-[340px] w-full rounded-[20px] object-cover card-shadow mt-6" /></div>
          </section>
          <section className="bg-[#FFF9E6] border-y border-[#E8DDC2]"><div className="container-x py-8 grid md:grid-cols-3 gap-4">{[{ t: "Produits frais du marché", d: "On choisit chaque jour au marché de Moungali : frais, de saison, de proximité.", e: "🥬" }, { t: "Recettes traditionnelles", d: "Saka-saka, pondu, moambe, maboké — les recettes transmises, respectées.", e: "🍲" }, { t: "Hygiène", d: "Une cuisine propre, des gestes rigoureux, pour manger en confiance.", e: "✨" }].map(v => <div key={v.t} className="bg-white rounded-[20px] p-5 border border-gray-100 card-shadow"><div className="text-[28px]">{v.e}</div><h3 className="font-display font-bold mt-2">{v.t}</h3><p className="text-[14px] text-gray-600 leading-relaxed mt-1">{v.d}</p></div>)}</div></section>
          <section className="container-x py-8 text-center"><h2 className="font-display text-[26px] font-black">Venez goûter la différence.</h2><p className="text-gray-600 mt-1">Moungali, Brazzaville • Lun – Dim • 08h – 23h</p><div className="mt-4 flex flex-wrap justify-center gap-3"><a href={wa("Bonjour MANGER BIEN ! Je veux commander.")} target="_blank" rel="noopener" className="btn-wa rounded-full px-5 py-3 text-[14px]">Commander sur WhatsApp</a><button onClick={() => go("menu")} className="btn-outline-gold rounded-full px-5 py-3 text-[14px]">Voir le Menu</button></div></section>
        </main>
      )}

      {/* GALERIE */}
      {section === "galerie" && (
        <main className="container-x py-8">
          <p className="text-[12px] font-black tracking-[0.18em] text-[#C0392B]">GALERIE</p><h1 className="font-display text-[clamp(30px,6vw,42px)] font-black">En images, <span className="text-[#EAB308]">comme à table.</span></h1><p className="text-gray-600 mt-2">Cliquez sur une photo pour l’agrandir.</p>
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-3">
            {gallery.map((g, i) => <button key={i} onClick={() => setLightbox(i)} className="group relative overflow-hidden rounded-[18px] text-left"><img src={g.img} alt={g.cap} className="h-[180px] sm:h-[240px] w-full object-cover transition group-hover:scale-105" /><span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 pt-8 text-[12px] sm:text-[13px] font-bold text-white">{g.cap}</span></button>)}
          </div>
          {lightbox !== null && <div onClick={() => setLightbox(null)} className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"><div className="max-w-[860px] w-full" onClick={e => e.stopPropagation()}><img src={gallery[lightbox].img} alt={gallery[lightbox].cap} className="w-full max-h-[72vh] object-cover rounded-[20px]" /><div className="mt-3 flex items-center justify-between gap-3"><p className="text-white font-bold text-[15px]">{gallery[lightbox].cap}</p><button onClick={() => setLightbox(null)} className="bg-white text-black rounded-full px-4 py-2 text-[13px] font-bold">Fermer ✕</button></div></div></div>}
        </main>
      )}

      {/* CONTACT */}
      {section === "contact" && (
        <main className="container-x py-8 grid lg:grid-cols-2 gap-6 items-start">
          <div className="rounded-[22px] border border-[#E8DDC2] bg-white card-shadow p-5 sm:p-6">
            <p className="text-[12px] font-black tracking-[0.18em] text-[#C0392B]">COMMANDE WHATSAPP</p><h1 className="font-display text-[28px] font-black mt-1">Commandez en 30 secondes</h1><p className="text-[14px] text-gray-600 mt-1">Remplissez, puis envoyez : votre message s’ouvre déjà rédigé dans WhatsApp.</p>
            <div className="mt-5 space-y-3">
              <div><label className="text-[13px] font-bold">Nom</label><input className="field mt-1" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="Votre nom" /></div>
              <div className="grid sm:grid-cols-2 gap-3"><div><label className="text-[13px] font-bold">Téléphone</label><input className="field mt-1" value={form.tel} onChange={e => setForm({ ...form, tel: e.target.value })} placeholder="Ex : 05 39 16 891" /></div><div><label className="text-[13px] font-bold">Quantité</label><select className="field mt-1" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })}>{["1", "2", "3", "4", "5", "6+"].map(q => <option key={q}>{q}</option>)}</select></div></div>
              <div className="grid sm:grid-cols-2 gap-3"><div><label className="text-[13px] font-bold">Plat</label><select className="field mt-1" value={form.plat} onChange={e => setForm({ ...form, plat: e.target.value })}>{dishes.map(d => <option key={d.name}>{d.name} — {d.price} FCFA</option>)}</select></div><div><label className="text-[13px] font-bold">Heure souhaitée</label><input type="time" className="field mt-1" value={form.heure} onChange={e => setForm({ ...form, heure: e.target.value })} /></div></div>
              <div><label className="text-[13px] font-bold">Message</label><textarea className="field mt-1 min-h-[96px]" value={form.msg} onChange={e => setForm({ ...form, msg: e.target.value })} placeholder="Ex : Sans piment, s’il vous plaît. Livraison à Moungali." /></div>
              <button onClick={submitOrder} className="btn-wa w-full rounded-full py-3.5 text-[14px]">Envoyer sur WhatsApp →</button>
              {sentNote && <p className="rounded-xl bg-green-50 border border-green-200 px-3 py-2 text-[13px] font-semibold text-green-800">{sentNote}</p>}
              <p className="text-[12px] text-gray-500">En cliquant, WhatsApp s’ouvre vers {WA_DISPLAY}. Aucune donnée n’est enregistrée sur ce site.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-[22px] bg-[#1A1A1A] text-white p-6"><h2 className="font-display text-[22px] font-bold">Nous trouver</h2><div className="mt-3 space-y-2 text-[14px] text-white/85"><p>📍 Moungali, Brazzaville — Mairie de Moungali, Avenue de la Paix</p><p>🕐 Lun – Dim • 08h – 23h</p><p>📞 <a href={`tel:+${WA_NUMBER}`} className="text-[#EAB308] font-bold">{WA_DISPLAY}</a></p><p>⭐ Avis Google : 4,8 / 5 — merci pour vos avis !</p></div><div className="mt-4 flex flex-wrap gap-2"><a href={mapsDirectionsUrl(place)} target="_blank" rel="noopener" className="bg-white text-black rounded-full px-4 py-2.5 text-[13px] font-bold">Itinéraire ↗</a><a href={`tel:+${WA_NUMBER}`} className="rounded-full border border-white/40 px-4 py-2.5 text-[13px] font-bold">Appeler</a></div><div className="mt-4 flex flex-wrap gap-2 text-[13px] font-bold"><a href="https://www.facebook.com/mangerbien.brazza" target="_blank" rel="noopener" className="rounded-full bg-white/10 px-3 py-2">Facebook</a><a href="https://www.instagram.com/mangerbien.brazza" target="_blank" rel="noopener" className="rounded-full bg-white/10 px-3 py-2">Instagram</a><a href="https://www.tiktok.com/@mangerbien.brazza" target="_blank" rel="noopener" className="rounded-full bg-white/10 px-3 py-2">TikTok</a></div><p className="mt-3 text-[13px] text-white/60">@mangerbien.brazza sur Facebook, Instagram et TikTok</p></div>
            <MapBlock />
          </div>
        </main>
      )}

      {/* SEO + GUIDE + CHECKLIST */}
      <section className="border-t border-[#E8DDC2] bg-[#FFFBEB]"><div className="container-x py-10">
        <h2 className="font-display text-[24px] font-black mt-1">Restaurant africain à Brazzaville — grillades, saka-saka, pondu</h2>
        <div className="mt-5 grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-[13px] leading-relaxed text-gray-700">
          {[
            ["Restaurant africain à Brazzaville : où bien manger à Moungali ?", "À Moungali, MANGER BIEN sert une cuisine africaine généreuse et faite maison, à deux pas de la Mairie de Moungali. Grillades au feu, plats traditionnels et boissons fraîches, tous les jours de 08h à 23h."],
            ["Grillade à Brazzaville : poulet bicyclette et poisson braisé", "Notre grillade à Brazzaville, c’est le poulet bicyclette grillé au feu, les brochettes de bœuf et le poisson braisé capitaine. Commandez sur WhatsApp et venez goûter la braise."],
            ["Saka-saka à Brazzaville : le plat du jour qui rassemble", "Le saka-saka + riz est notre plat du jour : mijoté longuement, servi généreusement. Avec le pondu + fufu, c’est le cœur de notre cuisine traditionnelle."],
            ["Pondu et fufu à Moungali : tradition et générosité", "Le pondu + fufu, le poulet moambe, le maboké et la sauce arachide : des plats traditionnels préparés avec des produits frais du marché."],
            ["Commander à Brazzaville : simple, rapide, sur WhatsApp", "Commandez en 30 secondes : choisissez le plat, la quantité, l’heure, puis envoyez sur WhatsApp au +242 05 39 16 891. Sur place ou en livraison."],
          ].map(([t, d]) => <article key={t} className="bg-white rounded-2xl border border-gray-100 p-4"><h3 className="font-display font-bold text-[14px] leading-snug">{t}</h3><p className="mt-2">{d}</p></article>)}
        </div>
        {/* <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="rounded-[20px] bg-white border border-[#E8DDC2] p-5"><h3 className="font-display font-bold text-[18px]">Guide — Changer un prix, une photo ou un plat en 1 page</h3><ol className="mt-3 space-y-2 text-[13px] text-gray-700 list-decimal pl-5"><li>Ouvrez la section <b>Menu</b> et retrouvez le plat dans la liste.</li><li>Changez le <b>prix en FCFA</b> affiché à côté du nom (ex : 7.500).</li><li>Changez la <b>photo</b> en remplaçant l’image du plat par une nouvelle photo.</li><li>Modifiez le <b>nom ou la description</b> pour vendre le plat.</li><li>Enregistrez, puis vérifiez sur la page Menu et sur l’Accueil.</li></ol></div>
          <div className="rounded-[20px] bg-[#1A1A1A] text-white p-5"><h3 className="font-display font-bold text-[18px]">Checklist SEO</h3><ul className="mt-3 space-y-2 text-[13px] text-white/85"><li>✓ Titre : MANGER BIEN | Restaurant Africain à Brazzaville…</li><li>✓ Description avec restaurant africain, grillade, saka-saka, pondu</li><li>✓ Un seul numéro partout : +242 05 39 16 891</li><li>✓ Adresse, horaires et avis 4,8/5 visibles</li><li>✓ Photos nommées et légendées, liens WhatsApp testés</li></ul></div>
        </div> */}
      </div></section>

      {/* FOOTER */}
      <footer className="bg-[#1A1A1A] text-white"><div className="container-x py-8 grid md:grid-cols-3 gap-6">
        <div><div className="flex items-center gap-2"><img src={logoMarkUrl} alt="Logo MANGER BIEN" className="h-12 w-12 shrink-0 object-contain" /><span className="font-display font-black text-[20px]">MANGER <span className="text-[#EAB308]">BIEN</span></span></div><p className="mt-3 text-[13px] text-white/70 leading-relaxed">Le vrai goût de l’Afrique, à Brazzaville. Grillades, plats traditionnels et accueil chaleureux à Moungali.</p></div>
        <div><h4 className="font-display font-bold">Navigation</h4><div className="mt-3 flex flex-wrap gap-2">{nav.map(n => <button key={n.id} onClick={() => go(n.id)} className="rounded-full bg-white/10 px-3 py-2 text-[13px] font-bold">{n.label}</button>)}</div></div>
        <div><h4 className="font-display font-bold">Contact</h4><p className="mt-3 text-[13px] text-white/75 leading-relaxed">Moungali, Brazzaville<br />Lun – Dim • 08h – 23h<br /><a href={`tel:+${WA_NUMBER}`} className="text-[#EAB308] font-bold">{WA_DISPLAY}</a><br />@mangerbien.brazza</p></div>
      </div><div className="border-t border-white/10"><div className="container-x py-4 flex flex-wrap justify-between gap-2 text-[12px] text-white/50"><span>© MANGER BIEN — Moungali, Brazzaville</span><span>Prix en FCFA • Commande sur WhatsApp</span></div></div></footer>

      {/* FLOATING */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <a href={`tel:+${WA_NUMBER}`} className="flex items-center gap-2 rounded-full bg-[#1A1A1A] text-white px-4 py-3 text-[13px] font-bold shadow-2xl">📞 Appeler</a>
        <a href={wa("Bonjour MANGER BIEN ! Je veux commander.")} target="_blank" rel="noopener" className="btn-wa flex items-center gap-2 rounded-full px-4 py-3 text-[13px] shadow-2xl">💬 WhatsApp</a>
      </div>
    </div>
  );
}
