import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Labs from "./pages/Labs";
import LabExercise from "./pages/LabExercise";
 import Learn from "./pages/Learn";
 import LearnLesson from "./pages/LearnLesson";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import TutorialChatbox from "./components/TutorialChatbox";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/labs" element={<Labs />} />
          <Route path="/labs/:labId" element={<LabExercise />} />
         <Route path="/learn" element={<Learn />} />
           <Route path="/learn/:topicId" element={<LearnLesson />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <TutorialChatbox />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
