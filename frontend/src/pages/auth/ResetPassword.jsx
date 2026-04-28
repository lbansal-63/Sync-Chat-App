import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { HOST } from "@/utils/constant";
import { Loader2 } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!password) return toast.error("Password is required");
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    setLoading(true);
    try {
      const res = await fetch(`${HOST}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.errors || data.message);

      toast.success("Password updated successfully!");
      navigate("/auth");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#1c1d25]">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col gap-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-purple-700">Reset Password</h2>
          <p className="text-gray-500 mt-2">Enter your new password below</p>
        </div>
        <div className="flex flex-col gap-4">
          <Input
            type="password"
            placeholder="New Password"
            className="rounded-full p-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            className="rounded-full p-4"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button 
            onClick={handleResetPassword} 
            disabled={loading}
            className="rounded-full p-4 text-lg h-14 bg-purple-700 hover:bg-purple-800"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
