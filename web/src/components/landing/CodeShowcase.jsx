/*
Copyright (C) 2025 QuantumNous
AGPL-3.0 License - see LICENSE for details.
*/

import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check } from 'lucide-react';
import { copy, showSuccess } from '../../helpers';

const tabs = [
  { key: 'python', label: 'Python' },
  { key: 'node', label: 'Node.js' },
  { key: 'curl', label: 'cURL' },
];

const getCode = (lang, baseUrl) => {
  const codes = {
    python: `from openai import OpenAI

client = OpenAI(
    base_url="${baseUrl}/v1",
    api_key="sk-your-api-key"
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`,
    node: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: '${baseUrl}/v1',
  apiKey: 'sk-your-api-key',
});

const response = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hello!' }],
});
console.log(response.choices[0].message.content);`,
    curl: `curl ${baseUrl}/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'`,
  };
  return codes[lang] || '';
};

const CodeShowcase = ({ serverAddress }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('python');
  const [copied, setCopied] = useState(false);

  const code = getCode(activeTab, serverAddress);

  const handleCopy = useCallback(async () => {
    const ok = await copy(code);
    if (ok) {
      setCopied(true);
      showSuccess(t('已复制到剪切板'));
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code, t]);

  return (
    <section className='code-section'>
      <div className='code-section-inner'>
        {/* Left: description */}
        <div className='code-desc'>
          <h2 className='code-desc-title'>
            {t('几行代码')}<br />
            <span className='gradient-text'>{t('即刻接入')}</span>
          </h2>
          <p className='code-desc-text'>
            {t('完全兼容 OpenAI SDK，无需修改现有代码，只需替换 base_url 即可接入 40+ AI 模型供应商。')}
          </p>
          <div className='code-desc-features'>
            <div className='code-desc-feature'>
              <span className='code-desc-check'>✓</span>
              {t('兼容 OpenAI / Anthropic / Google 协议')}
            </div>
            <div className='code-desc-feature'>
              <span className='code-desc-check'>✓</span>
              {t('支持 Python / Node.js / Go / Java 等全语言')}
            </div>
            <div className='code-desc-feature'>
              <span className='code-desc-check'>✓</span>
              {t('流式传输 & Function Calling 完整支持')}
            </div>
          </div>
        </div>

        {/* Right: code editor */}
        <div className='code-editor'>
          {/* Tabs + copy */}
          <div className='code-editor-header'>
            <div className='code-editor-tabs'>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`code-editor-tab ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button onClick={handleCopy} className='code-editor-copy'>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? t('已复制') : t('复制')}</span>
            </button>
          </div>

          {/* Code body */}
          <div className='code-editor-body'>
            <pre className='code-editor-pre'>
              <code>{code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeShowcase;
