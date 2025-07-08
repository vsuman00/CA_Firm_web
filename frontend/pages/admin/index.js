import { useEffect } from "react";
import { useRouter } from "next/router";
import { isAuthenticated, getUserRole } from "../../utils/auth";

export default function AdminIndex() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (isAuthenticated()) {
      const userRole = getUserRole();

      // If authenticated and has admin role, redirect to dashboard
      if (userRole === "admin") {
        router.replace("/admin/dashboard");
      } else {
        // If authenticated but not admin, redirect to login
        router.replace("/admin/login");
      }
    } else {
      // If not authenticated, redirect to login
      router.replace("/admin/login");
    }
  }, [router]);

  // Return empty div while redirecting
  return <div className="min-h-screen bg-gray-50"></div>;
}
