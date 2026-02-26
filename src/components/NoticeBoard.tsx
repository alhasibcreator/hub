import { useState, useEffect } from 'react';
import { Bell, Calendar, Tag, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface Notice {
  id: number;
  title: string;
  content: string;
  date: string;
  category: string;
}

export default function NoticeBoard() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/notices')
      .then(res => res.json())
      .then(data => {
        setNotices(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex justify-center p-12">Loading notices...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Department Notices</h2>
          <p className="text-slate-500">Stay updated with the latest announcements</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">Latest</span>
        </div>
      </div>

      <div className="grid gap-4">
        {notices.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No notices posted yet.</p>
          </div>
        ) : (
          notices.map((notice, i) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              key={notice.id}
              className="premium-card p-6 flex flex-col md:flex-row md:items-center gap-6 group cursor-pointer"
            >
              <div className="flex-shrink-0 w-16 h-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                <Calendar className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-bold uppercase">{new Date(notice.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">
                    {notice.category}
                  </span>
                  <span className="text-xs text-slate-400">{new Date(notice.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{notice.title}</h3>
                <p className="text-slate-600 text-sm line-clamp-2">{notice.content}</p>
              </div>

              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
