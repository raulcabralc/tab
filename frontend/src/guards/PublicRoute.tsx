import { Navigate, Outlet } from "react-router-dom";

export function PublicRoute() {
  const userData = localStorage.getItem("@TAB:user");
  const token = localStorage.getItem("@TAB:token");

  if (userData && token) {
    try {
      const user = JSON.parse(userData);

      if (user.isFirstLogin) {
        return (
          <Navigate
            to="/first-login"
            state={{ showFirstLoginAlert: true }}
            replace
          />
        );
      }

      return (
        <Navigate to="/" state={{ showAlreadyLoggedInAlert: true }} replace />
      );
    } catch (e) {
      localStorage.removeItem("@TAB:user");
      return <Outlet />;
    }
  }

  localStorage.removeItem("@TAB:user");
  localStorage.removeItem("@TAB:token");

  return <Outlet />;
}
