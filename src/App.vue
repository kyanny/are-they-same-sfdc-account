<template>
  <div id="app">
    <h1>SFDC Account Checker</h1>
    <p>URLを入力してSalesforceアカウントIDが同じかどうかを確認します</p>
    
    <div class="form-container">
      <textarea
        v-model="urlsInput"
        placeholder="複数のSalesforce URLを改行で区切って入力してください"
        rows="8"
        cols="80"
      ></textarea>
      
      <div class="button-container">
        <button @click="checkAccounts" class="check-btn">Check</button>
        <button @click="clearAll" class="clear-btn">Clear</button>
      </div>
      
      <div v-if="message" class="message" :class="messageClass">
        <span v-html="message"></span>
      </div>
      
      <div v-if="copiedMessage" class="copied-message">
        {{ copiedMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'App',
  setup() {
    const urlsInput = ref('')
    const message = ref('')
    const messageClass = ref('')
    const copiedMessage = ref('')
    
    const copyToClipboard = async (text) => {
      try {
        await navigator.clipboard.writeText(text)
        copiedMessage.value = 'Copied!'
        setTimeout(() => {
          copiedMessage.value = ''
        }, 2000)
      } catch (error) {
        console.error('Failed to copy to clipboard:', error)
        copiedMessage.value = 'Copy failed'
        setTimeout(() => {
          copiedMessage.value = ''
        }, 2000)
      }
    }
    
    const checkAccounts = () => {
      // エラーメッセージをクリア
      message.value = ''
      messageClass.value = ''
      copiedMessage.value = ''
      
      // URLが入力されていない場合
      if (!urlsInput.value.trim()) {
        message.value = 'URLを入力してください'
        messageClass.value = 'error'
        return
      }
      
      // 入力されたURLを改行で分割
      const urls = urlsInput.value.trim().split('\n').filter(url => url.trim())
      const ids = new Set()
      
      // 各URLからアカウントIDを抽出
      urls.forEach(url => {
        try {
          const urlObj = new URL(url.trim())
          const pathSegments = urlObj.pathname.split('/')
          
          // "001"で始まる要素を抽出
          pathSegments.forEach(segment => {
            if (segment.startsWith('001')) {
              ids.add(segment)
            }
          })
        } catch (error) {
          // 無効なURLは無視
          console.warn('Invalid URL:', url)
        }
      })
      
      // 結果を表示
      if (ids.size === 0) {
        message.value = 'アカウントIDが見つかりませんでした'
        messageClass.value = 'error'
      } else if (ids.size === 1) {
        const accountId = Array.from(ids)[0]
        const searchUrl = `https://github.com/search?q=user%3Agithub+%22${accountId}%22&type=issues&ref=advsearch`
        message.value = `They are same SFDC accounts! Account ID: <code>${accountId}</code><button class="copy-btn" onclick="window.copyAccountId('${accountId}')">📋</button><a href="${searchUrl}" target="_blank">🔗</a>`
        messageClass.value = 'success'
      } else {
        const accountIds = Array.from(ids).map(id => {
          const searchUrl = `https://github.com/search?q=user%3Agithub+%22${id}%22&type=issues&ref=advsearch`
          return `<code>${id}</code><button class="copy-btn" onclick="window.copyAccountId('${id}')">📋</button><a href="${searchUrl}" target="_blank">🔗</a>`
        }).join(', ')
        message.value = `They are different SFDC accounts! Account IDs: ${accountIds}`
        messageClass.value = 'warning'
      }
    }
    
    const clearAll = () => {
      urlsInput.value = ''
      message.value = ''
      messageClass.value = ''
      copiedMessage.value = ''
    }
    
    // グローバルにcopyAccountId関数を公開
    window.copyAccountId = copyToClipboard
    
    return {
      urlsInput,
      message,
      messageClass,
      copiedMessage,
      checkAccounts,
      clearAll,
      copyToClipboard
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin: 20px auto;
  max-width: 900px;
  padding: 20px;
}

h1 {
  color: #42b883;
  margin-bottom: 10px;
}

p {
  color: #666;
  margin-bottom: 30px;
}

.form-container {
  max-width: 100%;
}

textarea {
  width: 100%;
  padding: 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Courier New', monospace;
  resize: vertical;
  box-sizing: border-box;
  margin-bottom: 20px;
}

textarea:focus {
  outline: none;
  border-color: #42b883;
}

.button-container {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
}

button {
  padding: 12px 30px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.check-btn {
  background-color: #42b883;
  color: white;
}

.check-btn:hover {
  background-color: #369870;
  transform: translateY(-2px);
}

.clear-btn {
  background-color: #f8f9fa;
  color: #495057;
  border: 2px solid #dee2e6;
}

.clear-btn:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
}

.message {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  font-size: 16px;
  text-align: left;
  max-width: 100%;
  word-wrap: break-word;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.warning {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.message code {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
}

.message a {
  text-decoration: none;
  margin-left: 5px;
  font-size: 16px;
  display: inline-block;
  transition: transform 0.2s ease;
}

.message a:hover {
  transform: scale(1.2);
}

.copy-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  margin-left: 5px;
  margin-right: 5px;
  padding: 0;
  display: inline-block;
  transition: transform 0.2s ease;
}

.copy-btn:hover {
  transform: scale(1.2);
}

.copied-message {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  animation: fadeInOut 2s ease-in-out;
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(-10px); }
  20% { opacity: 1; transform: translateY(0); }
  80% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-10px); }
}

@media (max-width: 768px) {
  #app {
    margin: 10px;
    padding: 15px;
  }
  
  textarea {
    font-size: 12px;
  }
  
  .button-container {
    flex-direction: column;
    align-items: center;
  }
  
  button {
    width: 200px;
  }
}
</style>
