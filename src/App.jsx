import React, { useState, useEffect, useCallback } from 'react';
import ClipboardItem from './components/ClipboardItem';
import { ClipboardManager } from './utils/clipboard';

function App() {
  const [history, setHistory] = useState([]);
  const [isSupported, setIsSupported] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [lastClipboardCheck, setLastClipboardCheck] = useState('');

  // 初始化
  useEffect(() => {
    const supported = ClipboardManager.isClipboardAPISupported();
    setIsSupported(supported);
    
    const savedHistory = ClipboardManager.getHistory();
    setHistory(savedHistory);
    setShowWelcome(savedHistory.length === 0);
  }, []);

  // 监听剪贴板变化
  const checkClipboard = useCallback(async () => {
    if (!isSupported) return;
    
    try {
      const currentClipboard = await ClipboardManager.readFromClipboard();
      if (currentClipboard && currentClipboard !== lastClipboardCheck && currentClipboard.trim()) {
        ClipboardManager.addItem(currentClipboard);
        const updatedHistory = ClipboardManager.getHistory();
        setHistory(updatedHistory);
        setLastClipboardCheck(currentClipboard);
        setShowWelcome(false);
      }
    } catch (error) {
      // 静默处理错误，避免过多提示
    }
  }, [isSupported, lastClipboardCheck]);

  // 定期检查剪贴板（需要用户交互后才能工作）
  useEffect(() => {
    let interval;
    
    const startMonitoring = () => {
      interval = setInterval(checkClipboard, 1000);
    };

    // 用户首次点击后开始监听
    const handleUserInteraction = () => {
      startMonitoring();
      document.removeEventListener('click', handleUserInteraction);
    };

    if (isSupported) {
      document.addEventListener('click', handleUserInteraction);
    }

    return () => {
      if (interval) clearInterval(interval);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, [checkClipboard, isSupported]);

  // 复制到剪贴板
  const handleCopyToClipboard = async (text) => {
    return await ClipboardManager.copyToClipboard(text);
  };

  // 清空历史记录
  const handleClearHistory = () => {
    ClipboardManager.clearHistory();
    setHistory([]);
    setShowWelcome(true);
  };

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">ClipKit</h1>
          <p className="text-gray-600">
            Your browser doesn't support the Clipboard API. Please use a modern browser like Chrome, Firefox, or Safari.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50">
      {/* 极简背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-400/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-purple-400/5 blur-3xl"></div>
      </div>

      {/* 顶部导航 */}
      <header className="relative z-10 px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-gray-900">ClipKit</h1>
          </div>
          
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="px-4 py-2 text-sm text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-300 rounded-lg transition-colors duration-200"
            >
              清空
            </button>
          )}
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="relative z-10 px-6">
        <div className="max-w-4xl mx-auto">
          
          {showWelcome ? (
            <div className="text-center py-16">
              {/* 主标题 */}
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                优雅的剪贴板管理
              </h2>
              <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                安全、私密、智能。让您的复制粘贴工作流程变得更加高效。
              </p>

              {/* 功能亮点 */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">隐私保护</h3>
                  <p className="text-gray-600 text-sm">数据仅存储在本地设备</p>
                </div>

                <div className="text-center">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">自动同步</h3>
                  <p className="text-gray-600 text-sm">实时监控剪贴板变化</p>
                </div>

                <div className="text-center">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">简约美观</h3>
                  <p className="text-gray-600 text-sm">精心设计的用户体验</p>
                </div>
              </div>

              {/* 开始提示 */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-lg mx-auto">
                <h4 className="font-semibold text-blue-900 mb-2">开始使用</h4>
                <p className="text-blue-800 text-sm">
                  复制任何文本，它会自动出现在这里。点击任何条目可重新复制。
                </p>
              </div>
            </div>
          ) : (
            <div className="py-8">
              {/* 内容标题 */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">剪贴板历史</h2>
                <p className="text-gray-600">{history.length} 条记录</p>
              </div>

              {/* 剪贴板列表 */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {history.map((item, index) => (
                  <div
                    key={item.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ClipboardItem
                      item={item}
                      onCopy={handleCopyToClipboard}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 底部 */}
      <footer className="relative z-10 text-center py-8 mt-16">
        <p className="text-sm text-gray-500">
          ClipKit · 让剪贴板管理变得优雅
        </p>
      </footer>
    </div>
  );
}

export default App;
