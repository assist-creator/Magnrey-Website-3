import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import "@/App.css";

import { AuthProvider } from "@/context/AuthContext";
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

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout, { AdminGuard } from "@/pages/admin/AdminLayout";
import AdminOverview from "@/pages/admin/AdminOverview";
import AdminLeads from "@/pages/admin/AdminLeads";
import AdminNewsletter from "@/pages/admin/AdminNewsletter";
import AdminInsights from "@/pages/admin/AdminInsights";
import AdminCaseStudies from "@/pages/admin/AdminCaseStudies";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [pathname]);
  return null;
}

function PublicShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--paper)] text-[color:var(--ink)]">
      <Header />
      <main className="flex-1"><ScrollToTop />{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Admin routes (no public chrome) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={<AdminGuard><AdminLayout /></AdminGuard>}
          >
            <Route index element={<AdminOverview />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="newsletter" element={<AdminNewsletter />} />
            <Route path="insights" element={<AdminInsights />} />
            <Route path="case-studies" element={<AdminCaseStudies />} />
          </Route>

          {/* Public marketing routes */}
          <Route path="/" element={<PublicShell><Home /></PublicShell>} />
          <Route path="/why-us" element={<PublicShell><WhyUs /></PublicShell>} />
          <Route path="/services" element={<PublicShell><Services /></PublicShell>} />
          <Route path="/framework" element={<PublicShell><Framework /></PublicShell>} />
          <Route path="/case-studies" element={<PublicShell><CaseStudies /></PublicShell>} />
          <Route path="/insights" element={<PublicShell><Insights /></PublicShell>} />
          <Route path="/about" element={<PublicShell><About /></PublicShell>} />
          <Route path="/contact" element={<PublicShell><Contact /></PublicShell>} />
          <Route path="*" element={<PublicShell><Home /></PublicShell>} />
        </Routes>
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
      </AuthProvider>
    </BrowserRouter>
  );
}
