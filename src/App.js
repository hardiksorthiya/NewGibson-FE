import React, {useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useIsAuthenticated } from "@azure/msal-react";


import Dashboard3 from './Pages/Dashboard/index3';

import Layout5 from "./components/Layout5";

import Login from './Pages/Auth/Login';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './assets/css/style.css';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import TranscriptsByWitness from './Pages/MainContent/TranscriptsByWitness';

// ✅ Private route wrapper using MSAL hook
function PrivateRoute({ children }) {
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (inProgress === InteractionStatus.None) {
      setLoading(false);
    }
  }, [inProgress]);

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
<<<<<<< HEAD
=======
        {/* <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/dashboard2" element={<Layout2><Dashboard2 /></Layout2>} /> */}
        <Route path="/dashboard1" element={<Layout4><Dashboard1 /></Layout4>} />
        <Route path="/dashboard2" element={<Layout5><Dashboard2 /></Layout5>} />
        <Route path="/testimony" element={<Layout3>
                <Dashboard3 />
              </Layout3>} />
>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998

        <Route path="/login" element={<Login />} />
        {/* <Route
          path="/testimony"
          element={
            // <PrivateRoute>
              <Layout5>
                <Dashboard3 />
              </Layout5>
            //  </PrivateRoute>
          }
<<<<<<< HEAD
        />
        
        <Route path="*" element={<Navigate to="/testimony" replace />} />
=======
        /> */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998
      </Routes>
    </BrowserRouter>
  );
}

export default App;
