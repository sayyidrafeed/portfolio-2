export const INTRO_STORAGE_KEY = "rafee:intro-seen";

// Runs before first paint so returning visitors never see the overlay flash. A reload always replays it.
export const INTRO_GATE_SCRIPT = `(function(){try{var n=performance.getEntriesByType("navigation")[0];if((n&&n.type==="reload")||!localStorage.getItem("${INTRO_STORAGE_KEY}")){document.documentElement.setAttribute("data-intro","")}}catch(e){}})();`;
