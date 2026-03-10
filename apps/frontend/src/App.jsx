import { useState, useEffect, useMemo, useRef } from "react";
import { Routes, Route, Link } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import { useAuth } from "./context/AuthContext";

// ─── FAMILIAS REALES DE LA EMPRESA ────────────────────────────────────────────
const FAMILIAS = [
  { codigo: "ALFB", desc: "ALFOMBRAS" },
  { codigo: "BLNC", desc: "BLANCOS" },
  { codigo: "BTCA", desc: "BUTACAS" },
  { codigo: "CDRT", desc: "CUADRANTE" },
  { codigo: "CLCH", desc: "COLCHAS" },
  { codigo: "CLCN", desc: "COLCHONES" },
  { codigo: "CNSM", desc: "CONSUMIBLES" },
  { codigo: "CORT", desc: "CORTINA" },
  { codigo: "CUBC", desc: "CUBRECANAPES" },
  { codigo: "ESBT", desc: "ESPUMA Y BOATA" },
  { codigo: "ESTR", desc: "ESTOR" },
  { codigo: "FUND", desc: "FUNDA" },
  { codigo: "HERR", desc: "HERRAMIENTAS" },
  { codigo: "HRRJ", desc: "HERRAJES" },
  { codigo: "LNCR", desc: "LENCERIA" },
  { codigo: "MADR", desc: "MADERA" },
  { codigo: "MLBR", desc: "MOBILIARIO" },
  { codigo: "MNOB", desc: "MANO DE OBRA" },
  { codigo: "MNTL", desc: "MANTELERIA" },
  { codigo: "MTOF", desc: "MATERIAL OFICINA" },
  { codigo: "PAVB", desc: "PAVIMENTO" },
  { codigo: "PLAD", desc: "PLAIDS" },
  { codigo: "PVAL", desc: "PAVIMENTO Y ALFOMBRAS" },
  { codigo: "RDAP", desc: "RODAPIE" },
  { codigo: "RELLE", desc: "RELLENOS" },
  { codigo: "RIBA", desc: "RIELES Y BARRAS" },
  { codigo: "RLLN", desc: "RELLENOS (2)" },
  { codigo: "RVST", desc: "REVESTIMIENTO" },
  { codigo: "SLLA", desc: "SILLAS" },
  { codigo: "SOFA", desc: "SOFAS" },
  { codigo: "SOMB", desc: "SOMBRA" },
  { codigo: "TELA", desc: "TELA" },
  { codigo: "VARI", desc: "ARTICULOS VARIOS" },
  { codigo: "MOTP", desc: "M.O. TAPIZADO" },
];

// ─── TIPOS POR FAMILIA ────────────────────────────────────────────────────────
// idTipo es array: primero = modo por defecto. CJ y similares aceptan variante Y tamano.
const TIPOS = [
  // ALFOMBRAS
  { codigo: "ALF", desc: "ALFOMBRA", familia: "ALFB", idTipo: ["tamano"] },
  { codigo: "FLP", desc: "FELPUDO", familia: "ALFB", idTipo: ["tamano"] },
  // BLANCOS
  { codigo: "SAB", desc: "SABANA", familia: "BLNC", idTipo: ["tamano"] },
  { codigo: "FND", desc: "FUNDA", familia: "BLNC", idTipo: ["tamano"] },
  { codigo: "MAN", desc: "MANTAS", familia: "BLNC", idTipo: ["tamano"] },
  // BUTACAS
  { codigo: "BUT", desc: "BUTACA", familia: "BTCA", idTipo: ["variante", "tamano"] },
  { codigo: "POF", desc: "POOF/PUF", familia: "BTCA", idTipo: ["tamano"] },
  // CUADRANTE (cojines, cuadrantes)
  { codigo: "CJ", desc: "COJIN", familia: "CDRT", idTipo: ["variante", "tamano"] },
  { codigo: "QUAD", desc: "CUADRANTE", familia: "CDRT", idTipo: ["tamano"] },
  // COLCHAS
  { codigo: "COL", desc: "COLCHA", familia: "CLCH", idTipo: ["tamano"] },
  { codigo: "EDR", desc: "EDREDON", familia: "CLCH", idTipo: ["tamano"] },
  // COLCHONES
  { codigo: "CLN", desc: "COLCHON", familia: "CLCN", idTipo: ["tamano"] },
  { codigo: "VIS", desc: "VISCOELASTICO", familia: "CLCN", idTipo: ["tamano"] },
  // CORTINA
  { codigo: "CRT", desc: "CORTINA", familia: "CORT", idTipo: ["tamano"] },
  { codigo: "VIS", desc: "VISILLO", familia: "CORT", idTipo: ["tamano"] },
  { codigo: "PAN", desc: "PANEL", familia: "CORT", idTipo: ["tamano"] },
  // ESTOR
  { codigo: "EST", desc: "ESTOR", familia: "ESTR", idTipo: ["tamano"] },
  { codigo: "BLK", desc: "BLACKOUT", familia: "ESTR", idTipo: ["tamano"] },
  // FUNDA
  { codigo: "FNS", desc: "FUNDA SOFA", familia: "FUND", idTipo: ["variante", "tamano"] },
  { codigo: "FNC", desc: "FUNDA COJIN", familia: "FUND", idTipo: ["variante", "tamano"] },
  { codigo: "FNB", desc: "FUNDA BUTACA", familia: "FUND", idTipo: ["variante"] },
  // LENCERIA
  { codigo: "TOA", desc: "TOALLA", familia: "LNCR", idTipo: ["tamano"] },
  { codigo: "ALB", desc: "ALBORNOZ", familia: "LNCR", idTipo: ["variante"] },
  // MANTELERIA
  { codigo: "MNT", desc: "MANTEL", familia: "MNTL", idTipo: ["tamano"] },
  { codigo: "IND", desc: "INDIVIDUAL", familia: "MNTL", idTipo: ["tamano"] },
  { codigo: "CAM", desc: "CAMINO MESA", familia: "MNTL", idTipo: ["tamano"] },
  { codigo: "SRV", desc: "SERVILLETA", familia: "MNTL", idTipo: ["tamano"] },
  // PLAIDS
  { codigo: "PLD", desc: "PLAID", familia: "PLAD", idTipo: ["tamano"] },
  // RELLENOS
  { codigo: "RLL", desc: "RELLENO COJIN", familia: "RELLE", idTipo: ["tamano"] },
  { codigo: "FBR", desc: "FIBRA", familia: "RELLE", idTipo: ["tamano"] },
  // REVESTIMIENTO
  { codigo: "PAP", desc: "PAPEL PARED", familia: "RVST", idTipo: ["tamano"] },
  { codigo: "VNL", desc: "VINILO", familia: "RVST", idTipo: ["tamano"] },
  // MLBR - MOBILIARIO
  { codigo: "MES", desc: "MESA", familia: "MLBR", idTipo: ["tamano"] },
  { codigo: "MSN", desc: "MESITA", familia: "MLBR", idTipo: ["tamano"] },
  { codigo: "MSC", desc: "MESA COMEDOR", familia: "MLBR", idTipo: ["tamano"] },
  { codigo: "MUB", desc: "MUEBLE BAJO", familia: "MLBR", idTipo: ["variante", "tamano"] },
  { codigo: "MBL", desc: "MUEBLE", familia: "MLBR", idTipo: ["variante"] },
  // SLLA - SILLAS
  { codigo: "SLL", desc: "SILLA", familia: "SLLA", idTipo: ["variante", "tamano"] },
  { codigo: "BNQ", desc: "BANQUETA", familia: "SLLA", idTipo: ["variante", "tamano"] },
  { codigo: "TAB", desc: "TABURETE", familia: "SLLA", idTipo: ["variante", "tamano"] },
  // SOFAS
  { codigo: "MOD", desc: "MODULO", familia: "SOFA", idTipo: ["variante", "tamano"] },
  { codigo: "CHI", desc: "CHAISE", familia: "SOFA", idTipo: ["tamano"] },
  { codigo: "REC", desc: "RECLINABLE", familia: "SOFA", idTipo: ["variante"] },
  { codigo: "RNC", desc: "RINCONERA", familia: "SOFA", idTipo: ["variante", "tamano"] },
  // TELA
  { codigo: "CMR", desc: "COLECCION", familia: "TELA", idTipo: ["modelo"] },
  { codigo: "MTS", desc: "METROS", familia: "TELA", idTipo: ["tamano"] },
  // MANO DE OBRA TAPIZADO (MOTP)
  { codigo: "SOFA", desc: "SOFA", familia: "MOTP", idTipo: ["variante"] },
  { codigo: "SLL", desc: "SILLA", familia: "MOTP", idTipo: ["variante"] },
  { codigo: "BUT", desc: "BUTACA", familia: "MOTP", idTipo: ["variante"] },
];

