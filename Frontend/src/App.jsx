import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PreventBackForward from './utils/PreventBackForward';
import Navbar from './Components/Navbar/App';
import Home from './Pages/Home/App';
import Dashboard from './Pages/Dashboard/App';
import Audit from './Pages/Audit/App';
import Governance from './Pages/Governance/App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import VideoBackground from './Components/VideoBackground.jsx';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <div className="relative min-h-screen overflow-hidden text-white pt-[8%]">
        <VideoBackground />
        <div className="absolute inset-0 bg-black/20 z-[5] pointer-events-none" />
        <PreventBackForward />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/governance" element={<Governance />} />
        </Routes>
      </div>
    </Router>
  </QueryClientProvider>
);

export default App;