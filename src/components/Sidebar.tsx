import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Minus, X, Send, CheckCircle2, Bot } from 'lucide-react';
import { TaskBlock } from './TaskBlock';
import { Task } from '../types';

// Mock data to match the provided design
const initialMockTask: Task = {
  id: '1',
  prompt: '帮我打开抖音，并搜索可爱狗狗',
  initialResponse: '好的，我来帮您打开抖音并搜索可爱狗狗。',
  status: 'completed',
  createdAt: Date.now(),
  logs: [
    { id: 'l1', text: '【思考】现在我将为您打开抖音的网页端，我将开始调用我的工具来帮助本次任务执行...', type: 'thought' },
    { id: 'l2', text: '【抖音】检测到搜索结果开始加载，切换到下一个平台', type: 'info' },
    { id: 'l3', text: '【抖音】打开页面超时', type: 'error' },
    { id: 'l4', text: '【抖音】打开页面超时', type: 'error' },
    { id: 'l5', text: '【抖音】采集任务已完成', type: 'success' },
    { id: 'l6', text: '检测到搜索结果开始加载，切换到下一个平台', type: 'info' },
  ],
  action: {
    message: '小红书提示您需要先登录才能继续搜索',
    buttons: [
      { id: 'b1', text: '我已经登录', primary: true, icon: 'check' },
      { id: 'b2', text: '跳过小红书' }
    ]
  },
  result: (
    <div className="flex flex-col gap-2">
      <div className="font-medium text-[15px] text-gray-900">批量搜索结果</div>
      <div className="text-[#22c55e] flex items-center gap-1.5 text-[14px] font-medium">
        <CheckCircle2 className="w-4 h-4" /> 成功获取回复的平台：
      </div>
      <div className="flex items-center gap-2 text-[14px] text-gray-800">
        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
          <Bot className="w-3 h-3" />
        </div>
        豆包 (doubao)
      </div>
      <div className="text-[14px] text-gray-700 mt-1">今日热点可爱狗狗相关内容：</div>
      <ol className="list-decimal pl-5 space-y-1.5 text-[14px] text-gray-700 marker:text-gray-500">
        <li>长沙“狗狗团伙”药店偷药事件 - 两只柯基分工明确，一只打掩护吸引店员注意，另一只仅用3秒精准叼走一盒咽炎片，被网友笑称“教科书级配合”。</li>
        <li>警犬执勤被摸内心戏 - 话题 #警犬明明看见人类摸我了# 登上微博热搜，阅读量高达440万。警犬被摸得一脸享受却强忍本能故作严肃，反差萌让网友直呼“根本拒绝不了”。</li>
        <li>三丽鸥「玉桂狗」愚人节企划 - 今日恰逢愚人节，三丽鸥官方发布玉桂狗新企划「长大后的我们，会变成什么样呢？」，可爱形象引发二次元圈热议。</li>
      </ol>
    </div>
  )
};

export function Sidebar() {
  const [tasks, setTasks] = useState<Task[]>([initialMockTask]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  const prevTaskCount = useRef(tasks.length);
  const isNewTaskAdded = useRef(false);

  if (tasks.length > prevTaskCount.current) {
    isNewTaskAdded.current = true;
  }
  prevTaskCount.current = tasks.length;

  useLayoutEffect(() => {
    const container = scrollRef.current;
    const spacer = spacerRef.current;
    if (!container || !spacer) return;

    if (tasks.length <= 1) {
      spacer.style.height = '0px';
      return;
    }

    const lastTask = document.getElementById(`task-${tasks[tasks.length - 1].id}`);
    if (!lastTask) return;

    const updateLayout = () => {
      const containerHeight = container.clientHeight;
      const lastTaskHeight = lastTask.offsetHeight;
      const needed = Math.max(0, containerHeight - lastTaskHeight - 48);
      spacer.style.height = `${needed}px`;
    };

    // Synchronously update spacer height in the DOM before paint
    updateLayout();

    // If a new task was added, scroll it to the top
    if (isNewTaskAdded.current) {
      isNewTaskAdded.current = false;
      // requestAnimationFrame ensures the browser has applied the new spacer height
      requestAnimationFrame(() => {
        lastTask.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    const observer = new ResizeObserver(() => {
      updateLayout();
    });

    observer.observe(container);
    observer.observe(lastTask);

    return () => observer.disconnect();
  }, [tasks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      prompt: inputValue.trim(),
      initialResponse: '好的，我正在为您处理...',
      status: 'running',
      createdAt: Date.now(),
      logs: [
        { id: Date.now() + '1', text: '【思考】正在分析您的请求...', type: 'thought' }
      ]
    };

    // Append the new task to the bottom of the list
    setTasks(prev => [...prev, newTask]);
    setInputValue('');

    // Simulate task progress
    setTimeout(() => {
      setTasks(prev => prev.map(t => {
        if (t.id === newTask.id) {
          return {
            ...t,
            logs: [...t.logs, { id: Date.now() + '2', text: '正在执行相关操作...', type: 'info' }]
          };
        }
        return t;
      }));
    }, 1500);

    setTimeout(() => {
      setTasks(prev => prev.map(t => {
        if (t.id === newTask.id) {
          return {
            ...t,
            status: 'completed',
            logs: [...t.logs, { id: Date.now() + '3', text: '任务执行完毕', type: 'success' }],
            result: (
              <div className="text-[14px] text-gray-800">
                这是模拟的执行结果。您可以通过输入新的任务来继续测试。
              </div>
            )
          };
        }
        return t;
      }));
    }, 3000);
  };

  const handleActionClick = (taskId: string, actionId: string) => {
    // Handle action button clicks (e.g., "我已经登录")
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'completed',
          logs: [...t.logs, { id: Date.now().toString(), text: '用户已确认操作，继续执行...', type: 'info' }]
        };
      }
      return t;
    }));
  };

  return (
    <div className="fixed right-4 top-4 bottom-4 w-[400px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 z-50 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 bg-white/80 backdrop-blur-sm z-10">
        <h2 className="text-[16px] font-medium text-gray-800">小豆芽助手</h2>
        <div className="flex items-center gap-3 text-gray-400">
          <button className="hover:text-gray-600 transition-colors">
            <Minus className="w-4 h-4" />
          </button>
          <button className="hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Task List (Scrollable) */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-8 bg-[#fafafa] relative"
      >
        {tasks.map(task => (
          <div id={`task-${task.id}`} key={task.id} className="scroll-mt-6 flex-shrink-0">
            <TaskBlock 
              task={task} 
              onActionClick={handleActionClick} 
            />
          </div>
        ))}
        {/* 动态底部占位空间：直接通过 ref 操作 DOM，避免 React 状态更新带来的渲染延迟和动画冲突 */}
        <div 
          ref={spacerRef}
          className="flex-shrink-0" 
          aria-hidden="true" 
        />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="输入任务指令..."
            className="w-full bg-gray-50 border border-gray-200 rounded-full pl-5 pr-12 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="absolute right-2 p-2 text-white bg-green-500 rounded-full hover:bg-green-600 disabled:opacity-50 disabled:hover:bg-green-500 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