const VARIANTES = [
  { codigo: "CER", desc: "CERRADO" },
  { codigo: "PAS", desc: "PASAMANERIA" },
  { codigo: "VIV", desc: "VIVO" },
  { codigo: "PET", desc: "PETACA" },
  { codigo: "BOR", desc: "BORDADO" },
  { codigo: "LIS", desc: "LISO" },
  { codigo: "EST", desc: "ESTAMPADO" },
  { codigo: "ABT", desc: "ABIERTO" },
  { codigo: "FLE", desc: "FLECOS" },
  { codigo: "3C", desc: "3P. COMPLEJO" },
  { codigo: "3S", desc: "3P. SENCILLO" },
  { codigo: "2C", desc: "2P. COMPLEJO" },
  { codigo: "2S", desc: "2P. SENCILLO" },
  { codigo: "1C", desc: "1P. COMPLEJO" },
  { codigo: "1S", desc: "1P. SENCILLO" },
];

// ─── MOTOR DE ANÁLISIS DE TEXTO ───────────────────────────────────────────────
const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const hasWord = (text, kws) => { const t = " " + norm(text) + " "; return kws.some((k) => t.includes(" " + norm(k) + " ")); };
const hasSub = (text, kws) => { const t = norm(text); return kws.some((k) => t.includes(norm(k))); };

