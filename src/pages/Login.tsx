import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-zinc-800 to-zinc-700 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md animate-fade-in bg-gray-">
        <CardHeader className="space-y-1">
          <CardTitle className=" flex justify-center items-center">
            <img
              src="/assets/Tsoles-logo.png"
              className={`cursor-pointer h-36 w-44 duration-500 ${
                open && "rotate-[360deg]"
              }`}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-900">
              Sign in
            </Button>
          </form>

        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
