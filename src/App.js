import React from 'react';
import Login from './component/auth/Login';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './component/main/Dashboard';
import ListOfIds from './component/main/ListOfIds';
import { AuthContextProvider } from "./component/context/AuthContext";
import ProtectedRoute from "./component/auth/ProtectedRoute";
import ProtectedRouteLogin from "./component/auth/ProtectedRouteLogin";


function App() {
  return (
    <>
      <AuthContextProvider>
        <Routes>
          <Route path='/login' element={
            <ProtectedRouteLogin>
              <Login />
            </ProtectedRouteLogin>} />
          <Route path='/' element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>} />
          <Route path='/list' element={
            <ProtectedRoute>
              <ListOfIds />
            </ProtectedRoute>} />
        </Routes>
      </AuthContextProvider>
    </>
  );
}

export default App;
