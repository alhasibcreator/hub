import { useState, useEffect } from 'react';
import { Plus, Trash2, Bell, Calendar, BookOpen, Lock, Unlock, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'notices' | 'routines' | 'notes'>('notices');
  
  const [notices, setNotices] = useState<any[]>([]);
  const [routines, setRoutines] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);

  // Form states
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', category: 'General' });
  const [routineForm, setRoutineForm] = useState({ day: 'Monday', subject: '', time: '', room: '', teacher: '' });
  const [noteForm, setNoteForm] = useState({ title: '', course_code: '', link: '', description: '' });

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    const [nRes, rRes, ntRes] = await Promise.all([
      fetch('/api/notices'),
      fetch('/api/routines'),
      fetch('/api/notes')
    ]);
    setNotices(await nRes.json());
    setRoutines(await rRes.json());
    setNotes(await ntRes.json());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'ALHASIB@1' && password === 'i@1Us##') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid Username or Password');
    }
  };

  const handleDelete = async (type: string, id: number) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/${type}/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/notices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...noticeForm, date: new Date().toISOString() })
    });
    setNoticeForm({ title: '', content: '', category: 'General' });
    fetchData();
  };

  const handleAddRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/routines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(routineForm)
    });
    setRoutineForm({ day: 'Monday', subject: '', time: '', room: '', teacher: '' });
    fetchData();
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteForm)
    });
    setNoteForm({ title: '', course_code: '', link: '', description: '' });
    fetchData();
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="premium-card p-8 text-center"
        >
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Admin Access</h2>
          <p className="text-slate-500 mb-8">Please enter your administrator password to manage department content.</p>
          
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Username</label>
              <input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <button type="submit" className="w-full btn-primary py-3 mt-2">
              Unlock Panel
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Admin Control Center</h2>
          <p className="text-slate-500">Manage all department resources and information</p>
        </div>
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        {[
          { id: 'notices', label: 'Notices', icon: Bell },
          { id: 'routines', label: 'Routines', icon: Calendar },
          { id: 'notes', label: 'Notes', icon: BookOpen },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all relative ${
              activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="premium-card p-6 sticky top-24">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              Add New {activeTab.slice(0, -1)}
            </h3>

            {activeTab === 'notices' && (
              <form onSubmit={handleAddNotice} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Title</label>
                  <input
                    required
                    value={noticeForm.title}
                    onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Category</label>
                  <select
                    value={noticeForm.category}
                    onChange={e => setNoticeForm({ ...noticeForm, category: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>General</option>
                    <option>Exam</option>
                    <option>Event</option>
                    <option>Holiday</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Content</label>
                  <textarea
                    required
                    rows={4}
                    value={noticeForm.content}
                    onChange={e => setNoticeForm({ ...noticeForm, content: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button type="submit" className="w-full btn-primary">Post Notice</button>
              </form>
            )}

            {activeTab === 'routines' && (
              <form onSubmit={handleAddRoutine} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Day</label>
                  <select
                    value={routineForm.day}
                    onChange={e => setRoutineForm({ ...routineForm, day: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Subject</label>
                  <input
                    required
                    value={routineForm.subject}
                    onChange={e => setRoutineForm({ ...routineForm, subject: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Time</label>
                    <input
                      required
                      placeholder="e.g. 10:00 AM"
                      value={routineForm.time}
                      onChange={e => setRoutineForm({ ...routineForm, time: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Room</label>
                    <input
                      required
                      value={routineForm.room}
                      onChange={e => setRoutineForm({ ...routineForm, room: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Teacher</label>
                  <input
                    required
                    value={routineForm.teacher}
                    onChange={e => setRoutineForm({ ...routineForm, teacher: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button type="submit" className="w-full btn-primary">Add Schedule</button>
              </form>
            )}

            {activeTab === 'notes' && (
              <form onSubmit={handleAddNote} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Title</label>
                  <input
                    required
                    value={noteForm.title}
                    onChange={e => setNoteForm({ ...noteForm, title: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Course Code</label>
                  <input
                    required
                    value={noteForm.course_code}
                    onChange={e => setNoteForm({ ...noteForm, course_code: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Link</label>
                  <input
                    required
                    type="url"
                    value={noteForm.link}
                    onChange={e => setNoteForm({ ...noteForm, link: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Description</label>
                  <textarea
                    rows={3}
                    value={noteForm.description}
                    onChange={e => setNoteForm({ ...noteForm, description: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button type="submit" className="w-full btn-primary">Upload Note</button>
              </form>
            )}
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2">
          <div className="premium-card overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-700">Existing {activeTab}</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {activeTab === 'notices' && notices.map(n => (
                <div key={n.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <h4 className="font-bold text-slate-800">{n.title}</h4>
                    <p className="text-xs text-slate-400">{new Date(n.date).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => handleDelete('notices', n.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {activeTab === 'routines' && routines.map(r => (
                <div key={r.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <h4 className="font-bold text-slate-800">{r.subject}</h4>
                    <p className="text-xs text-slate-400">{r.day} • {r.time} • Room {r.room}</p>
                  </div>
                  <button onClick={() => handleDelete('routines', r.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {activeTab === 'notes' && notes.map(nt => (
                <div key={nt.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <h4 className="font-bold text-slate-800">{nt.title}</h4>
                    <p className="text-xs text-slate-400">{nt.course_code}</p>
                  </div>
                  <button onClick={() => handleDelete('notes', nt.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {(activeTab === 'notices' ? notices : activeTab === 'routines' ? routines : notes).length === 0 && (
                <div className="p-12 text-center text-slate-400 italic">No items found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
