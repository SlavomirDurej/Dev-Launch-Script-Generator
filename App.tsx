import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Download, Wand2, FileCode, Layers, AlertCircle } from 'lucide-react';
import { Task, GenerateStatus } from './types';
import { TaskCard } from './components/TaskCard';
import { generateBatchScript, downloadBatchFile } from './services/scriptGenerator';
import { parseInstructionsWithGemini } from './services/geminiService';

// Initial state based on user request
const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    name: 'Frontend (NextJS)',
    path: String.raw`E:\intell.ink\intellink-platform`,
    command: 'npm run dev:turbo',
  },
  {
    id: '2',
    name: 'Backend (PHP)',
    path: String.raw`E:\intell.ink`,
    command: 'php -S localhost:8080 -t backend/api/',
  },
  {
    id: '3',
    name: 'Stripe CLI',
    path: String.raw`E:\intell.ink`,
    command: 'stripe listen --forward-to http://localhost:8080/webhook.php',
  },
];

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [aiPrompt, setAiPrompt] = useState('');
  const [status, setStatus] = useState<GenerateStatus>(GenerateStatus.IDLE);
  const [generatedScript, setGeneratedScript] = useState('');

  // Update generated script whenever tasks change
  useEffect(() => {
    setGeneratedScript(generateBatchScript(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    setTasks([
      ...tasks,
      {
        id: crypto.randomUUID(),
        name: 'New Task',
        path: 'C:\\Projects',
        command: 'echo Hello World',
      },
    ]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleUpdateTask = (id: string, field: keyof Task, value: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    setStatus(GenerateStatus.LOADING);
    try {
      const newTasks = await parseInstructionsWithGemini(aiPrompt);
      setTasks((prev) => [...prev, ...newTasks]);
      setAiPrompt('');
      setStatus(GenerateStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(GenerateStatus.ERROR);
    } finally {
      // Reset success status after a delay for UX
      setTimeout(() => setStatus(GenerateStatus.IDLE), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent mb-2">
              DevLaunch
            </h1>
            <p className="text-slate-500 text-lg">
              Spawn your complex environment in 1 click.
            </p>
          </div>
          <button
            onClick={() => downloadBatchFile(generatedScript)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-indigo-900/20 hover:shadow-indigo-900/40 active:scale-95"
          >
            <Download size={20} />
            Download .bat File
          </button>
        </header>

        {/* AI Input Section */}
        <section className="mb-12">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4 text-indigo-400 font-semibold">
                    <Wand2 size={18} />
                    <span>AI Quick Add</span>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <textarea 
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Describe tasks to add... e.g., 'Run python app.py in C:/MyApp on port 5000 and run redis-server in C:/Redis'"
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 focus:outline-none focus:border-indigo-500 transition-colors text-slate-300 placeholder-slate-600 resize-none h-24"
                    />
                    <button 
                        onClick={handleAiGenerate}
                        disabled={status === GenerateStatus.LOADING || !aiPrompt.trim()}
                        className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-200 px-6 py-4 rounded-xl font-medium transition-colors flex items-center justify-center md:w-32"
                    >
                        {status === GenerateStatus.LOADING ? (
                            <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            'Generate'
                        )}
                    </button>
                </div>
                {status === GenerateStatus.ERROR && (
                    <div className="mt-3 text-red-400 text-sm flex items-center gap-2">
                        <AlertCircle size={14} />
                        Failed to generate tasks. Please try again.
                    </div>
                )}
            </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Tasks List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-300">
                    <Layers size={20} className="text-indigo-400" />
                    Tasks Configuration
                </h2>
                <button
                    onClick={handleAddTask}
                    className="text-sm flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium px-3 py-1 rounded-md hover:bg-indigo-950/30 transition-colors"
                >
                    <Plus size={16} />
                    Add Manual
                </button>
            </div>

            <div className="space-y-4">
                {tasks.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl text-slate-600">
                        No tasks configured. Add one manually or use AI.
                    </div>
                ) : (
                    tasks.map((task) => (
                        <TaskCard 
                            key={task.id} 
                            task={task} 
                            onDelete={handleDeleteTask}
                            onChange={handleUpdateTask}
                        />
                    ))
                )}
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-300">
                <FileCode size={20} className="text-emerald-400" />
                Script Preview
            </h2>
            
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 overflow-hidden shadow-xl">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-950/50 border-b border-slate-800">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                    <span className="text-xs text-slate-500 font-mono ml-2">launch-dev-env.bat</span>
                </div>
                <div className="p-4 overflow-x-auto">
                    <pre className="font-mono text-sm text-slate-400 whitespace-pre-wrap leading-relaxed">
                        {generatedScript}
                    </pre>
                </div>
            </div>

            <div className="bg-indigo-900/20 border border-indigo-900/50 rounded-xl p-4 text-sm text-indigo-300/80">
                <p className="font-semibold mb-1 text-indigo-300">Instructions:</p>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Click "Download .bat File" above.</li>
                    <li>Move the file to your desktop or project folder.</li>
                    <li>Double click to launch all your environments at once!</li>
                </ol>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;