// Import React and router tools.
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Activity, BarChart2, Heart } from 'lucide-react';

// Landing Page component.
const Landing = () => {
  return (
    <div className="bg-background-primary min-h-screen flex flex-col justify-between">
      {/* Header logo row */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label="yoga">🧘</span>
          <span className="font-semibold text-lg text-accent-primary tracking-tight">Kundalini Tracker</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="text-sm font-semibold text-text-secondary hover:text-text-primary px-3 py-2 transition">
            Sign In
          </Link>
          <Link to="/register" className="text-sm font-semibold bg-accent-primary text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition shadow-sm">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <main className="flex-grow flex flex-col items-center justify-center py-16 px-4 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-background-secondary text-accent-primary text-xs font-bold rounded-full mb-6 border border-border">
          <Heart className="w-3.5 h-3.5 fill-current" />
          Awaken Your Inner Consciousness
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-text-primary mb-6 leading-tight max-w-3xl">
          Harmonize Your Mind, Body, and Chakras
        </h1>
        <p className="text-base md:text-lg text-text-secondary max-w-2xl mb-10 leading-relaxed">
          Embark on a guided spiritual journey. Track your Kundalini kriyas, analyze real-time yoga poses using AI technology, and visualize your energy balancing over time.
        </p>
        <div className="flex gap-4 flex-wrap justify-center mb-20">
          <Link to="/register" className="px-8 py-3.5 bg-accent-primary text-white font-bold rounded-full hover:bg-opacity-90 transition shadow-md hover:-translate-y-0.5 transform">
            Begin Your Journey
          </Link>
          <Link to="/login" className="px-8 py-3.5 bg-white text-text-primary border border-border font-bold rounded-full hover:bg-background-secondary/50 transition">
            Access Dashboard
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-3xl border border-border shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-accent-primary mb-5">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">AI Pose Detection</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Verify your physical alignment in real time using computer vision to activate energy centers safely.
            </p>
          </div>
          {/* Card 2 */}
          <div className="bg-white p-6 rounded-3xl border border-border shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-accent-secondary mb-5">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Chakra Monitoring</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Log daily kriya details, track pranayama durations, and monitor emotional updates after practices.
            </p>
          </div>
          {/* Card 3 */}
          <div className="bg-white p-6 rounded-3xl border border-border shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-5">
              <BarChart2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Personalized Analytics</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Visualize your progress using charts detailing score increments, streak frequencies, and mood distributions.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-xs text-text-secondary bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Kundalini Practice Tracker. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-text-primary transition">Privacy Policy</a>
            <a href="#" className="hover:text-text-primary transition">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Export Landing.
export default Landing;
