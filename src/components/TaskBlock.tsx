import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2, Info, MinusCircle, CircleDot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from '../types';

interface TaskBlockProps {
  task: Task;
  onActionClick: (taskId: string, actionId: string) => void;
}

export function TaskBlock({ task, onActionClick }: TaskBlockProps) {
  const [logsExpanded, setLogsExpanded] = useState(true);

  return (
    <div className="flex flex-col w-full">
      {/* User Prompt */}
      <div className="flex justify-end w-full mb-4">
        <div className="bg-[#f0fdf4] text-gray-700 px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%] text-[14px] leading-relaxed">
          {task.prompt}
        </div>
      </div>

      {/* Assistant Response Container */}
      <div className="flex flex-col w-full">
        
        {/* Execution Logs Timeline */}
        {task.logs.length > 0 && (
          <div className="ml-1 mb-4">
            <div 
              className="flex items-center gap-1 text-gray-500 mb-3 cursor-pointer w-fit" 
              onClick={() => setLogsExpanded(!logsExpanded)}
            >
              <span className="text-[13px]">开始执行任务</span>
              {logsExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </div>
            
            <AnimatePresence initial={false}>
              {logsExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="relative pl-6 ml-1">
                    {/* Vertical Line */}
                    <div className="absolute left-[7px] top-2 bottom-4 w-px bg-gray-200" />
                    
                    {/* Log 1: Thought */}
                    {task.logs[0] && (
                      <div className="relative pb-3">
                        <div className="absolute -left-[20px] top-1.5 w-2 h-2 rounded-full bg-gray-400 ring-4 ring-white" />
                        <div className="text-[13px] text-gray-500 leading-relaxed">{task.logs[0].text}</div>
                      </div>
                    )}
                    
                    {/* Log 2: Info start */}
                    {task.logs[1] && (
                      <div className="relative pb-1">
                        <div className="absolute -left-[23px] top-1 bg-white text-gray-400">
                          <CircleDot className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-[13px] text-gray-500 leading-relaxed">{task.logs[1].text}</div>
                      </div>
                    )}
                    
                    {/* Remaining Logs */}
                    {task.logs.slice(2).map(log => (
                      <div key={log.id} className="relative pb-1 pl-0">
                        <div className="text-[13px] text-gray-500 leading-relaxed">{log.text}</div>
                      </div>
                    ))}
                    
                    {/* Action Card */}
                    {task.action && (
                      <div className="relative pb-4 pt-2">
                        <div className="absolute -left-[23px] top-3 bg-white text-gray-400">
                          <Info className="w-3.5 h-3.5" />
                        </div>
                        <div className="bg-[#f8fafc] rounded-xl p-3">
                          <div className="text-[13px] text-gray-700 mb-2.5">
                            {task.action.message}
                          </div>
                          <div className="flex items-center gap-2">
                            {task.action.buttons.map((btn) => (
                              <button
                                key={btn.id}
                                onClick={() => onActionClick(task.id, btn.id)}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-[13px] transition-colors ${
                                  btn.primary
                                    ? 'bg-[#4ade80] hover:bg-[#22c55e] text-white'
                                    : 'bg-white hover:bg-gray-50 text-gray-500 border border-gray-200'
                                }`}
                              >
                                {btn.icon === 'check' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                {btn.icon === 'minus' && <MinusCircle className="w-3.5 h-3.5" />}
                                {btn.text}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Completed Status */}
                    {task.status === 'completed' && (
                      <div className="relative pb-1 pt-2">
                        <div className="absolute -left-[23px] top-2.5 bg-white text-gray-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-[13px] text-gray-500">已完成</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Initial Response (moved to bottom) */}
        {(task.status === 'completed' || task.status === 'action_required') && (
          <div className="text-[14px] text-gray-800 leading-relaxed mb-2">
            {task.initialResponse}
          </div>
        )}

        {/* Final Result */}
        {task.status === 'completed' && task.result && (
          <div className="mt-1">
            {task.result}
          </div>
        )}
      </div>
    </div>
  );
}
