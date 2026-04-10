import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, ShieldCheck, Zap } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      navigate('/dashboard');
    }
  }, [navigate]);
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" to="/">
          <Rocket className="h-6 w-6 text-primary" />
          <span className="ml-2 font-bold text-xl">WeCode</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="/login">
            Login
          </Link>
          <Link to="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
          <div className="container px-4 md:px-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Build Fast, Scale Easy with <span className="text-primary">WeCode</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                The ultimate platform for developers to build, deploy, and manage their modern web applications with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link to="/signup">
                  <Button size="lg" className="px-8">Get Started</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="px-8">Login</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-xl bg-background shadow-sm">
                <Zap className="h-10 w-10 text-primary mb-2" />
                <h3 className="text-xl font-bold">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Vite-powered frontend development for instant hot module replacement.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-xl bg-background shadow-sm">
                <ShieldCheck className="h-10 w-10 text-primary mb-2" />
                <h3 className="text-xl font-bold">Secure Auth</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Built-in Supabase authentication to protect your users' data from day one.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-xl bg-background shadow-sm">
                <Rocket className="h-10 w-10 text-primary mb-2" />
                <h3 className="text-xl font-bold">Scalable DB</h3>
                <p className="text-sm text-muted-foreground text-center">
                  PostgreSQL backend with Supabase for effortless database management.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2026 WeCode Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default LandingPage;
