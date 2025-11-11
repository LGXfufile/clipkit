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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-pink-400/20 to-blue-500/20 blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo & Brand */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/25 mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-6xl md:text-7xl font-semibold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent mb-6 tracking-tight">
              ClipKit
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 font-light mb-8 max-w-3xl mx-auto leading-relaxed">
              重新定义剪贴板体验。<br />
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-medium">极简、私密、强大</span>
            </p>
          </div>

          {/* 特色功能卡片 */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            <div className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl shadow-gray-200/50">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">隐私至上</h3>
              <p className="text-sm text-gray-600">所有数据仅存储在您的设备上，绝不上传到服务器</p>
            </div>

            <div className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl shadow-gray-200/50">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">实时同步</h3>
              <p className="text-sm text-gray-600">自动监控剪贴板变化，无需手动操作</p>
            </div>

            <div className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl shadow-gray-200/50">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M13 7h6l2 2-6 6" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">优雅设计</h3>
              <p className="text-sm text-gray-600">精致的界面设计，提升您的使用体验</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
        {showWelcome ? (
          <div className="text-center py-16">
            <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-12 shadow-2xl shadow-gray-300/25 max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-6">
                开始使用 ClipKit
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                复制任何文本，它将自动出现在这里。<br />
                点击任何条目即可重新复制到剪贴板。
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100/50">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-blue-900">100% 本地存储</h3>
                </div>
                <p className="text-blue-800 text-sm">
                  您的数据永远不会离开设备，保证隐私和安全。
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-2xl shadow-gray-300/25">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  剪贴板历史
                </h2>
                <p className="text-gray-600">共 {history.length} 条记录 (最多存储 30 条)</p>
              </div>
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 rounded-xl transition-all duration-300 font-medium shadow-sm hover:shadow-md"
                >
                  清空全部
                </button>
              )}
            </div>

            <div className="space-y-4">
              {history.map((item, index) => (
                <div
                  key={item.id}
                  className="transform transition-all duration-300 ease-out"
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
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
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/20 bg-white/40 backdrop-blur-xl mt-20">
        <div className="max-w-5xl mx-auto px-6 py-12 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">
              © 2025 ClipKit · 隐私至上的剪贴板管理器
            </p>
          </div>
          <p className="text-sm text-gray-500">
            为数字工作者精心设计 · 让剪贴板管理变得优雅
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
