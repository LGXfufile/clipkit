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
      {/* 背景装饰元素 - 更微妙 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-blue-400/15 to-purple-600/15 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-tr from-pink-400/15 to-blue-500/15 blur-3xl"></div>
      </div>

      {/* 紧凑型顶部导航栏 */}
      <header className="relative z-10 bg-white/70 backdrop-blur-xl border-b border-white/30 sticky top-0">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo和标题 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                  ClipKit
                </h1>
                <p className="text-sm text-gray-600">隐私至上的剪贴板管理器</p>
              </div>
            </div>

            {/* 状态和操作区域 */}
            <div className="flex items-center gap-4">
              {history.length > 0 && (
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>{history.length} 条记录</span>
                </div>
              )}
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 rounded-xl transition-all duration-300 font-medium shadow-sm hover:shadow-md text-sm"
                >
                  清空全部
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-6">
        {showWelcome ? (
          /* 紧凑型欢迎界面 */
          <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-120px)]">
            {/* 左侧：欢迎内容 */}
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent mb-4 leading-tight">
                  重新定义<br />剪贴板体验
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed mb-6">
                  <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-semibold">极简、私密、强大</span>
                  <br />复制任何内容，智能管理，一键复用
                </p>
              </div>

              {/* 功能特色 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">隐私至上</h3>
                    <p className="text-sm text-gray-600">所有数据仅存储在您的设备上</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">实时同步</h3>
                    <p className="text-sm text-gray-600">自动监控剪贴板变化</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M13 7h6l2 2-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">智能识别</h3>
                    <p className="text-sm text-gray-600">自动分类不同类型的内容</p>
                  </div>
                </div>
              </div>

              {/* 提示信息 */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100/50">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">开始使用</h3>
                    <p className="text-blue-800 text-sm">
                      复制任何文本即可开始。点击下方任意内容将其复制到剪贴板。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：预览区域 */}
            <div className="lg:pl-8">
              <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-2xl shadow-gray-300/25">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">剪贴板历史</h3>
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">准备就绪</div>
                </div>
                
                {/* 模拟的剪贴板条目 */}
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <span className="text-xs">📝</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">您的剪贴板内容将显示在这里...</p>
                        <p className="text-xs text-gray-400 mt-1">点击即可复制</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 opacity-40">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                        <span className="text-xs">🔗</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">URL链接自动识别</p>
                        <p className="text-xs text-gray-400 mt-1">刚刚</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 剪贴板内容区域 */
          <div className="min-h-[calc(100vh-120px)]">
            <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-2xl shadow-gray-300/25">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">剪贴板历史</h2>
                  <p className="text-gray-600 text-sm">最近复制的 {history.length} 条内容</p>
                </div>
              </div>

              <div className="grid gap-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                {history.map((item, index) => (
                  <div
                    key={item.id}
                    className="transform transition-all duration-300 ease-out animate-fade-in-up"
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
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
