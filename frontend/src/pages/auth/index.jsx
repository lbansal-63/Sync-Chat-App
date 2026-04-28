import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import victory from "../../assets/victory.svg";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Background from "../../assets/login2.png";
import { toast } from "sonner";
import { HOST } from "@/utils/constant";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "@/store/slices/auth-slices";
import { Loader2, Mail } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPasswod] = useState("");
  const [activeTab, setActiveTab] = useState("Login");
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const dispatch = useDispatch();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch(HOST + "/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.errors);
      }

      if (data.user._id) {
        dispatch(setUserData(data.user));
        data.user.profileSetup ? navigate("/chat") : navigate("/profile");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const res = await fetch(HOST + "/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.errors);
      } else {
        navigate("/profile");
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await fetch(HOST + "/api/auth/google-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: tokenResponse.access_token }),
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.errors);

        if (data.user._id) {
          dispatch(setUserData(data.user));
          data.user.profileSetup ? navigate("/chat") : navigate("/profile");
        }
      } catch (error) {
        toast.error("Google Login failed");
      } finally {
        setLoading(false);
      }
    },
    onError: () => toast.error("Google Login failed"),
  });

  const handleForgotPassword = async () => {
    if (!email) return toast.error("Please enter your email");
    setLoading(true);
    try {
      const res = await fetch(HOST + "/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.errors);
      toast.success("Reset link sent to your email!");
      setIsForgotPassword(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (activeTab === "Login") {
        handleLogin();
      } else if (activeTab === "SignUp") {
        handleSignUp();
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f0f13] relative overflow-hidden">
      {/* Background blobs for premium look */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-[1100px] mx-4 md:mx-8 bg-[#1c1d25]/50 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[2rem] overflow-hidden grid md:grid-cols-2 min-h-[600px]">
        <div className="flex flex-col p-8 sm:p-12 items-center justify-center w-full">
          <div className="flex flex-col items-center mb-10">
            <div className="p-3 bg-purple-600/10 rounded-2xl mb-4">
              <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              SyncChat
            </h1>
            <p className="text-gray-400 text-sm mt-3 text-center max-w-[280px]">
              Join the most immersive real-time chat experience today.
            </p>
          </div>

          <div className="w-full max-w-[400px]">
            {isForgotPassword ? (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white">Reset Password</h3>
                  <p className="text-xs text-gray-400 mt-1">We'll send a link to your inbox</p>
                </div>
                <Input
                  type="email"
                  placeholder="Your Email"
                  className="rounded-xl h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button 
                  onClick={handleForgotPassword} 
                  disabled={loading}
                  className="rounded-xl h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-lg shadow-purple-600/20 transition-all"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
                </Button>
                <button 
                  onClick={() => setIsForgotPassword(false)}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Back to login
                </button>
              </div>
            ) : (
              <Tabs
                className="w-full"
                defaultValue="Login"
                onValueChange={setActiveTab}
              >
                <TabsList className="flex bg-white/5 p-1 rounded-xl mb-8">
                  <TabsTrigger
                    value="Login"
                    disabled={loading}
                    className="flex-1 text-sm py-2.5 rounded-lg text-gray-400 data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="SignUp"
                    disabled={loading}
                    className="flex-1 text-sm py-2.5 rounded-lg text-gray-400 data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all"
                  >
                    Signup
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="Login" className="animate-in fade-in duration-500">
                  <div className="flex flex-col gap-5">
                    <Input
                      type="email"
                      placeholder="Email"
                      className="rounded-xl h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      className="rounded-xl h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <div className="flex justify-end">
                      <button 
                        onClick={() => setIsForgotPassword(true)}
                        className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <Button
                      onClick={handleLogin}
                      disabled={loading}
                      className="rounded-xl h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-lg shadow-purple-600/20 transition-all mt-2"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                    </Button>
                    
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                      </div>
                      <div className="relative flex justify-center text-[10px] uppercase">
                        <span className="bg-[#1c1d25] px-2 text-gray-500">Or continue with</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handleGoogleLogin()}
                      disabled={loading}
                      className="rounded-xl h-12 bg-transparent border-white/10 hover:bg-white/5 text-white flex items-center gap-3 transition-all"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Sign in with Google
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="SignUp" className="animate-in fade-in duration-500">
                  <div className="flex flex-col gap-5">
                    <Input
                      type="email"
                      placeholder="Email"
                      className="rounded-xl h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      className="rounded-xl h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      className="rounded-xl h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPasswod(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <Button
                      onClick={handleSignUp}
                      disabled={loading}
                      className="rounded-xl h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-lg shadow-purple-600/20 transition-all mt-4"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
        
        <div className="hidden md:flex flex-col items-center justify-center bg-purple-600/10 p-12 border-l border-white/5 relative">
          <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-600/20 blur-[100px] rounded-full"></div>
          <img 
            src={Background} 
            alt="SyncChat Illustration" 
            className="w-full max-w-[320px] relative z-10 animate-pulse-slow" 
            loading="lazy" 
          />
          <div className="mt-8 text-center relative z-10">
            <h2 className="text-2xl font-bold text-white">Experience the Future</h2>
            <p className="text-gray-400 mt-2 text-sm">Secure, encrypted, and lightning fast communication.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
