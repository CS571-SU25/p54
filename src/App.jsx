import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AboutUs from "./components/AboutUs";
import OtherInfo from "./components/OtherInfo";
import { HashRouter, Route, Routes } from 'react-router';

function App() {
  return <HashRouter>
    <Routes>
      <Route path="/about-us" element={<AboutUs/>}></Route>
      <Route path="/other-info" element={<OtherInfo/>}></Route>
    </Routes>
  </HashRouter>
}

export default App
