import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Details from "./pages/Details";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="app-container">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<Details />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
        <Footer />
      </div>
    </HashRouter>
  </React.StrictMode>
);