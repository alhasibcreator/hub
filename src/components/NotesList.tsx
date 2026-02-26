import { useState, useEffect } from 'react';
import { BookOpen, Download, ExternalLink, Search, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface Note {
  id: number;
  title: string;
  course_code: string;
  link: string;
  description: string;
}

export default function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/notes')
      .then(res => res.json())
      .then(data => setNotes(data));
  }, []);

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.course_code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Study Materials</h2>
          <p className="text-slate-500">Access course notes, slides, and assignments</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes or course code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl w-full md:w-80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No study notes found.</p>
          </div>
        ) : (
          filteredNotes.map((note, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={note.id}
              className="premium-card p-6 flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-indigo-50 p-3 rounded-xl">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">
                  {note.course_code}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-2">{note.title}</h3>
              <p className="text-slate-500 text-sm mb-6 flex-1">{note.description}</p>
              
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <a 
                  href={note.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 text-sm font-semibold flex items-center gap-1 hover:underline"
                >
                  View Resource <ExternalLink className="w-3 h-3" />
                </a>
                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
