import React from 'react';
import { Trash2, Terminal, Folder, Code } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onChange: (id: string, field: keyof Task, value: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onChange }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-indigo-500/50 transition-all group relative">
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onDelete(task.id)}
          className="text-slate-500 hover:text-red-400 p-1 rounded-md hover:bg-slate-800 transition-colors"
          title="Remove Task"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="grid gap-4">
        {/* Name Input */}
        <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                <Terminal size={20} />
            </div>
            <div className="flex-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Window Title</label>
                <input
                type="text"
                value={task.name}
                onChange={(e) => onChange(task.id, 'name', e.target.value)}
                className="w-full bg-transparent text-slate-200 font-medium focus:outline-none border-b border-transparent focus:border-indigo-500 placeholder-slate-600"
                placeholder="e.g. Frontend Server"
                />
            </div>
        </div>

        {/* Path Input */}
        <div className="bg-slate-950/50 rounded-lg p-3 flex items-start gap-3 border border-slate-800/50">
             <div className="mt-1 text-slate-600">
                <Folder size={16} />
             </div>
             <div className="flex-1">
                <label className="text-xs text-slate-500 mb-1 block">Working Directory</label>
                <input
                    type="text"
                    value={task.path}
                    onChange={(e) => onChange(task.id, 'path', e.target.value)}
                    className="w-full bg-transparent text-slate-300 text-sm font-mono focus:outline-none placeholder-slate-700"
                    placeholder="C:\Projects\MyApp"
                />
             </div>
        </div>

        {/* Command Input */}
        <div className="bg-slate-950/50 rounded-lg p-3 flex items-start gap-3 border border-slate-800/50">
             <div className="mt-1 text-emerald-600">
                <Code size={16} />
             </div>
             <div className="flex-1">
                <label className="text-xs text-slate-500 mb-1 block">Command to Run</label>
                <input
                    type="text"
                    value={task.command}
                    onChange={(e) => onChange(task.id, 'command', e.target.value)}
                    className="w-full bg-transparent text-emerald-400 text-sm font-mono focus:outline-none placeholder-slate-700"
                    placeholder="npm start"
                />
             </div>
        </div>
      </div>
    </div>
  );
};