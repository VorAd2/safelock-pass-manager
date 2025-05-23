//import { useState } from 'react'

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HOME_ROUTE, SIGNIN_ROUTE, SIGNUP_ROUTE } from './routes';
import {HomePage, SigninPage, SignupPage} from './pages';



function App() {
  return (
    <Router>
       <Routes>
          <Route path={HOME_ROUTE} element={<HomePage/>}/>
          <Route path={SIGNIN_ROUTE} element={<SigninPage/>}/>
          <Route path={SIGNUP_ROUTE} element={<SignupPage/>}/>
       </Routes>
    </Router>
  );
}

export default App;