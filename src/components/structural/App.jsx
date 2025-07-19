import { HashRouter, Route, Routes } from 'react-router';
import LayoutClassifyt from './LayoutClassifyt';
import HomeClassifyt from '../content/HomeClassifyt';
import LoginClassifyt from '../auth/LoginClassifyt';
import RegisterClassifyt from '../auth/RegisterClassifyt';
import LogoutClassifyt from '../auth/LogoutClassifyt';
import AboutUsClassifyt from '../content/AboutUsClassifyt';
import OtherInfoClassifyt from '../content/OtherInfoClassifyt';
import NoMatchClassifyt from '../content/NoMatchClassifyt';
import HandleLoginRegister from '../auth/HandleLoginRegister';
import AccountDetails from '../auth/AccountDetails';
import PostRegistration from '../auth/PostRegistration';
import DeleteAccount from '../auth/DeleteAccount';

function App() {
  return (
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
          <Route path="other-info" element={<OtherInfoClassifyt/>}></Route>
          <Route path="*" element={<NoMatchClassifyt />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App