// Keywords mapeadas con las familias REALES de la empresa
const KW = {
  // ── FAMILIAS ─────────────────────────────────────────────────────────────────
  // Orden importa: mas especifico primero para evitar falsos positivos
  familias: [
    { kw: ["alfombra", "alfombras", "felpudo", "moqueta"], cod: "ALFB" },
    { kw: ["sabana", "sabanas", "funda nordica", "nordico", "edredon", "blancos"], cod: "BLNC" },
    { kw: ["butaca", "butacas", "puf", "poof"], cod: "BTCA" },
    { kw: ["cojin", "cojines", "cuadrante", "almohadon", "funda cojin"], cod: "CDRT" },
    { kw: ["colcha", "colchas"], cod: "CLCH" },
    { kw: ["colchon", "colchones", "viscoelastico", "somier"], cod: "CLCN" },
    { kw: ["consumible", "consumibles", "material", "accesorio"], cod: "CNSM" },
    { kw: ["cortina", "cortinas", "visillo", "visillos", "panel japones"], cod: "CORT" },
    { kw: ["cubrecanape", "cubrecanapes", "cubre canape", "cubre sofa"], cod: "CUBC" },
    { kw: ["espuma", "boata", "goma espuma", "foam"], cod: "ESBT" },
    { kw: ["estor", "estores", "blackout", "black out", "screen", "enrollable"], cod: "ESTR" },
    { kw: ["funda sofa", "funda de sofa", "funda butaca", "funda silla", "funda cojin"], cod: "FUND" },
    { kw: ["herramienta", "herramientas", "utensilio", "util"], cod: "HERR" },
    { kw: ["herraje", "herrajes", "bisagra", "perno", "tornillo", "grapas"], cod: "HRRJ" },
    { kw: ["toalla", "toallas", "albornoz", "lenceria", "sabana bano"], cod: "LNCR" },
    { kw: ["madera", "listones", "tabla madera", "tablero", "dm", "contrachapado"], cod: "MADR" },
    // MLBR: mesas, muebles, mobiliario — IMPORTANTE: antes de SLLA/SOFA
    {
      kw: ["mesa", "mesas", "mueble", "muebles", "mobiliario", "aparador", "armario",
        "estanteria", "libreria", "aparador", "comoda", "mesita", "escritorio"], cod: "MLBR"
    },
    { kw: ["mano de obra", "instalacion", "montaje", "labor"], cod: "MNOB" },
    { kw: ["mantel", "manteles", "manteleria", "individual", "bajoplato", "camino de mesa"], cod: "MNTL" },
    { kw: ["material oficina", "papeleria", "cartucho", "tinta"], cod: "MTOF" },
    { kw: ["pavimento", "pavimentos", "suelo", "tarima", "parquet", "baldosa", "ceramica"], cod: "PAVB" },
    { kw: ["plaid", "plaids", "manta sofa", "mantita"], cod: "PLAD" },
    { kw: ["rodapie", "rodapies", "zocalo"], cod: "RDAP" },
    { kw: ["relleno", "rellenos", "fibra", "guata", "almohada", "almohadas"], cod: "RELLE" },
    { kw: ["riel", "rieles", "barra cortina", "barras cortina", "soporte cortina", "anilla"], cod: "RIBA" },
    { kw: ["revestimiento", "papel pared", "vinilo", "papel pintado", "tapiz pared"], cod: "RVST" },
    { kw: ["silla", "sillas", "banqueta", "banquetas", "taburete", "taburetes"], cod: "SLLA" },
    { kw: ["sofa", "sofas", "modulo", "rinconera", "chaise", "chaiselongue", "reclinable"], cod: "SOFA" },
    { kw: ["sombra", "sombrilla", "toldo", "parasol", "vela sombra"], cod: "SOMB" },
    { kw: ["tela", "tejido", "textil", "metros", "metro lineal", "metraje", "rollo"], cod: "TELA" },
  ],

  // ── TIPOS ────────────────────────────────────────────────────────────────────
  tipos: [
    // ALFB
    { kw: ["felpudo"], cod: "FLP", fam: "ALFB" },
    { kw: ["alfombra", "alfombras", "moqueta"], cod: "ALF", fam: "ALFB" },
    // BLNC
    { kw: ["sabana", "sabanas"], cod: "SAB", fam: "BLNC" },
    { kw: ["edredon", "edredones", "nordico", "funda nordica"], cod: "EDR", fam: "BLNC" },
    { kw: ["manta", "mantas"], cod: "MAN", fam: "BLNC" },
    // BTCA
    { kw: ["puf", "poof", "poff", "pouffe"], cod: "POF", fam: "BTCA" },
    { kw: ["butaca", "butacas"], cod: "BUT", fam: "BTCA" },
    // CDRT
    { kw: ["cuadrante"], cod: "QUAD", fam: "CDRT" },
    { kw: ["cojin", "cojines", "almohadon decorativo", "funda cojin"], cod: "CJ", fam: "CDRT" },
    // CLCH
    { kw: ["edredon", "nordico"], cod: "EDR", fam: "CLCH" },
    { kw: ["colcha", "colchas"], cod: "COL", fam: "CLCH" },
    // CLCN
    { kw: ["viscoelastico", "viscoelastica", "visco", "memory"], cod: "VIS", fam: "CLCN" },
    { kw: ["colchon", "colchones"], cod: "CLN", fam: "CLCN" },
    // CORT
    { kw: ["panel japones", "panel corredor"], cod: "PAN", fam: "CORT" },
    { kw: ["visillo", "visillos"], cod: "VSL", fam: "CORT" },
    { kw: ["cortina", "cortinas"], cod: "CRT", fam: "CORT" },
    // ESTR
    { kw: ["blackout", "black out"], cod: "BLK", fam: "ESTR" },
    { kw: ["estor", "estores", "enrollable", "screen"], cod: "EST", fam: "ESTR" },
    // FUND
    { kw: ["funda sofa", "funda de sofa"], cod: "FNS", fam: "FUND" },
    { kw: ["funda cojin", "funda de cojin"], cod: "FNC", fam: "FUND" },
    { kw: ["funda butaca"], cod: "FNB", fam: "FUND" },
    { kw: ["funda silla"], cod: "FNS", fam: "FUND" },
    // LNCR
    { kw: ["albornoz", "albornoces"], cod: "ALB", fam: "LNCR" },
    { kw: ["toalla", "toallas"], cod: "TOA", fam: "LNCR" },
    // MLBR — mesas y muebles
    { kw: ["mesa comedor", "mesa dining"], cod: "MSC", fam: "MLBR" },
    { kw: ["mesita", "mesita noche", "mesita auxiliar"], cod: "MSN", fam: "MLBR" },
    { kw: ["mesa", "mesas"], cod: "MES", fam: "MLBR" },
    { kw: ["aparador", "comoda", "armario", "estanteria"], cod: "MUB", fam: "MLBR" },
    { kw: ["mueble", "muebles", "mobiliario"], cod: "MBL", fam: "MLBR" },
    // MNTL
    { kw: ["servilleta", "servilletas"], cod: "SRV", fam: "MNTL" },
    { kw: ["individual", "bajoplato"], cod: "IND", fam: "MNTL" },
    { kw: ["camino de mesa", "camino mesa"], cod: "CAM", fam: "MNTL" },
    { kw: ["mantel", "manteles"], cod: "MNT", fam: "MNTL" },
    // PLAD
    { kw: ["plaid", "plaids", "manta sofa"], cod: "PLD", fam: "PLAD" },
    // RELLE
    { kw: ["fibra", "guata"], cod: "FBR", fam: "RELLE" },
    { kw: ["relleno", "rellenos", "almohada", "almohadas"], cod: "RLL", fam: "RELLE" },
    // RVST
    { kw: ["vinilo"], cod: "VNL", fam: "RVST" },
    { kw: ["papel pared", "papel pintado", "tapiz"], cod: "PAP", fam: "RVST" },
    // SLLA
    { kw: ["taburete", "taburetes"], cod: "TAB", fam: "SLLA" },
    { kw: ["banqueta", "banquetas"], cod: "BNQ", fam: "SLLA" },
    { kw: ["silla", "sillas"], cod: "SLL", fam: "SLLA" },
    // SOFA
    { kw: ["chaise", "chaiselongue", "chaise longue"], cod: "CHI", fam: "SOFA" },
    { kw: ["reclinable", "relax", "butaca relax"], cod: "REC", fam: "SOFA" },
    { kw: ["rinconera", "esquinero"], cod: "RNC", fam: "SOFA" },
    { kw: ["modulo", "modulos", "sofa modular", "sofa", "sofas"], cod: "MOD", fam: "SOFA" },
    // TELA
    { kw: ["coleccion textil", "coleccion", "cmr"], cod: "CMR", fam: "TELA" },
    { kw: ["metro", "metros", "metro lineal", "metraje", "rollo"], cod: "MTS", fam: "TELA" },
  ],

  // ── VARIANTES ────────────────────────────────────────────────────────────────
  variantes: [
    { kw: ["cerrado", "cerrada", "cierre", "cremallera"], cod: "CER" },
    { kw: ["pasamaneria", "pasaman", "flecos", "franja"], cod: "PAS" },
    { kw: ["vivo", "ribete", "ribeteado"], cod: "VIV" },
    { kw: ["petaca"], cod: "PET" },
    { kw: ["bordado", "bordada"], cod: "BOR" },
    { kw: ["liso", "lisa", "unicolor"], cod: "LIS" },
    { kw: ["estampado", "estampada", "impreso", "print"], cod: "EST" },
    { kw: ["abierto", "abierta", "sin cierre"], cod: "ABT" },
    { kw: ["flecos"], cod: "FLE" },
  ],
};


// ─── ALGORITMO DE CONTRACCIÓN (AUTO-GENERATOR) ────────────────────────────────
function generateTypeCode(word) {
  if (!word) return null;
  const w = word.toUpperCase().replace(/[^A-Z]/g, '');
  if (w.length <= 3) return w.padEnd(3, 'X');
  // Tomar la primera letra, y luego extraer las siguientes 2 consonantes
  const first = w[0];
  const consonants = w.slice(1).replace(/[AEIOU]/g, '');
  return (first + consonants).padEnd(3, 'X').slice(0, 3);
}

