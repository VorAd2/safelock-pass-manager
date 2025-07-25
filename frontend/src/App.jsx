//f5 esta reconstruindo a arvore de componentes inteira: context é volatil
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HOME_ROUTE, SIGNIN_ROUTE, SIGNUP_ROUTE, DASHBOARD_ROUTE } from './routes';
import {HomePage, DashboardWrapper, SigninPage, SignupPage} from './pages';
import {
  VaultsContent, SendContent, CardsContent, 
  ReceiptsContent, SettingsContent, ContactUsContent,
  IndexContent
} from './components'


function App() {
  return (
    <Router>
       <Routes>
          <Route path={HOME_ROUTE} element={<HomePage/>}/>
          <Route path={SIGNIN_ROUTE} element={<SigninPage/>}/>
          <Route path={SIGNUP_ROUTE} element={<SignupPage/>}/>

          <Route path={DASHBOARD_ROUTE} element={<DashboardWrapper/>}>
            <Route index element={<IndexContent />} /> 
            <Route path="vaults" element={<VaultsContent />} />
            <Route path="send" element={<SendContent />} />
            <Route path="cards" element={<CardsContent />} />
            <Route path="receipts" element={<ReceiptsContent />} />
            <Route path="settings" element={<SettingsContent />} />
            <Route path="contactus" element={<ContactUsContent />} />
            <Route path="tools" element={<div>Tools Content here!</div>} /> 
          </Route>

       </Routes>
    </Router>
  );
}

export default App;