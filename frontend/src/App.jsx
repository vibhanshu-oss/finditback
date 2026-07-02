import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import ResetPassword from './pages/ResetPassword';
import Items from './pages/Items';
import LostItems from './pages/LostItems';
import FoundItems from './pages/FoundItems';
import ItemDetails from './pages/ItemDetails';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
          {/* Header Component */}
          <Navbar />

          {/* Main Router Content */}
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/items" element={<Items />} />
              <Route path="/lost-items" element={<LostItems />} />
              <Route path="/found-items" element={<FoundItems />} />
              <Route path="/items/:id" element={<ItemDetails />} />
              <Route path="/about" element={<About />} />

              {/* Protected Routes */}
              <Route
                path="/add-item"
                element={
                  <ProtectedRoute>
                    <AddItem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-item/:id"
                element={
                  <ProtectedRoute>
                    <EditItem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Footer Component */}
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
