import { PouchDB, useDB, useGet, useFind } from "react-pouchdb"
import { Suspense, startTransition, useState } from "react";
import { Route, Routes } from "react-router-dom";
import NotAvailable from './Pages/NotAvailable';
import Home from './Pages/Home';
import About from './Pages/About';
import Layout from './Pages/Layout';
import SheepManager from "./Pages/SheepManager";

/*
** TODO: 
**  
**
**
*/



function App() {

  return (    
      <Routes>
          <Route path='/' element={<Layout />}>
              <Route index element={<Home />} />
              <Route path='/about' element={<About />} />
              <Route path='/sheep-manager' element={<SheepManager />} />
              <Route path='*' element={<NotAvailable />} />
          </Route>
      </Routes>
  )
}

export default App;
