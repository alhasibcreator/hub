import { Bell, Calendar, BookOpen, MessageSquare, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  onNavigate: (view: any) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const stats = [
    { label: 'Active Notices', value: '12', icon: Bell, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Today Classes', value: '4', icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'New Notes', value: '28', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  const quickActions = [
    { label: 'Check Notices', view: 'notices', icon: Bell, desc: 'Stay updated with department news' },
    { label: 'View Routine', view: 'routine', icon: Calendar, desc: 'Check your class schedule' },
    { label: 'Study Notes', view: 'notes', icon: BookOpen, desc: 'Access course materials' },
    { label: 'Ask AI', view: 'ai', icon: MessageSquare, desc: 'Get instant help from our AI' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-indigo-600 p-12 text-white">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">Welcome to CSE Connect</h2>
          <p className="text-indigo-100 text-lg mb-8">
            Your central hub for all department resources. Stay updated, access study materials, and get help from our AI assistant.
          </p>
          <button 
            onClick={() => onNavigate('ai')}
            className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-50 transition-colors"
          >
            Try AI Assistant <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <GraduationCapLarge />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="premium-card p-6 flex items-center gap-4"
          >
            <div className={`${stat.bg} p-4 rounded-2xl`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-6">Quick Access</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, i) => (
            <motion.button
              whileHover={{ y: -5 }}
              key={action.label}
              onClick={() => onNavigate(action.view)}
              className="premium-card p-6 text-left group"
            >
              <div className="bg-slate-50 p-3 rounded-xl w-fit mb-4 group-hover:bg-indigo-50 transition-colors">
                <action.icon className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transition-colors" />
              </div>
              <h4 className="font-bold text-slate-800 mb-1">{action.label}</h4>
              <p className="text-sm text-slate-500">{action.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function GraduationCapLarge() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
    </svg>
  );
}
