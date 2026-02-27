import { Route, Routes } from "react-router-dom";
import { DefaultLayout } from "./components/DefaultLayout";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Team from "./pages/Team";
import Analysis from "./pages/Analysis";
import { Login } from "./pages/Login";
import { Setup } from "./pages/Setup";
import { FirstLogin } from "./pages/FirstLogin";
import { CheckFirstLogin } from "./guards/CheckFirstLogin";
import { PublicRoute } from "./guards/PublicRoute";
import { ResetPassword } from "./pages/ResetPassword";
import Restaurant from "./pages/Restaurant";

function Router() {
  return (
    <>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/setup" element={<Setup />}></Route>
          <Route path="/reset-password" element={<ResetPassword />}></Route>
        </Route>

        <Route element={<CheckFirstLogin />}>
          <Route path="/first-login" element={<FirstLogin />} />

          <Route element={<DefaultLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/users" element={<Team />} />
            <Route path="/restaurant" element={<Restaurant />} />
            <Route path="/analysis" element={<Analysis />} />
          </Route>

          <Route path="*" element={<h1>Teste!</h1>} />
        </Route>

        <Route path="*" element={<h1>Teste!</h1>} />
      </Routes>
    </>
  );
}

export default Router;
