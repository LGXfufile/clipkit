import React, { useState, useEffect } from 'react';

const ClipboardItem = ({ item, onCopy }) => {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleCopy = async () => {
    const success = await onCopy(item.text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return '刚刚';
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}小时前`;
    
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 120) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getContentType = (text) => {
    const urlPattern = /^(https?:\/\/)|(www\.)/i;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
    
    if (urlPattern.test(text.trim())) return { type: 'url', icon: '🔗', color: 'blue' };
    if (emailPattern.test(text.trim())) return { type: 'email', icon: '📧', color: 'emerald' };
    if (phonePattern.test(text.trim())) return { type: 'phone', icon: '📱', color: 'purple' };
    if (text.includes('\n')) return { type: 'multiline', icon: '📄', color: 'orange' };
    if (/^\d+$/.test(text.trim())) return { type: 'number', icon: '🔢', color: 'cyan' };
    return { type: 'text', icon: '📝', color: 'gray' };
  };

  const contentType = getContentType(item.text);

  return (
    <div 
      onClick={handleCopy}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative overflow-hidden cursor-pointer 
        bg-white/50 backdrop-blur-xl border border-white/30 rounded-2xl p-5
        hover:bg-white/70 hover:border-white/50 hover:shadow-xl hover:shadow-gray-200/25
        transform transition-all duration-300 ease-out
        ${isHovered ? 'scale-[1.02] -translate-y-1' : ''}
        ${copied ? 'ring-2 ring-green-400/50' : ''}
      `}
    >
      <div className="flex items-start gap-4">
        {/* 内容类型图标 */}
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
          bg-gradient-to-br text-white shadow-lg
          ${contentType.color === 'blue' ? 'from-blue-400 to-blue-600' : ''}
          ${contentType.color === 'emerald' ? 'from-emerald-400 to-emerald-600' : ''}
          ${contentType.color === 'purple' ? 'from-purple-400 to-purple-600' : ''}
          ${contentType.color === 'orange' ? 'from-orange-400 to-orange-600' : ''}
          ${contentType.color === 'cyan' ? 'from-cyan-400 to-cyan-600' : ''}
          ${contentType.color === 'gray' ? 'from-gray-400 to-gray-600' : ''}
        `}>
          <span className="text-sm">{contentType.icon}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          {/* 文本内容 */}
          <div className="mb-3">
            <p className="text-gray-900 text-sm leading-relaxed whitespace-pre-wrap break-words font-medium">
              {truncateText(item.text)}
            </p>
          </div>
          
          {/* 底部信息栏 */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
              {formatTime(item.timestamp)}
            </span>
            
            <div className="flex items-center gap-2">
              {copied ? (
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold">已复制</span>
                </div>
              ) : (
                <div className={`
                  flex items-center gap-1.5 transition-all duration-200
                  ${isHovered ? 'text-blue-600' : 'text-gray-400'}
                `}>
                  <div className={`
                    w-4 h-4 rounded-full flex items-center justify-center transition-colors
                    ${isHovered ? 'bg-blue-100' : 'bg-gray-100'}
                  `}>
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium">点击复制</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* 成功复制的覆盖层 */}
      {copied && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/90 to-green-50/90 backdrop-blur-sm border border-emerald-200 rounded-2xl flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center animate-pulse">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-emerald-800 font-semibold">内容已复制到剪贴板</span>
          </div>
        </div>
      )}
      
      {/* 悬浮时的微光效果 */}
      {isHovered && !copied && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full animate-[shimmer_1.5s_ease-out] pointer-events-none"></div>
      )}
    </div>
  );
};

export default ClipboardItem;