import { Task } from '../types';

export const generateBatchScript = (tasks: Task[]): string => {
  const header = `@echo off
echo Starting Development Environments...
echo.
`;

  const commands = tasks.map((task) => {
    // Escape single quotes in path for PowerShell
    const safePath = task.path.replace(/'/g, "''");
    // We use PowerShell to keep the window open (-NoExit) and handle paths easier
    // Syntax: start "Window Title" powershell -NoExit -Command "cd 'path'; command"
    return `start "${task.name}" powershell -NoExit -Command "cd '${safePath}'; ${task.command}"`;
  });

  const footer = `
echo All environments launched.
timeout /t 3 >nul
exit
`;

  return header + commands.join('\n') + footer;
};

export const downloadBatchFile = (content: string, filename: string = 'launch-dev-env.bat') => {
  const blob = new Blob([content], { type: 'application/x-bat' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};