function analyzeText(text) {
  const r = { familia: null, tipo: null, variante: null, ancho: null, alto: null, manualTypeGen: null };
  if (!text || text.trim().length < 2) return r;

  const tNorm = norm(text);

  // --- MOTOR DE REGLAS DE NEGOCIO (SEMÁNTICO) ---
  if (tNorm.includes("tapizado") || tNorm.includes("tapizar")) {
    r.familia = "MOTP";
    if (tNorm.includes("sofa")) r.tipo = "SOFA";
    else if (tNorm.includes("silla")) r.tipo = "SLL";
    else if (tNorm.includes("butaca")) r.tipo = "BUT";

    // Buscar cantidad de plazas
    let plazas = "";
    if (tNorm.includes("un plaza") || tNorm.includes("una plaza") || tNorm.includes("1")) plazas = "1";
    if (tNorm.includes("dos plaza") || tNorm.includes("2")) plazas = "2";
    if (tNorm.includes("tres plaza") || tNorm.includes("3")) plazas = "3";
    if (tNorm.includes("cuatro plaza") || tNorm.includes("4")) plazas = "4";

    // Buscar complejidad
    let compl = "";
    if (tNorm.includes("complejo") || tNorm.includes("capitone")) compl = "C";
    else if (tNorm.includes("sencillo") || tNorm.includes("basico")) compl = "S";

    if (plazas || compl) {
      r.variante = plazas + compl;
      if (!r.tipo) {
        let familyKeywords = KW.familias.find(f => f.cod === r.familia)?.kw || [];
        const words = tNorm.replace("tapizado de ", "").split(/[\s,]+/);
        const firstWordRaw = words.find(w => {
          const nw = norm(w);
          return nw.length > 2 && !familyKeywords.some(k => norm(k).includes(nw));
        });
        const firstWord = firstWordRaw ? norm(firstWordRaw) : norm(words[0]);

        if (firstWord && firstWord.length > 2) {
          r.manualTypeGen = generateTypeCode(firstWord);
          r.tipo = r.manualTypeGen;
        }
      }
      return r;
    }
  }
  // ----------------------------------------------

  for (const f of KW.familias)
    if (hasWord(text, f.kw) || hasSub(text, f.kw)) { r.familia = f.cod; break; }

  for (const t of KW.tipos)
    if (hasWord(text, t.kw) || hasSub(text, t.kw)) { r.tipo = t.cod; break; }

  for (const v of KW.variantes)
    if (hasWord(text, v.kw) || hasSub(text, v.kw)) { r.variante = v.cod; break; }

  // Acepta: 40x60, 40X60, 40 x 60, 150x100, 40*60
  const sm = text.match(/(\d{1,3})\s*[xX\u00d7*]\s*(\d{1,3})/);
  if (sm) { r.ancho = sm[1]; r.alto = sm[2]; }

  // Si encontró familia pero no tipo, intentamos auto-generar un tipo evitando palabras de la familia
  if (r.familia && !r.tipo) {
    let familyKeywords = KW.familias.find(f => f.cod === r.familia)?.kw || [];
    const words = text.split(/[\s,]+/);
    const firstWordRaw = words.find(w => {
      const nw = norm(w);
      return nw.length > 2 && !familyKeywords.some(k => norm(k).includes(nw));
    });
    const firstWord = firstWordRaw ? norm(firstWordRaw) : norm(words[0]);

    if (firstWord && firstWord.length > 2) {
      r.manualTypeGen = generateTypeCode(firstWord);
      r.tipo = r.manualTypeGen; // Se asigna temporalmente para que visualmente haya código
    }
  }

  return r;
}

// idTipo dinamico: decide el modo segun lo que haya detectado/escrito el usuario
function resolveIdTipo(tipoObj, anchoVal, altoVal, varianteVal, tieneModelo) {
  if (!tipoObj) return "variante";
  const modos = Array.isArray(tipoObj.idTipo) ? tipoObj.idTipo : [tipoObj.idTipo];
  if (anchoVal && altoVal && modos.includes("tamano")) return "tamano";
  if (tieneModelo && modos.includes("modelo")) return "modelo";
  if (varianteVal && modos.includes("variante")) return "variante";
  return modos[0];
}

// ─── DECODIFICADOR ────────────────────────────────────────────────────────────
function decodeRef(ref) {
  const u = ref.toUpperCase().replace(/\s/g, "");
  // Buscar familia por codigo (de mas largo a mas corto para evitar conflictos)
  const sortedFam = [...FAMILIAS].sort((a, b) => b.codigo.length - a.codigo.length);
  const fam = sortedFam.find((f) => u.startsWith(f.codigo));
  if (!fam) return null;
  const r1 = u.slice(fam.codigo.length);
  let tipo = null, tc = "";
  const sortedTipos = [...TIPOS].sort((a, b) => b.codigo.length - a.codigo.length);
  for (const t of sortedTipos) {
    if (r1.startsWith(t.codigo) && t.familia === fam.codigo) { tipo = t; tc = t.codigo; break; }
  }

  // Si no hay tipo registrado en la familia, pero hay unas letras que parecen tipo auto-generado
  if (!tipo && /^[A-Z]{2,3}/.test(r1)) {
    tc = r1.match(/^[A-Z]{2,3}/)[0];
    tipo = { codigo: tc, desc: "AUTO", familia: fam.codigo, idTipo: ["tamano", "modelo", "variante"] };
  }

  if (!tipo) return { fam, tipo: null };
  const r2 = r1.slice(tc.length);
  const varMatch = VARIANTES.find((v) => r2 === v.codigo);
  const sizeMatch = /^\d+$/.test(r2) && r2.length >= 2 && r2.length % 2 === 0;
  const half = Math.floor(r2.length / 2);
  return {
    fam, tipo,
    variante: varMatch || null,
    ancho: sizeMatch ? r2.slice(0, half) : null,
    alto: sizeMatch ? r2.slice(half) : null,
    modeloRaw: (!varMatch && !sizeMatch && r2) ? r2 : null,
  };
}

const pad2 = (v) => (v ? String(v).padStart(2, "0") : "");

function buildRef(familia, tipo, variante, ancho, alto, coleccion, modelo, color, idTipo) {
  if (!familia || !tipo) return "";
  let id = "";
  if (idTipo === "variante") id = variante || "";
  else if (idTipo === "tamano") id = ancho && alto ? pad2(ancho) + pad2(alto) : "";
  else if (idTipo === "modelo") id = (coleccion || "") + (modelo || "") + (color || "");
  return (familia + tipo + id).toUpperCase();
}

// ─── DEMO DB ──────────────────────────────────────────────────────────────────
const DEMO = [
  { id: "1", ref: "CDRTCJCER", desc: "COJIN CERRADO", familia: "CDRT", tipo: "CJ", variante: "CER", ancho: null, alto: null, fecha: "2024-01-10", user: "admin" },
  { id: "2", ref: "CDRTCJ4060", desc: "COJIN 40x60", familia: "CDRT", tipo: "CJ", variante: null, ancho: "40", alto: "60", fecha: "2024-01-15", user: "admin" },
  { id: "3", ref: "SLLASLL6060", desc: "SILLA 60x60", familia: "SLLA", tipo: "SLL", variante: null, ancho: "60", alto: "60", fecha: "2024-02-01", user: "diseno" },
  { id: "4", ref: "SOFAMODCER", desc: "SOFA MODULO CERRADO", familia: "SOFA", tipo: "MOD", variante: "CER", ancho: null, alto: null, fecha: "2024-02-10", user: "admin" },
  { id: "5", ref: "ESTRESTBK", desc: "ESTOR BLACKOUT", familia: "ESTR", tipo: "BLK", variante: null, ancho: null, alto: null, fecha: "2024-03-05", user: "ventas" },
];

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0f0f0f;--s1:#161616;--s2:#1e1e1e;
  --br:#2a2a2a;--br2:#333;
  --acc:#f0c040;--acc2:#e8a820;
  --red:#e05252;--green:#52c97e;--blue:#5290e0;
  --tx:#e8e8e8;--tx2:#999;--tx3:#555;
  --mono:'IBM Plex Mono',monospace;
  --sans:'IBM Plex Sans',sans-serif;
}
body{background:var(--bg);color:var(--tx);font-family:var(--sans);min-height:100vh}
::selection{background:var(--acc);color:#000}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:var(--s1)}
::-webkit-scrollbar-thumb{background:var(--br2);border-radius:2px}
.app{display:flex;flex-direction:column;min-height:100vh}
.hdr{background:var(--s1);border-bottom:1px solid var(--br);padding:0 24px;height:54px;
  display:flex;align-items:center;gap:24px;position:sticky;top:0;z-index:100}
.hdr-logo{font-family:var(--mono);font-size:13px;font-weight:700;letter-spacing:.1em;
  color:var(--acc);display:flex;align-items:center;gap:8px}
.hdr-dot{width:7px;height:7px;background:var(--acc);border-radius:50%}
.nav{display:flex;gap:2px}
.nav-btn{background:none;border:none;padding:6px 14px;font-family:var(--mono);font-size:11px;
  font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--tx2);
  cursor:pointer;border-radius:4px;transition:all .15s}
