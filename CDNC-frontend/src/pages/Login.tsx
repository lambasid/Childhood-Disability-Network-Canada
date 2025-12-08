import { useEffect, useState } from "react";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAdminEmail, isAdminAuthenticated, setAdminSession, validateAdminCredentials } from "@/lib/adminAuth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate("/admin/resources", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = validateAdminCredentials(email, password);

    if (valid) {
      setAdminSession();
      const redirectTo = (location.state as { from?: Location })?.from?.pathname || "/admin/resources";
      navigate(redirectTo, { replace: true });
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md shadow-lg border-purple-100">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-900">Administrator Login</CardTitle>
          <CardDescription className="text-gray-600">
            Access the hidden admin dashboard to manage Government Funding and Support resources.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder={getAdminEmail()}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-purple-100 focus-visible:ring-purple"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-purple-100 focus-visible:ring-purple"
                required
              />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" className="w-full bg-purple-900 hover:bg-purple-dark text-white">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
