/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Bell, 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  Menu, 
  X,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Components (will be created next)
import NoticeBoard from './components/NoticeBoard';
import RoutineTable from './components/RoutineTable';
import NotesList from './components/NotesList';
import AIChat from './components/AIChat';
import AdminPanel from './components/AdminPanel';
import Dashboard from './components/Dashboard';

type View = 'dashboard' | 'notices' | 'routine' | 'notes' | 'ai' | 'admin';

export default function App() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'notices', label: 'Notice Board', icon: Bell },
    { id: 'routine', label: 'Class Routine', icon: Calendar },
    { id: 'notes', label: 'Study Notes', icon: BookOpen },
    { id: 'ai', label: 'AI Assistant', icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-white border-r border-slate-200 flex flex-col z-50"
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-xl tracking-tight text-slate-800"
            >
              CSE Connect
            </motion.span>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as View)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeView === item.id 
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
              {activeView === item.id && isSidebarOpen && (
                <ChevronRight className="ml-auto w-4 h-4" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => setActiveView('admin')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
              activeView === 'admin' 
                ? 'bg-slate-900 text-white' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span className="font-medium">Admin Panel</span>}
          </button>
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mt-4 w-full flex items-center justify-center p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="sticky top-0 z-40 glass px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-800 capitalize">
            {activeView === 'ai' ? 'AI Department Assistant' : activeView.replace('-', ' ')}
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-700">CSE Department</p>
              <p className="text-xs text-slate-500">University Hub</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              U
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeView === 'dashboard' && <Dashboard onNavigate={setActiveView} />}
              {activeView === 'notices' && <NoticeBoard />}
              {activeView === 'routine' && <RoutineTable />}
              {activeView === 'notes' && <NotesList />}
              {activeView === 'ai' && <AIChat />}
              {activeView === 'admin' && <AdminPanel />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

