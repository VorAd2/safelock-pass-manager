import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HOME_ROUTE, SIGNIN_ROUTE, SIGNUP_ROUTE, DASHBOARD_ROUTE } from './routes';
import {HomePage, DashboardPage, SigninPage, SignupPage} from './pages';



function App() {
  return (
    <Router>
       <Routes>
          <Route path={HOME_ROUTE} element={<HomePage/>}/>
          <Route path={SIGNIN_ROUTE} element={<SigninPage/>}/>
          <Route path={SIGNUP_ROUTE} element={<SignupPage/>}/>
          <Route path={DASHBOARD_ROUTE} element={<DashboardPage/>} />
       </Routes>
    </Router>
  );
}

export default App;