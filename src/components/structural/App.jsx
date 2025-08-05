import { HashRouter, Route, Routes } from 'react-router';
import LayoutClassifyt from './LayoutClassifyt';
import HomeClassifyt from '../content/HomeClassifyt';
import LoginClassifyt from '../auth/LoginClassifyt';
import RegisterClassifyt from '../auth/RegisterClassifyt';
import LogoutClassifyt from '../auth/LogoutClassifyt';
import AboutUsClassifyt from '../content/AboutUsClassifyt';
import NoMatchClassifyt from '../content/NoMatchClassifyt';
import HandleLoginRegister from '../auth/HandleLoginRegister';
import AccountDetails from '../auth/AccountDetails';
import PostRegistration from '../auth/PostRegistration';
import DeleteAccount from '../auth/DeleteAccount';
import PlanSetupClassifyt from '../auth/PlanSetupClassifyt';
import PersonalPlan from '../content/PersonalPlan';
import { useState } from 'react';
import PlanSetup from '../contexts/PlanSetup';

function App() {

  const [planSetup, setPlanSetup] = useState(() => {
    const stored = sessionStorage.getItem("planSetup");
    return stored ? JSON.parse(stored) : undefined;
  });

  return (
    <PlanSetup.Provider value={[planSetup, setPlanSetup]}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LayoutClassifyt />}>
            <Route index element={<HomeClassifyt />} />
            <Route path="login" element={<LoginClassifyt />}></Route>
            <Route path="register" element={<RegisterClassifyt />}></Route>
            <Route path="logout" element={<LogoutClassifyt />}></Route>
            <Route path="handle" element={<HandleLoginRegister />}></Route>
            <Route path="account-details" element={<AccountDetails />}></Route>
            <Route path="delete-account" element={<DeleteAccount />}></Route>
            <Route path="getting-started" element={<PostRegistration />}></Route>
            <Route path="about-us" element={<AboutUsClassifyt/>}></Route>
            <Route path="plan-setup" element={<PlanSetupClassifyt/>}></Route>
            <Route path="personal-plan" element={<PersonalPlan/>}></Route>
            <Route path="*" element={<NoMatchClassifyt />} />
          </Route>
        </Routes>
      </HashRouter>
    </PlanSetup.Provider>
  );
}

export default App
