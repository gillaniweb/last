import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Disable zoom on mobile devices - using plain JS since we're outside a React component
const metaViewport = document.querySelector('meta[name=viewport]');
if (metaViewport) {
  metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
}

createRoot(document.getElementById("root")!).render(<App />);
