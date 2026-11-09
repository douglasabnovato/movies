import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";
import { esperarPosterDoEsqueleto } from "./utils/shellPoster";

/* A tela de detalhes só é baixada quando aberta, para aliviar a primeira carga da Home. */
const Details = lazy(() => import("./pages/Details"));

const root = ReactDOM.createRoot(document.getElementById("root"));
/* O React só troca o esqueleto depois que o pôster dele pintou (até 2,5 s): assim ele conta para o LCP (#57). */
esperarPosterDoEsqueleto().then(() =>
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
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<Details />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
          <Footer />
        </div>
      </HashRouter>
    </React.StrictMode>,
  ),
);
