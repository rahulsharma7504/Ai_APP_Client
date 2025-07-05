import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import AdminDashboard from './components/admin/Dashboard/AdminDashboard';
import AuthService from './services/AuthService';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ChatPage from './components/user/ChatPage/ChatPage'
import ChatWithPdfs from './components/user/ChatWithPdfs/ChatWithPdfs'

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import ImageGenerator from './components/user/ImageGenerator/ImageGenerator';
import TextToSpeech from './components/user/TextToSpeech/TextToSpeech';
import SpeechToText from './components/user/SpeechToText/SpeechToText';
import ImageRecognition from './components/user/ImageRecognition/ImageRecognition';
import SinglePDFChat from './components/user/SinglePDFChat/SinglePDFChat';
import MultiplePDFChat from './components/user/MultiplePDFChat/MultiplePDFChat';

// Unprotected Route
const UnProtectedRoute = ({ element: Element }) => {
  const isAuthenticated = AuthService.isLoggedIn();
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Element/>;
}

// Common Protected Route (only for logged-in users)
const ProtectedRoute = ({ element: Element }) => {
  const isAuthenticated = AuthService.isLoggedIn();
  return isAuthenticated ? <Element/> : <Navigate to="/login" />;
}

// Protected Route for Admins only
const AdminRoute = ({ element: Element }) => {
  const isAuthenticated = AuthService.isLoggedIn();
  const user = AuthService.getUserData();
  
  return isAuthenticated && user?.is_admin 
    ? <Outlet /> 
    : <Navigate to="/dashboard" />;
};

// Protected Route for Users only
const UserRoute = ({ element: Element }) => {
  const isAuthenticated = AuthService.isLoggedIn();
  const user = AuthService.getUserData();

  return isAuthenticated && !user?.is_admin 
    ? <Element /> 
    : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Unprotected Routes */}
        <Route path='/' element={ <Navigate to="/login" /> } />
        <Route path='/login' element={ <UnProtectedRoute element={ Login } /> } />
        <Route path='/register' element={ <UnProtectedRoute element={ Register } /> } />
        <Route path='/forgot-password' element={ <UnProtectedRoute element={ ForgotPassword } /> } />

        {/* Protected Common route for admin & User */}
        <Route path='/dashboard' element={ <ProtectedRoute element={ Dashboard }/> } />
        <Route path='/chat/:id' element={ <ProtectedRoute element={ ChatPage }/> } />
        <Route path='/text-to-image/:id' element={ <ProtectedRoute element={ ImageGenerator }/> } />
        <Route path='/text-to-speech' element={ <ProtectedRoute element={ TextToSpeech }/> } />
        <Route path='/speech-to-text' element={ <ProtectedRoute element={ SpeechToText }/> } />
        <Route path='/image-recognition' element={ <ProtectedRoute element={ ImageRecognition }/> } />
        <Route path='/single-pdf-chat' element={ <ProtectedRoute element={ SinglePDFChat }/> } />
        <Route path='/multiple-pdf-chat' element={ <ProtectedRoute element={ MultiplePDFChat }/> } />
        <Route path='/chat-with-pdfs' element={ <ProtectedRoute element={ ChatWithPdfs }/> } />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Protected User Routes */}
        {/* <Route path='/get-post' element={<UserRoute element={GetPost} />} /> */}

      </Routes>
    </Router>
  );
}

export default App;
