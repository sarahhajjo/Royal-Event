// ─────────────────────────────────────────────────────────────────────────────
// theme.js  —  Single source of truth for all design tokens
// Import this in every component: import { T, typography } from "../shared/theme";
// ─────────────────────────────────────────────────────────────────────────────

// ── Color tokens ──────────────────────────────────────────────────────────────
export const T = {
    // Backgrounds
    pageBg:       "#FAF7F0",   // main page background
    sidebarBg:    "#F5EFE0",   // sidebar background
    headerBg:     "#FDFAF4",   // topbar background
    cardBg:       "#FFFFFF",   // card / paper background
    rowHover:     "#F3EDE0",   // table row hover

    // Borders
    border:       "#E8DFC8",   // general border
    borderLight:  "#E0D5BC",   // sidebar / topbar border
    infoBorder:   "#C8BA90",   // info button border
    inputBorder:  "#C8BA90",   // search input border

    // Gold scale
    gold:         "#8a6f28",   // primary gold (active, buttons, links)
    goldHover:    "#6e5820",   // gold on hover
    goldLabel:    "#A89450",   // section labels, column headers
    goldLight:    "#b09040",   // slightly lighter gold

    // Text
    textPrimary:  "#1C1712",   // main text
    textMuted:    "#7A6F5E",   // secondary / placeholder text

    // Avatar / image
    avatarBg:     "#EDE5CE",   // avatar fallback background
    avatarFilter: "sepia(18%) contrast(1.05)", // editorial photo filter

    // Sidebar active state
    activeBg:     "#EAE0C8",

    // CTA button
    btnText:      "#FFFFFF",
};

// ── Typography tokens ─────────────────────────────────────────────────────────
export const typography = {
    fontFamily:   "'Inter', 'Segoe UI', sans-serif",

    // Page section label  (e.g. "MANAGEMENT SUITE")
    sectionLabel: {
        fontSize:      "0.68rem",
        fontWeight:    700,
        letterSpacing: 2,
        textTransform: "uppercase",
        color:         "#A89450",
    },

    // Page title  (e.g. "User Management")
    pageTitle: {
        fontWeight: 800,
        lineHeight: 1,
    },

    // Column header  (e.g. "PORTRAIT", "IDENTITY")
    colHeader: {
        fontSize:      "0.65rem",
        fontWeight:    600,
        letterSpacing: 1.8,
        textTransform: "uppercase",
        color:         "#A89450",
    },

    // Row primary text
    rowName: {
        fontWeight: 600,
        fontSize:   "1rem",
        lineHeight: 1.25,
    },

    // Row subtitle (role / rep label)
    rowSub: {
        fontSize:      "0.68rem",
        fontWeight:    600,
        letterSpacing: 1.3,
        textTransform: "uppercase",
        color:         "#7A6F5E",
        mt:            0.3,
    },

    // Row contact / email / phone
    rowContact: {
        fontSize:   "0.82rem",
        lineHeight: 1.5,
        color:      "#7A6F5E",
    },

    // Nav item
    navItem: {
        fontSize:  "0.83rem",
    },

    // Brand title in sidebar
    brandTitle: {
        fontWeight: 700,
        fontSize:   "1.1rem",
        lineHeight: 1.2,
    },

    // Brand subtitle in sidebar
    brandSub: {
        fontSize: "0.72rem",
        mt:       0.3,
    },
};

// ── Shared sx presets (reusable MUI sx objects) ───────────────────────────────

/** Standard search TextField sx — outlined variant */
export const searchFieldSx = {
    "& .MuiOutlinedInput-root": {
        bgcolor:      "transparent",
        borderRadius: "8px",
        fontSize:     "0.83rem",
        color:        "#1C1712",
        "& fieldset":                           { borderColor: "#C8BA90" },
        "&:hover fieldset":                     { borderColor: "#8a6f2899" },
        "&.Mui-focused fieldset":               { borderColor: "#8a6f28" },
    },
    "& input::placeholder": {
        color:         "#7A6F5E",
        opacity:       1,
        fontSize:      "0.78rem",
        letterSpacing: 1.2,
    },
};

/** Info icon button sx */
export const infoButtonSx = {
    color:        "#7A6F5E",
    flexShrink:   0,
    width:        30,
    height:       30,
    border:       "1.5px solid #C8BA90",
    borderRadius: "50%",
    "&:hover": { color: "#8a6f28", borderColor: "#8a6f28", bgcolor: "transparent" },
};

/** Avatar shared sx — pass width/height separately */
export const avatarBaseSx = {
    bgcolor:      "#EDE5CE",
    color:        "#8a6f28",
    fontWeight:   800,
    borderRadius: "10px",
    flexShrink:   0,
    border:       "1px solid #E8DFC8",
};

/** Row wrapper sx */
export const rowWrapperSx = {
    display:    "flex",
    alignItems: "center",
    px:         3,
    py:         2.8,
    gap:        2.5,
    transition: "background 0.15s",
    "&:hover":  { bgcolor: "#F3EDE0" },
};