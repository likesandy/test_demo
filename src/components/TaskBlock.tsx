import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from '../types';

interface TaskBlockProps {
  task: Task;
  onActionClick: (taskId: string, actionId: string) => void;
}

export function TaskBlock({ task, onActionClick }: TaskBlockProps) {
  const [logsExpanded, setLogsExpanded] = useState(true);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* User Prompt */}
      <div className="flex justify-end w-full">
        <div className="bg-[#e8f5e9] text-[#2e7d32] px-4 py-2 rounded-2xl rounded-tr-sm max-w-[85%] text-[15px] leading-relaxed shadow-sm">
          {task.prompt}
        </div>
      </div>

      {/* Assistant Response Container */}
      <div className="flex flex-col gap-3 w-full">
        {/* Initial Response */}
        <div className="text-[15px] text-gray-800 leading-relaxed px-1">
          {task.initialResponse}
        </div>

        {/* Execution Logs */}
        {task.logs.length > 0 && (
          <div className="flex flex-col">
            <button
              onClick={() => setLogsExpanded(!logsExpanded)}
              className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors py-1 px-1 w-fit"
            >
              {logsExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span className="text-[14px] font-medium">开始执行任务</span>
            </button>

            <AnimatePresence initial={false}>
              {logsExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="ml-2.5 pl-4 border-l-2 border-gray-200 mt-1 flex flex-col gap-2 py-1">
                    {task.logs.map((log) => (
                      <div
                        key={log.id}
                        className={`text-[13px] leading-relaxed ${
                          log.type === 'thought'
                            ? 'bg-gray-100 text-gray-600 px-3 py-2 rounded-lg'
                            : 'text-gray-600 px-1'
                        }`}
                      >
                        {log.text}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Action Card */}
        {task.status === 'action_required' && task.action && (
          <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-xl p-4 mt-1 shadow-sm">
            <div className="text-[14px] font-medium text-gray-800 mb-3">
              {task.action.message}
            </div>
            <div className="flex items-center gap-2">
              {task.action.buttons.map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => onActionClick(task.id, btn.id)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                    btn.primary
                      ? 'bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-sm'
                      : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm'
                  }`}
                >
                  {btn.icon === 'check' && <CheckCircle2 className="w-4 h-4" />}
                  {btn.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Final Result */}
        {task.status === 'completed' && task.result && (
          <div className="mt-2 px-1">
            {task.result}
          </div>
        )}
      </div>
    </div>
  );
}
