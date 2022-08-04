import { PouchDB, useDB, useGet, useFind } from "react-pouchdb"
import { Suspense, startTransition, useState, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import NotAvailable from './Pages/NotAvailable';
import Home from './Pages/Home';
import About from './Pages/About';
import Layout from './Pages/Layout';
import { SheepProfile } from "./Pages/SheepProfile"
import Loading from "./Components/Loading";

const LazyManager = lazy(() => import ("./Pages/SheepManager")) ;

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
                <Route index element={<Suspense fallback={<Loading />}><Home /></Suspense>} />
                <Route path='/about' element={<About />} />
                <Route path='/sheep-manager'>
                    <Route 
                        index element={<Suspense fallback={<Loading />}><LazyManager /></Suspense>}
                    />
                    <Route path=":sheepId" element={<SheepProfile />}/>
                </Route>
                <Route path='*' element={<NotAvailable />} />
          </Route>
      </Routes>
  )
}

export default App;
