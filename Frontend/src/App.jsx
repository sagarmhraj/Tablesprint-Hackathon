import React from 'react'
import Login from './components/Login'
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Home from './components/Home';
import Forget from './components/Forget';
import ResetPassword from './components/ResetPassword';
import './App.css';
import CreateUser from './components/CreatUser';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/forgot-password' element={<Forget />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/create-user" element={<CreateUser />} />

      </Routes>
    </div>
  )
}

export default App