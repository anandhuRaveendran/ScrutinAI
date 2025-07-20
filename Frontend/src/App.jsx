import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PreventBackForward from './utils/PreventBackForward';
import Navbar from './Components/Navbar/App';
import Home from './Pages/Home/App';
import Dashboard from './Pages/Dashboard/App';
import Audit from './Pages/Audit/App';
import Governance from './Pages/Governance/App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
  <Router>
    <div className="min-h-screen bg-[#101828]">
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