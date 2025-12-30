import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import JsonApp from "./pages/JsonApp";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import OpenSource from "./pages/OpenSource";
import Contributing from "./pages/Contributing";
import ReleaseNotes from "./pages/ReleaseNotes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/app" element={<JsonApp />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/open-source" element={<OpenSource />} />
          <Route path="/contributing" element={<Contributing />} />
          <Route path="/release-notes" element={<ReleaseNotes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
