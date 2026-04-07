/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sidebar } from './components/Sidebar';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">主应用区域</h1>
        <p className="text-gray-600 text-lg">
          这是一个模拟的主应用界面。右侧是“小豆芽助手”侧边栏弹窗。
          <br />
          您可以尝试在右侧输入框中发起新的任务，新任务会按照要求顶在最上方。
        </p>
      </div>
      
      {/* 渲染侧边栏 */}
      <Sidebar />
    </div>
  );
}
