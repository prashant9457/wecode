import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import {
    Rocket,
    Mail,
    Lock,
    User,
    ArrowRight,
    ShieldCheck,
    AlertCircle,
    Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const AuthPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isLogin ? '/api/login' : '/api/signup';
        const payload = isLogin
            ? { email: formData.email, password: formData.password }
            : { username: formData.username, email: formData.email, password: formData.password };

        try {
            const res = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.user.username);
                localStorage.setItem('user_id', data.user.id);
                navigate('/dashboard');
            } else {
                setError(data.error || 'Identity verification failed.');
            }
        } catch (err) {
            setError('Connection to Arena Node lost.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: credentialResponse.credential })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.user.username);
                localStorage.setItem('user_id', data.user.id);
                navigate('/dashboard');
            } else {
                setError(data.error || 'Google Authentication failed.');
            }
        } catch (e) {
            setError('Google Node unreachable.');
        }
    };

    return (
        <div className="min-h-screen bg-[#0d1117] relative flex items-center justify-center p-6 overflow-hidden">

            {/* Background Grids & Blobs */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
            <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />

            {/* Floating Auth Window */}
            <div className="w-full max-w-[480px] bg-[#161b22] border border-[#30363d] rounded-[2.5rem] shadow-[0_32px_128px_rgba(0,0,0,0.6)] relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-700">

                {/* Top Tabs */}
                <div className="flex p-2 bg-[#0d1117] rounded-t-[2.5rem] border-b border-[#30363d]">
                    <button
                        onClick={() => { setIsLogin(true); setError(''); }}
                        className={cn(
                            "flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all",
                            isLogin ? "bg-[#161b22] text-white shadow-xl shadow-black/40" : "text-[#8b949e] hover:text-white"
                        )}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => { setIsLogin(false); setError(''); }}
                        className={cn(
                            "flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all",
                            !isLogin ? "bg-[#161b22] text-white shadow-xl shadow-black/40" : "text-[#8b949e] hover:text-white"
                        )}
                    >
                        Register
                    </button>
                </div>

                <div className="p-10 pt-12">
                    <div className="flex items-center gap-3 mb-10 justify-center">
                        <Rocket className="text-indigo-500" size={32} />
                        <span className="text-3xl font-black text-white tracking-tighter">WeCode Arena</span>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-sm font-medium animate-in shake duration-300">
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#8b949e] uppercase tracking-[0.3em] ml-1">Identity Handle</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#484f58] group-focus-within:text-indigo-500 transition-colors" size={18} />
                                    <Input
                                        required
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        placeholder="username"
                                        className="h-14 pl-12 bg-[#0d1117] border-[#30363d] rounded-2xl focus-visible:ring-indigo-500 text-white font-bold"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#8b949e] uppercase tracking-[0.3em] ml-1">Frequency (Email)</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#484f58] group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <Input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="operative@node.local"
                                    className="h-14 pl-12 bg-[#0d1117] border-[#30363d] rounded-2xl focus-visible:ring-indigo-500 text-white font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 pb-2">
                            <label className="text-[10px] font-black text-[#8b949e] uppercase tracking-[0.3em] ml-1">Access Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#484f58] group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <Input
                                    required
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="h-14 pl-12 bg-[#0d1117] border-[#30363d] rounded-2xl focus-visible:ring-indigo-500 text-white"
                                />
                            </div>
                        </div>

                        <Button
                            disabled={loading}
                            className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 group text-lg transition-all"
                        >
                            {loading ? "INITIALIZING..." : (
                                <span className="flex items-center gap-2">
                                    {isLogin ? 'ESTABLISH SYNC' : 'INITIATE NODE'}
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#30363d]"></div></div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black"><span className="bg-[#161b22] px-4 text-[#484f58]">Social Uplinks</span></div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="w-full flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Google uplink failed.')}
                                theme="filled_black"
                                shape="pill"
                                text={isLogin ? "signin_with" : "signup_with"}
                                width="100%"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-[#0d1117] border-t border-[#30363d] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#484f58] uppercase tracking-widest">
                        <ShieldCheck size={14} /> SECURE NODE
                    </div>
                    <div className="text-[10px] font-black text-[#586069] uppercase tracking-widest">VERSION 1.0.4-BETA</div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
