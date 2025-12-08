import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAdminAuthenticated } from "@/lib/adminAuth";

type Props = {
  children: ReactNode;
};

export const ProtectedAdminRoute = ({ children }: Props) => {
  const location = useLocation();
  const [ready, setReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    setIsAuthed(isAdminAuthenticated());
    setReady(true);
  }, []);

  if (!ready) return null;
  if (!isAuthed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
