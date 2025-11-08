// 剪贴板管理类
export class ClipboardManager {
  static STORAGE_KEY = 'clipkit_history';
  static MAX_ITEMS = 30;

  // 获取剪贴板历史记录
  static getHistory() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load clipboard history:', error);
      return [];
    }
  }

  // 添加新的剪贴板项
  static addItem(text) {
    const history = this.getHistory();
    
    // 避免重复添加相同内容
    if (history.length > 0 && history[0].text === text) {
      return;
    }

    const newItem = {
      id: Date.now().toString() + Math.random(),
      text: text.trim(),
      timestamp: Date.now(),
    };

    // 添加到开头，保持最近的在前面
    const updatedHistory = [newItem, ...history].slice(0, this.MAX_ITEMS);
    
    this.saveHistory(updatedHistory);
  }

  // 保存历史记录到 localStorage
  static saveHistory(history) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save clipboard history:', error);
    }
  }

  // 清空所有历史记录
  static clearHistory() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // 复制文本到剪贴板
  static async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }

  // 读取当前剪贴板内容
  static async readFromClipboard() {
    try {
      return await navigator.clipboard.readText();
    } catch (error) {
      console.error('Failed to read from clipboard:', error);
      return null;
    }
  }

  // 检查剪贴板 API 是否可用
  static isClipboardAPISupported() {
    return 'clipboard' in navigator && 'readText' in navigator.clipboard;
  }
}