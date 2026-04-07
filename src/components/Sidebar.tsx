import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Leaf, X, Send, CheckCircle2, Bot } from 'lucide-react';
import { TaskBlock } from './TaskBlock';
import { Task } from '../types';

// Mock data to match the provided design
const initialMockTask: Task = {
  id: '1',
  prompt: '请帮我打开抖音，并搜索可爱狗狗',
  initialResponse: '好的，我来帮您打开抖音并搜索可爱狗狗。',
  status: 'completed',
  createdAt: Date.now(),
  logs: [
    { id: 'l1', text: '【思考】现在我将为你打开抖音的网页端，我将开始调用我的工具来帮助你完成本次任务的执行......', type: 'thought' },
    { id: 'l2', text: '【抖音】监测到搜索结果开始加载，切换到下一个平台', type: 'info' },
    { id: 'l3', text: '【抖音】打开页面超时', type: 'error' },
    { id: 'l4', text: '【抖音】打开页面超时', type: 'error' },
    { id: 'l5', text: '【抖音】采集任务已完成', type: 'success' },
    { id: 'l6', text: '监测到搜索结果开始加载，切换到下一个平台', type: 'info' },
  ],
  action: {
    message: '小红书提示您需要先登录才能继续搜索',
    buttons: [
      { id: 'b1', text: '我已经登陆', primary: true, icon: 'check' },
      { id: 'b2', text: '跳过小红书', icon: 'minus' }
    ]
  },
  result: (
    <div className="flex flex-col gap-3">
      <div className="text-[14px] text-gray-800">批量搜索结果：</div>
      
      <div className="flex flex-col gap-1">
        <div className="font-bold text-[15px] text-gray-900">一、豆包 (doubao)</div>
        <div className="text-[14px] text-gray-600 leading-relaxed">
          根据标题“小狗怎么还会阴阳怪气啊 #修狗 #小花花的每一天”及话题标签“修狗”“小花花的每一天”，可推测作品核心内容为：
          <span className="text-[#22c55e]">通过拟人化手法展现小狗的“阴阳怪气”行为</span>
          ，例如用动作、表情或声音模仿人类的“吐槽”“调侃”等日常互动场景（如主人叫小狗吃饭时故意拖延、对主人的行为“翻白眼”等）。
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-2">
        <div className="font-bold text-[15px] text-gray-900">二、Deepseek</div>
        <div className="text-[14px] text-gray-600 leading-relaxed space-y-1">
          <div><span className="text-[#22c55e]">1. 拟人化萌宠行为：</span>标题中“阴阳怪气”是核心亮点，将小狗行为与人类性格特征结合，赋予宠物“人性化”特质，符合用户对“萌宠有灵”的情感期待，易引发“可爱+有趣”的双重共鸣。</div>
          <div><span className="text-[#22c55e]">2. 日常真实感：</span>账号名称“小花花的每一天”及话题“小花花的每一天”暗示内容为宠物日常生活片段记录，真实、贴近用户的养宠体验，降低距离感，增强信任感。</div>
          <div><span className="text-[#22c55e]">3. 网络用语适配性：</span>话题标签“修狗”（网络对小狗的亲昵称呼）精准匹配年轻用户语言习惯，提升内容在同类兴趣群体中的传播效率。</div>
        </div>
      </div>
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
        <div className="flex items-center gap-2">
          <Leaf className="w-4 h-4 text-green-500 fill-green-500" />
          <h2 className="text-[15px] font-medium text-gray-800">小豆芽助手</h2>
        </div>
        <div className="flex items-center gap-3 text-gray-400">
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
