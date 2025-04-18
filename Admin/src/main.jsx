import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import {MantineProvider} from '@mantine/core'
import '@mantine/tiptap/styles.css';
import "./index.css";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider withNormalizeCSS >
      <App />
    </MantineProvider>
  </StrictMode>
);
