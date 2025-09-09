import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AdminSession {
  id: string;
  username: string;
  loginTime: number;
}

export const useAdminAuth = () => {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminSession = () => {
      const session = localStorage.getItem("admin_session");
      
      if (!session) {
        setIsLoading(false);
        return;
      }

      try {
        const sessionData = JSON.parse(session);
        // Check if session is valid (within 24 hours)
        const isValid = Date.now() - sessionData.loginTime < 24 * 60 * 60 * 1000;
        
        if (isValid) {
          setAdminSession(sessionData);
        } else {
          localStorage.removeItem("admin_session");
        }
      } catch {
        localStorage.removeItem("admin_session");
      }
      
      setIsLoading(false);
    };

    checkAdminSession();
  }, []);

  const logout = () => {
    localStorage.removeItem("admin_session");
    setAdminSession(null);
    navigate("/");
  };

  const isAuthenticated = !!adminSession;

  return {
    adminSession,
    isAuthenticated,
    isLoading,
    logout,
  };
};