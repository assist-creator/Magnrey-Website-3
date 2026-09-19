import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import "@/App.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import WhyUs from "@/pages/WhyUs";
import Services from "@/pages/Services";
import Framework from "@/pages/Framework";
import CaseStudies from "@/pages/CaseStudies";
import Insights from "@/pages/Insights";
import About from "@/pages/About";
import Contact from "@/pages/Contact";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [pathname]);
  return null;
}

function AppShell() {
  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--paper)] text-[color:var(--ink)]">
      <Header />
      <main className="flex-1">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/why-us" element={<WhyUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/framework" element={<Framework />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#0B132B",
            color: "#FBF8F2",
            border: "1px solid rgba(200,138,88,0.4)",
            fontFamily: "Plus Jakarta Sans, sans-serif",
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
