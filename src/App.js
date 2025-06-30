import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import './App.css';

import { pdfjs } from 'react-pdf';

// Tell PDF.js where the worker file is
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;


function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  return (
    <div className="app-container">
      {session ? (
        <Dashboard session={session} onLogout={() => setSession(null)} />
      ) : (
        <Auth onLogin={setSession} />
      )}
    </div>
  );
}

export default App;
