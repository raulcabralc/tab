import { Route, Routes } from "react-router-dom";
import { DefaultLayout } from "./components/DefaultLayout";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Team from "./pages/Team";
import Menu from "./pages/Menu";
import Analysis from "./pages/Analysis";
import { Login } from "./pages/Login";
import { Setup } from "./pages/Setup";

function Router() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/setup" element={<Setup />}></Route>
        <Route path="/reset-password" element></Route>
        <Route path="/update-password" element></Route>

        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/users" element={<Team />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/analysis" element={<Analysis />} />
        </Route>
      </Routes>
    </>
  );
}

export default Router;
