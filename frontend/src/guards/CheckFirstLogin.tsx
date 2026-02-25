import { Navigate, Outlet, useLocation } from "react-router-dom";

interface User {
  access_token: string;
  isFirstLogin: boolean;
}

export function CheckFirstLogin() {
  const location = useLocation();
  const userData = localStorage.getItem("@TAB:user");
  const token = localStorage.getItem("@TAB:token");

  if (!userData || !token) {
    if (
      location.pathname.startsWith("/login") ||
      location.pathname.startsWith("/setup")
    ) {
      return <Outlet />;
    }

    return (
      <Navigate
        to="/login"
        state={{ from: location, showNoUserLoggedAlert: true }}
        replace
      />
    );
  }

  try {
    const user = JSON.parse(userData) as User;

    if (user.isFirstLogin) {
      if (location.pathname === "/first-login") {
        return <Outlet />;
      }

      return (
        <Navigate
          to="/first-login"
          state={{ showFirstLoginAlert: true }}
          replace
        />
      );
    }

    if (location.pathname === "/first-login") {
      return (
        <Navigate
          to="/"
          state={{ showNotFirstLoginAnymoreAlert: true }}
          replace
        />
      );
    }

    return <Outlet />;
  } catch (e) {
    return (
      <Navigate
        to="/login"
        state={{ showUnexpectedLoginAlert: true }}
        replace
      />
    );
  }
}