.nav-btn:hover{color:var(--tx);background:var(--s2)}
.nav-btn.on{color:var(--acc);background:rgba(240,192,64,.08)}
.hdr-meta{font-family:var(--mono);font-size:10px;color:var(--tx3);margin-left:auto}
.hdr-meta span{color:var(--tx2)}
.main{flex:1;padding:28px 24px;max-width:1040px;margin:0 auto;width:100%}
.stitle{font-family:var(--mono);font-size:10px;font-weight:600;letter-spacing:.15em;
  text-transform:uppercase;color:var(--tx3);margin-bottom:20px;
  display:flex;align-items:center;gap:10px}
.stitle::after{content:'';flex:1;height:1px;background:var(--br)}
.card{background:var(--s1);border:1px solid var(--br);border-radius:6px;padding:20px}
.big-area{width:100%;background:var(--s2);border:1px solid var(--br2);border-radius:6px;
  padding:14px 16px;font-family:var(--sans);font-size:15px;font-weight:500;color:var(--tx);
  outline:none;resize:none;line-height:1.5;transition:border-color .15s;min-height:76px}
.big-area::placeholder{color:var(--tx3);font-size:13px}
.big-area:focus{border-color:var(--acc)}
.area-hint{font-family:var(--mono);font-size:10px;color:var(--tx3);margin-top:6px}
.area-hint.code{color:rgba(240,192,64,.6)}
.ref-box{background:var(--bg);border:1px solid var(--br);border-left:3px solid var(--acc);
  border-radius:4px;padding:16px 20px;margin:16px 0;
  display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
.ref-box.over{border-left-color:var(--red)}
.ref-box.dup{border-left-color:#ffb300}
.rp-left{flex:1}
.rp-lbl{font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;
  color:var(--tx3);margin-bottom:6px}
.rp-code{font-family:var(--mono);font-size:26px;font-weight:700;letter-spacing:.05em;
  color:var(--acc);line-height:1;word-break:break-all}
.rp-code.over{color:var(--red)}
.rp-code.dup{color:#ffb300}
.rp-segs{display:flex;gap:5px;margin-top:8px;flex-wrap:wrap}
.seg{padding:3px 9px;border-radius:3px;font-family:var(--mono);font-size:11px;font-weight:600}
.seg-f{background:rgba(240,192,64,.12);color:var(--acc);border:1px solid rgba(240,192,64,.3)}
.seg-t{background:rgba(82,201,126,.12);color:var(--green);border:1px solid rgba(82,201,126,.3)}
.seg-i{background:rgba(82,144,224,.12);color:var(--blue);border:1px solid rgba(82,144,224,.3)}
.rp-right{text-align:right;flex-shrink:0}
.rp-len{font-family:var(--mono);font-size:24px;font-weight:700;color:var(--tx2)}
.rp-len.ok{color:var(--acc)}
.rp-len.over{color:var(--red)}
.rp-sub{font-family:var(--mono);font-size:9px;color:var(--tx3);letter-spacing:.06em;margin-top:2px}
.sec-lbl{font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;
  color:var(--tx3);margin-bottom:8px;margin-top:20px}
.chip-row{display:flex;flex-wrap:wrap;gap:6px}
.chip{padding:6px 12px;border-radius:5px;border:1px solid var(--br2);background:var(--s2);
  font-family:var(--mono);font-size:11px;font-weight:600;color:var(--tx2);cursor:pointer;
  transition:all .12s;display:flex;align-items:center;gap:5px}
.chip:hover{border-color:var(--acc);color:var(--acc)}
.chip.on{background:rgba(240,192,64,.1);border-color:var(--acc);color:var(--acc)}
.chip-sub{font-weight:400;font-size:9px;opacity:.5}
.size-row{display:flex;align-items:flex-end;gap:10px;flex-wrap:wrap;margin-top:6px}
.size-field{display:flex;flex-direction:column;gap:5px}
.size-lbl{font-family:var(--mono);font-size:10px;letter-spacing:.1em;color:var(--tx3);text-transform:uppercase}
.size-in{width:78px;background:var(--s2);border:1px solid var(--br2);border-radius:5px;
  padding:9px 10px;font-family:var(--mono);font-size:16px;font-weight:700;color:var(--acc);
  outline:none;text-align:center;transition:border-color .15s}
.size-in:focus{border-color:var(--acc)}
.size-x{font-family:var(--mono);font-size:16px;color:var(--tx3);padding-bottom:9px}
.size-preview{font-family:var(--mono);font-size:12px;color:var(--green);padding-bottom:9px}
.mod-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px}
.mod-field{display:flex;flex-direction:column;gap:5px}
.mod-lbl{font-family:var(--mono);font-size:10px;letter-spacing:.1em;color:var(--tx3);text-transform:uppercase}
.mod-in{background:var(--s2);border:1px solid var(--br2);border-radius:5px;
  padding:8px 10px;font-family:var(--mono);font-size:13px;font-weight:700;color:var(--acc);
  outline:none;text-transform:uppercase;transition:border-color .15s}
.mod-in:focus{border-color:var(--acc)}
.alert{padding:9px 13px;border-radius:5px;font-family:var(--mono);font-size:11px;
  display:flex;align-items:center;gap:8px;margin-bottom:10px;letter-spacing:.02em}
.a-ok{background:rgba(82,201,126,.08);border:1px solid rgba(82,201,126,.25);color:var(--green)}
.a-w{background:rgba(255,179,0,.08);border:1px solid rgba(255,179,0,.3);color:#ffb300}
.a-e{background:rgba(224,82,82,.08);border:1px solid rgba(224,82,82,.25);color:var(--red)}
.switch-btn{margin-top:10px;background:none;border:1px solid var(--br2);color:var(--tx3);
  font-family:var(--mono);font-size:10px;padding:5px 12px;border-radius:4px;cursor:pointer;
  transition:all .14s;letter-spacing:.05em;text-transform:uppercase}
.switch-btn:hover{border-color:var(--tx2);color:var(--tx2)}
.btn-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:22px}
.btn{display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:5px;
  border:none;font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:.08em;
  text-transform:uppercase;cursor:pointer;transition:all .14s}
.btn-p{background:var(--acc);color:#000}
.btn-p:hover:not(:disabled){background:var(--acc2);transform:translateY(-1px)}
.btn-p:disabled{opacity:.3;cursor:not-allowed}
.btn-g{background:none;border:1px solid var(--br2);color:var(--tx2)}
.btn-g:hover{border-color:var(--tx2);color:var(--tx)}
.divider{height:1px;background:var(--br);margin:22px 0}
.sim-row{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.sim-chip{padding:5px 11px;border-radius:4px;background:var(--s2);border:1px solid var(--br2);
  font-family:var(--mono);font-size:11px;color:var(--tx2);cursor:pointer;transition:all .14s}
.sim-chip:hover{border-color:var(--acc);color:var(--acc)}
.stats-row{display:flex;gap:8px;margin-bottom:22px;flex-wrap:wrap}
.stat{flex:1;min-width:80px;background:var(--s1);border:1px solid var(--br);border-radius:6px;
  padding:12px 14px;cursor:pointer;transition:border-color .15s}
.stat:hover{border-color:var(--br2)}
.stat.on{border-color:var(--acc)}
.stat-n{font-family:var(--mono);font-size:20px;font-weight:700;color:var(--acc)}
.stat-l{font-family:var(--mono);font-size:9px;letter-spacing:.1em;text-transform:uppercase;
  color:var(--tx3);margin-top:3px}
.search-row{display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap}
.search-in{flex:1;min-width:160px;background:var(--s1);border:1px solid var(--br2);
  border-radius:5px;padding:8px 13px;font-family:var(--mono);font-size:12px;color:var(--tx);
  outline:none;transition:border-color .15s}
.search-in:focus{border-color:var(--acc)}
.search-sel{background:var(--s1);border:1px solid var(--br2);border-radius:5px;
  padding:8px 12px;font-family:var(--mono);font-size:12px;color:var(--tx);
  outline:none;appearance:none;min-width:140px}
.h-list{display:flex;flex-direction:column;gap:5px}
.h-row{display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--s1);
  border:1px solid var(--br);border-radius:6px;cursor:pointer;transition:border-color .15s;flex-wrap:wrap}
.h-row:hover{border-color:var(--acc)}
.h-ref{font-family:var(--mono);font-size:13px;font-weight:700;color:var(--acc);min-width:130px}
.h-desc{flex:1;font-size:12px;color:var(--tx2);min-width:100px}
.h-tags{display:flex;gap:4px}
.h-date{font-family:var(--mono);font-size:9px;color:var(--tx3);flex-shrink:0}
.h-use{font-family:var(--mono);font-size:9px;font-weight:700;letter-spacing:.07em;
  padding:4px 10px;border-radius:4px;background:rgba(240,192,64,.08);
  border:1px solid rgba(240,192,64,.2);color:var(--acc);cursor:pointer;
  flex-shrink:0;transition:all .14s;white-space:nowrap}
.h-use:hover{background:var(--acc);color:#000}
.empty{text-align:center;padding:40px 20px;font-family:var(--mono);font-size:11px;color:var(--tx3)}
.foot{font-family:var(--mono);font-size:9px;color:var(--tx3);text-align:right;margin-top:10px}
`;

// ─── MAIN HUB (CONTROL PANEL) ─────────────────────────────────────────────────
function MainHub() {
  const { user, role, logout } = useAuth();

  return (
    <div className="app">
      <header className="header">
        <div className="h-l">
          <div className="logo">ERP HUB</div>
        </div>
        <div className="nav">
          <div className="nav-i" style={{ color: 'var(--tx3)' }}>
            User: {user?.email} ({role})
          </div>
          <button className="nav-i" onClick={logout} style={{ border: '1px solid var(--br)', marginLeft: 10 }}>
            SALIR
          </button>
        </div>
      </header>

      <div style={{ marginTop: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 300, color: 'var(--tx)' }}>Panel de Control Principal</h1>
        <p style={{ color: 'var(--tx2)', marginTop: 5 }}>Selecciona un módulo al que tengas acceso.</p>
      </div>

      <div className="hub-grid">
        <Link to="/nombres" className="hub-card">
          <div className="hub-icon">🏷️</div>
          <div className="hub-title">Generador de Nombres</div>
          <div className="hub-desc">Crea y estandariza referencias de artículos para el catálogo ERP.</div>
        </Link>

        <div className="hub-card disabled" title="Próximamente">
          <div className="hub-icon">📚</div>
          <div className="hub-title">Manuales e IA (RAG)</div>
          <div className="hub-desc">Asistente de IA para consultar manuales técnicos. (En desarrollo)</div>
        </div>

        {role === 'admin' && (
          <Link to="#" className="hub-card" style={{ borderColor: 'var(--acc2)' }}>
            <div className="hub-icon" style={{ color: 'var(--acc2)' }}>🛡️</div>
            <div className="hub-title">Administración</div>
            <div className="hub-desc">Gestiona usuarios, roles y auditoría del sistema de la empresa.</div>
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── APP ROUTER ───────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainHub />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nombres"
        element={
          <ProtectedRoute>
            <GeneradorNombres />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

// ─── MODULO GENERADOR DE NOMBRES ERP ──────────────────────────────────────────
function GeneradorNombres() {
  const [tab, setTab] = useState("crear");
  const [db, setDb] = useState(DEMO);
  function addArt(a) { setDb((p) => [a, ...p]); }
  function loadArt(a) { setTab("crear"); setTimeout(() => window.dispatchEvent(new CustomEvent("__load", { detail: a })), 40); }
  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <header className="hdr">
          <div className="hdr-logo"><div className="hdr-dot" />REFGEN</div>
          <nav className="nav">
            <button className={`nav-btn${tab === "crear" ? " on" : ""} `} onClick={() => setTab("crear")}>Crear / Editar</button>
            <button className={`nav - btn${tab === "hist" ? " on" : ""} `} onClick={() => setTab("hist")}>Historial</button>
            <Link to="/" className="nav-btn" style={{ borderLeft: '1px solid var(--br)', borderRadius: 0, paddingLeft: 15, marginLeft: 5 }}>
              ← VOLVER AL HUB
            </Link>
          </nav>
          <div className="hdr-meta">BASE <span>{db.length}</span> refs</div>
        </header>
        <main className="main">
          {tab === "crear" && <ViewCrear db={db} addArt={addArt} />}
          {tab === "hist" && <ViewHist db={db} loadArt={loadArt} />}
        </main>
      </div>
    </>
  );
}

// ─── VIEW CREAR ───────────────────────────────────────────────────────────────
function ViewCrear({ db, addArt }) {
  const [text, setText] = useState("");
  const [familia, setFamilia] = useState("");
  const [tipo, setTipo] = useState("");
  const [variante, setVariante] = useState("");
  const [ancho, setAncho] = useState("");
  const [alto, setAlto] = useState("");
  const [coleccion, setColeccion] = useState("");
  const [modelo, setModelo] = useState("");
  const [color, setColor] = useState("");
  const [saved, setSaved] = useState(false);
  const ref_ = useRef();

  useEffect(() => {
    const h = (e) => {
      const a = e.detail;
      setText(a.desc || ""); setFamilia(a.familia || ""); setTipo(a.tipo || "");
      setVariante(a.variante || ""); setAncho(a.ancho || ""); setAlto(a.alto || "");
      setColeccion(a.coleccion || ""); setModelo(a.modelo || ""); setColor(a.color || "");
      setSaved(false);
    };
    window.addEventListener("__load", h);
    return () => window.removeEventListener("__load", h);
  }, []);

  const isCode = useMemo(() => {
    const u = text.trim().toUpperCase();
    const sorted = [...FAMILIAS].sort((a, b) => b.codigo.length - a.codigo.length);
    return u.length >= 5 && !/\s/.test(u) && sorted.some((f) => u.startsWith(f.codigo));
  }, [text]);

  // UNICO useEffect — sin cadenas ni circulares
  useEffect(() => {
    const raw = text.trim();
    if (raw.length === 0) {
      setFamilia(""); setTipo(""); setVariante("");
      setAncho(""); setAlto(""); setColeccion(""); setModelo(""); setColor("");
      setSaved(false); return;
    }
    if (isCode) {
      const d = decodeRef(raw);
      if (!d) return;
      if (d.fam) setFamilia(d.fam.codigo);
      if (d.tipo) setTipo(d.tipo.codigo);
      if (d.variante) { setVariante(d.variante.codigo); setAncho(""); setAlto(""); setColeccion(""); setModelo(""); setColor(""); }
      else if (d.ancho) { setAncho(d.ancho); setAlto(d.alto || ""); setVariante(""); setColeccion(""); setModelo(""); setColor(""); }
      else if (d.modeloRaw) {
        setAncho(""); setAlto(""); setVariante("");
        setColeccion(d.modeloRaw.slice(0, 5));
        setModelo(d.modeloRaw.slice(5, 9));
        setColor(d.modeloRaw.slice(9, 12));
      }
    } else {
      const a = analyzeText(raw);
      if (a.familia) setFamilia(a.familia);
      if (a.tipo) setTipo(a.tipo);
      if (a.variante) setVariante(a.variante);
      if (a.ancho && a.alto) { setAncho(a.ancho); setAlto(a.alto); }
    }
    setSaved(false);
  }, [text, isCode]);

  // Buscar tipos propios guardados en el historial para esta familia
  const tiposDesdeDB = useMemo(() => {
    if (!familia) return [];
    const existentes = TIPOS.filter(t => t.familia === familia).map(t => t.codigo);
    const m = new Map();
    db.filter(a => a.familia === familia && a.tipo && !existentes.includes(a.tipo))
      .forEach(a => m.set(a.tipo, { codigo: a.tipo, desc: "HIST", familia, idTipo: ["tamano", "modelo", "variante"] }));
    return Array.from(m.values());
  }, [db, familia]);

  // Si el tipo ingresado manualmente no esta en los arrays definidos
  const dummyTipo = tipo ? { codigo: tipo, desc: "LIBRE", familia, idTipo: ["tamano", "modelo", "variante"] } : null;
  const tipoObj = TIPOS.find((t) => t.codigo === tipo && t.familia === familia)
    || tiposDesdeDB.find((t) => t.codigo === tipo)
    || dummyTipo;
  const tiposFamilia = familia ? TIPOS.filter((t) => t.familia === familia) : [];

  // idTipo dinamico — el corazon del fix
  const idTipo = useMemo(
    () => resolveIdTipo(tipoObj, ancho, alto, variante, coleccion || modelo || color),
    [tipoObj, ancho, alto, variante, coleccion, modelo, color]
  );

  const ref = useMemo(
    () => buildRef(familia, tipo, variante, ancho, alto, coleccion, modelo, color, idTipo),
    [familia, tipo, variante, ancho, alto, coleccion, modelo, color, idTipo]
  );

  const refLen = ref.length;
  const isOver = refLen > 15;
  const isDup = db.some((a) => a.ref === ref && ref !== "");
  const refState = isOver ? "over" : isDup ? "dup" : ref ? "ok" : "";
  const canSave = ref && !isOver && !isDup && text.trim() && !saved;

  const tipoModos = tipoObj && Array.isArray(tipoObj.idTipo) ? tipoObj.idTipo : [];

  const similar = useMemo(
    () => db.filter((a) => a.familia === familia && a.tipo === tipo && a.ref !== ref).slice(0, 6),
    [db, familia, tipo, ref]
  );

  function save() {
    if (!canSave) return;
    addArt({
      id: Date.now().toString(), ref, desc: text.trim(), familia, tipo,
      variante: idTipo === "variante" ? variante : null,
      ancho: idTipo === "tamano" ? ancho : null,
      alto: idTipo === "tamano" ? alto : null,
      coleccion: idTipo === "modelo" ? coleccion : null,
      modelo: idTipo === "modelo" ? modelo : null,
      color: idTipo === "modelo" ? color : null,
      fecha: new Date().toISOString().split("T")[0], user: "usuario",
    });
    setSaved(true);
  }

  function reset() {
    setText(""); setFamilia(""); setTipo(""); setVariante("");
    setAncho(""); setAlto(""); setColeccion(""); setModelo(""); setColor("");
    setSaved(false); ref_.current?.focus();
  }

  return (
    <div>
      <div className="stitle">Nuevo artículo</div>
      <div className="card">
        <textarea ref={ref_} className="big-area" rows={3} autoFocus
          placeholder={"Escribe la descripción del artículo…\nEj: cojin 60x60  ·  silla cerrada  ·  estor blackout 120x200  ·  mantel 150x250\nO pega una referencia para modificarla: CDRTCJ4060"}
          value={text} onChange={(e) => { setText(e.target.value); setSaved(false); }} />
        <div className={`area - hint ${isCode ? "code" : ""} `}>
          {isCode ? "Referencia detectada — modifica los campos abajo para crear una variante."
            : "El sistema detecta familia, tipo y medidas automaticamente."}
        </div>
      </div>

      {ref && (
        <div className={`ref - box ${refState} `}>
          <div className="rp-left">
            <div className="rp-lbl">Referencia generada</div>
            <div className={`rp - code ${refState} `}>{ref}</div>
            <div className="rp-segs">
              {familia && <span className="seg seg-f">{familia}</span>}
              {tipo && <span className="seg seg-t">{tipo}</span>}
              {ref.slice(familia.length + tipo.length) &&
                <span className="seg seg-i">{ref.slice(familia.length + tipo.length)}</span>}
            </div>
          </div>
          <div className="rp-right">
            <div className={`rp - len ${refState === "ok" ? "ok" : refState === "over" ? "over" : ""} `}>{refLen}</div>
            <div className="rp-sub">/ 15 CAR.</div>
          </div>
        </div>
      )}

      {isOver && <div className="alert a-e">Supera 15 caracteres ({refLen}). Acorta el identificador.</div>}
      {isDup && !isOver && <div className="alert a-w">{ref} ya existe — cambia un campo para crear variante nueva.</div>}
      {saved && <div className="alert a-ok">Guardada — {ref}</div>}

      <div className="divider" />

      {/* FAMILIA */}
      <div className="sec-lbl">Familia</div>
      <div className="chip-row">
        {FAMILIAS.map((f) => (
          <button key={f.codigo} className={`chip ${familia === f.codigo ? "on" : ""} `}
            onClick={() => { setFamilia(f.codigo); setTipo(""); setVariante(""); setSaved(false); }}>
            {f.codigo} <span className="chip-sub">{f.desc}</span>
          </button>
        ))}
      </div>

      {/* TIPO */}
      {familia && (
        <>
          <div className="sec-lbl">Tipo de producto</div>
          <div className="chip-row">
            {tiposFamilia.map((t) => (
              <button key={t.codigo + t.familia} className={`chip ${tipo === t.codigo ? "on" : ""} `}
                onClick={() => { setTipo(t.codigo); setVariante(""); setSaved(false); }}>
                {t.codigo} <span className="chip-sub">{t.desc}</span>
              </button>
            ))}
            {tiposDesdeDB.map((t) => (
              <button key={t.codigo + "db"} className={`chip ${tipo === t.codigo ? "on" : ""} `} style={{ borderColor: tipo === t.codigo ? "var(--acc)" : "var(--blue)" }}
                onClick={() => { setTipo(t.codigo); setVariante(""); setSaved(false); }}>
                {t.codigo} <span className="chip-sub">HISTORIAL</span>
              </button>
            ))}

            <div className="mod-field" style={{ marginLeft: "auto", flexDirection: "row", alignItems: "center" }}>
              <div className="mod-lbl" style={{ marginTop: 2 }}>LIBRE:</div>
              <input className="mod-in" style={{ width: 70, padding: "5px 10px", borderColor: (!tiposFamilia.find(t => t.codigo === tipo) && !tiposDesdeDB.find(t => t.codigo === tipo)) && tipo ? "var(--acc)" : "var(--br2)" }}
                maxLength={4} placeholder="HRR"
                value={(!tiposFamilia.find(t => t.codigo === tipo) && !tiposDesdeDB.find(t => t.codigo === tipo)) ? tipo : ""}
                onChange={(e) => { setTipo(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')); setVariante(""); setSaved(false); }}
                title="Escribe unas letras para crear un Tipo Libre (Ej: PNL)"
              />
            </div>
          </div>
        </>
      )}

      {/* VARIANTE */}
      {tipo && idTipo === "variante" && (
        <>
          <div className="sec-lbl">Variante</div>
          <div className="chip-row">
            {VARIANTES.map((v) => (
              <button key={v.codigo} className={`chip ${variante === v.codigo ? "on" : ""} `}
                onClick={() => { setVariante(v.codigo); setSaved(false); }}>
                {v.codigo} <span className="chip-sub">{v.desc}</span>
              </button>
            ))}
          </div>
          {tipoModos.includes("tamano") && (
            <button className="switch-btn" onClick={() => { setVariante(""); setAncho(""); setAlto(""); }}>
              Usar tamaño en su lugar
            </button>
          )}
        </>
      )}

      {/* TAMAÑO */}
      {tipo && idTipo === "tamano" && (
        <>
          <div className="sec-lbl">Tamaño (cm)</div>
          <div className="size-row">
            <div className="size-field">
              <div className="size-lbl">Ancho</div>
              <input className="size-in" type="number" min={1} max={999} placeholder="60" value={ancho}
                onChange={(e) => { setAncho(String(e.target.value).slice(0, 3)); setSaved(false); }} />
            </div>
            <div className="size-x">x</div>
            <div className="size-field">
              <div className="size-lbl">Alto</div>
              <input className="size-in" type="number" min={1} max={999} placeholder="60" value={alto}
                onChange={(e) => { setAlto(String(e.target.value).slice(0, 3)); setSaved(false); }} />
            </div>
            {ancho && alto && <div className="size-preview">→ {ancho} × {alto} cm</div>}
          </div>
          {tipoModos.includes("variante") && (
            <button className="switch-btn" onClick={() => { setAncho(""); setAlto(""); setSaved(false); }}>
              Usar variante en su lugar
            </button>
          )}
        </>
      )}

      {/* MODELO TEXTIL */}
      {tipo && idTipo === "modelo" && (
        <>
          <div className="sec-lbl">Modelo textil</div>
          <div className="mod-row">
            <div className="mod-field">
              <div className="mod-lbl">Coleccion (max 5)</div>
              <input className="mod-in" style={{ width: 100 }} maxLength={5} placeholder="CAMER" value={coleccion}
                onChange={(e) => { setColeccion(e.target.value.toUpperCase().slice(0, 5)); setSaved(false); }} />
            </div>
            <div className="mod-field">
              <div className="mod-lbl">Modelo (max 4)</div>
              <input className="mod-in" style={{ width: 82 }} maxLength={4} placeholder="003" value={modelo}
                onChange={(e) => { setModelo(e.target.value.toUpperCase().slice(0, 4)); setSaved(false); }} />
            </div>
            <div className="mod-field">
              <div className="mod-lbl">Color (max 3)</div>
              <input className="mod-in" style={{ width: 72 }} maxLength={3} placeholder="GRI" value={color}
                onChange={(e) => { setColor(e.target.value.toUpperCase().slice(0, 3)); setSaved(false); }} />
            </div>
          </div>
        </>
      )}

      <div className="btn-row">
        {!saved
          ? <><button className="btn btn-p" onClick={save} disabled={!canSave}>Guardar referencia</button>
            <button className="btn btn-g" onClick={reset}>Limpiar</button></>
          : <button className="btn btn-g" onClick={reset}>+ Nueva referencia</button>}
      </div>

      {similar.length > 0 && (
        <>
          <div className="divider" />
          <div className="stitle">Referencias similares</div>
          <div className="sim-row">
            {similar.map((a) => (
              <div key={a.id} className="sim-chip" title={a.desc}
                onClick={() => { setText(a.ref); setSaved(false); }}>{a.ref}</div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── VIEW HISTORIAL ───────────────────────────────────────────────────────────
function ViewHist({ db, loadArt }) {
  const [q, setQ] = useState("");
  const [filt, setFilt] = useState("");

  const rows = useMemo(() => {
    const nq = norm(q);
    return db.filter((a) => {
      const mq = !nq || norm(a.ref).includes(nq) || norm(a.desc).includes(nq);
      const mf = !filt || a.familia === filt;
      return mq && mf;
    });
  }, [db, q, filt]);

  const counts = useMemo(() => {
    const c = {};
    db.forEach((a) => { c[a.familia] = (c[a.familia] || 0) + 1; });
    return c;
  }, [db]);

  return (
    <div>
      <div className="stitle">Historial</div>
      <div className="stats-row">
        <div className={`stat ${!filt ? "on" : ""} `} onClick={() => setFilt("")}>
          <div className="stat-n">{db.length}</div><div className="stat-l">Total</div>
        </div>
        {Object.entries(counts).map(([f, c]) => (
          <div key={f} className={`stat ${filt === f ? "on" : ""} `} onClick={() => setFilt(filt === f ? "" : f)}>
            <div className="stat-n" style={{ fontSize: 16 }}>{c}</div>
            <div className="stat-l">{FAMILIAS.find((x) => x.codigo === f)?.desc || f}</div>
          </div>
        ))}
      </div>
      <div className="search-row">
        <input className="search-in" placeholder="Buscar referencia o descripcion…"
          value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="search-sel" value={filt} onChange={(e) => setFilt(e.target.value)}>
          <option value="">Todas las familias</option>
          {FAMILIAS.map((f) => <option key={f.codigo} value={f.codigo}>{f.codigo} · {f.desc}</option>)}
        </select>
      </div>
      <div className="h-list">
        {rows.length === 0 && <div className="empty">Sin resultados</div>}
        {rows.map((a) => (
          <div key={a.id} className="h-row" onClick={() => loadArt(a)}>
            <div className="h-ref">{a.ref}</div>
            <div className="h-desc">{a.desc}</div>
            <div className="h-tags">
              <span className="seg seg-f" style={{ fontSize: 9 }}>{a.familia}</span>
              <span className="seg seg-t" style={{ fontSize: 9 }}>{a.tipo}</span>
            </div>
            <div className="h-date">{a.fecha}</div>
            <div className="h-use" onClick={(e) => { e.stopPropagation(); loadArt(a); }}>Cargar</div>
          </div>
        ))}
      </div>
      <div className="foot">{rows.length} / {db.length} · Clic en cualquier fila para editarla</div>
    </div>
  );
}