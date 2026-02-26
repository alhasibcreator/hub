import { useState, useEffect } from 'react';
import { Clock, MapPin, User, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface Routine {
  id: number;
  day: string;
  subject: string;
  time: string;
  room: string;
  teacher: string;
}

export default function RoutineTable() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [activeDay, setActiveDay] = useState('Monday');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetch('/api/routines')
      .then(res => res.json())
      .then(data => setRoutines(data));
  }, []);

  const filteredRoutines = routines.filter(r => r.day === activeDay);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Class Routine</h2>
        <p className="text-slate-500">Weekly schedule for CSE Department</p>
      </div>

      {/* Day Selector */}
      <div className="flex flex-wrap gap-2">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeDay === day 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Routine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoutines.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-400">No classes scheduled for {activeDay}.</p>
          </div>
        ) : (
          filteredRoutines.map((item, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={item.id}
              className="premium-card p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 opacity-50" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-indigo-600 mb-4">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-bold">{item.time}</span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-4">{item.subject}</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Room: {item.room}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{item.teacher}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
