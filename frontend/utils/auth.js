import { useEffect } from "react";
import { useRouter } from "next/router";
import { httpClient } from "./httpClient";

// Set auth token and user info
export const setAuth = (token, user) => {
  if (token) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    httpClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

// Set auth token for all requests
export const setAuthToken = (token) => {
  if (token) {
    httpClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete httpClient.defaults.headers.common["Authorization"];
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const token = localStorage.getItem("token");
  return !!token;
};

// Get user info
export const getUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user info:", error);
    return null;
  }
};

// Get user role
export const getUserRole = () => {
  const user = getUser();
  return user ? user.role : null;
};

// Logout user
export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthToken(null);
  }
};

// Auth middleware for protected routes
export const withAuth = (WrappedComponent, requiredRole) => {
  const Wrapper = (props) => {
    const router = useRouter();

    useEffect(() => {
      // Check if we're in the browser
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        const user = getUser();
        const userRole = user ? user.role : null;

        if (!token) {
          // Redirect to appropriate login page based on path
          if (router.pathname.startsWith("/admin")) {
            router.replace("/admin/login");
          } else {
            router.replace("/login");
          }
        } else {
          // Set auth token for axios requests
          setAuthToken(token);

          // Check if user has required role (if specified)
          if (requiredRole && userRole !== requiredRole) {
            if (userRole === "admin") {
              router.replace("/admin/dashboard");
            } else {
              router.replace("/user/dashboard");
            }
            return;
          }

          // Verify token validity
          const verifyToken = async () => {
            try {
              const response = await httpClient.get("/api/auth/me");
              // Update user info in case it changed
              localStorage.setItem("user", JSON.stringify(response.data));
            } catch (error) {
              console.error("Token verification failed:", error);
              localStorage.removeItem("token");
              localStorage.removeItem("user");

              // Redirect to appropriate login page based on path
              if (router.pathname.startsWith("/admin")) {
                router.replace("/admin/login");
              } else {
                router.replace("/login");
              }
            }
          };

          verifyToken();
        }
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};
