// Common shared bootstrap: apply persisted settings and wire a11y controls.
import { initSettings, bindA11yControls } from "./settings.js";

initSettings();

document.addEventListener("DOMContentLoaded", () => {
  bindA11yControls();
});
