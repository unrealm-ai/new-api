/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API, showError } from '../../helpers';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { StatusContext } from '../../context/Status';
import { useActualTheme } from '../../context/Theme';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import NoticeModal from '../../components/layout/NoticeModal';
import { ArrowRight, Copy, Check } from 'lucide-react';

const Home = () => {
  const { t, i18n } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const actualTheme = useActualTheme();
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const isMobile = useIsMobile();
  const serverAddress =
    statusState?.status?.server_address || `${window.location.origin}`;

  const displayHomePageContent = async () => {
    setHomePageContent(localStorage.getItem('home_page_content') || '');
    const res = await API.get('/api/home_page_content');
    const { success, message, data } = res.data;
    if (success) {
      let content = data;
      if (!data.startsWith('https://')) {
        content = marked.parse(data);
      }
      setHomePageContent(content);
      localStorage.setItem('home_page_content', content);

      if (data.startsWith('https://')) {
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.onload = () => {
            iframe.contentWindow.postMessage({ themeMode: actualTheme }, '*');
            iframe.contentWindow.postMessage({ lang: i18n.language }, '*');
          };
        }
      }
    } else {
      showError(message);
      setHomePageContent('');
    }
    setHomePageContentLoaded(true);
  };

  useEffect(() => {
    const checkNoticeAndShow = async () => {
      const lastCloseDate = localStorage.getItem('notice_close_date');
      const today = new Date().toDateString();
      if (lastCloseDate !== today) {
        try {
          const res = await API.get('/api/notice');
          const { success, data } = res.data;
          if (success && data && data.trim() !== '') {
            setNoticeVisible(true);
          }
        } catch (error) {
          console.error('Failed to fetch notice:', error);
        }
      }
    };
    checkNoticeAndShow();
  }, []);

  useEffect(() => {
    displayHomePageContent().then();
  }, []);

  const handleCopyCode = () => {
    const code = `from openai import OpenAI

client = OpenAI(
    base_url="${serverAddress}/v1",
    api_key="sk-..."
)

response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[{"role": "user", "content": "Hello"}]
)

print(response.choices[0].message.content)`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Custom homepage content from admin
  if (homePageContentLoaded && homePageContent !== '') {
    return (
      <div className='w-full overflow-x-hidden'>
        <NoticeModal
          visible={noticeVisible}
          onClose={() => setNoticeVisible(false)}
          isMobile={isMobile}
        />
        {homePageContent.startsWith('https://') ? (
          <iframe
            src={homePageContent}
            className='w-full h-screen border-none'
          />
        ) : (
          <div
            className='mt-[60px]'
            dangerouslySetInnerHTML={{ __html: homePageContent }}
          />
        )}
      </div>
    );
  }

  return (
    <div className='w-full overflow-x-hidden' style={{ background: 'var(--tcw-bg)' }}>
      <NoticeModal
        visible={noticeVisible}
        onClose={() => setNoticeVisible(false)}
        isMobile={isMobile}
      />

      {/* ── Section 1: Hero ── */}
      <section
        className='relative min-h-screen flex items-center justify-center'
        style={{ background: 'var(--tcw-bg)' }}
      >
        {/* Noise */}
        <div
          className='absolute inset-0 pointer-events-none'
          style={{
            opacity: 'var(--tcw-noise-opacity)',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' fill=\'white\'/%3E%3C/svg%3E")',
            backgroundSize: '200px 200px',
          }}
        />

        <div className='relative z-10 max-w-3xl mx-auto px-6 text-center'>
          <h1
            className='text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[0.9] mb-8'
            style={{ color: 'var(--tcw-heading)' }}
          >
            The API
            <br />
            you can <span style={{ color: 'var(--pricing-accent)' }}>verify</span>.
          </h1>

          <p
            className='text-base sm:text-lg md:text-xl leading-relaxed mb-12 max-w-md mx-auto'
            style={{ color: 'var(--tcw-body)' }}
          >
            {t('统一 API 接入 Claude, GPT —— 官方直连，零掺水。')}
          </p>

          <Link to='/console/token'>
            <button
              className='inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-85'
              style={{
                background: 'var(--pricing-accent)',
                color: '#fff',
              }}
            >
              {t('获取 API Key')}
              <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>

      {/* ── Section 2: Value propositions ── */}
      <section style={{ background: 'var(--tcw-bg)' }}>
        <div
          className='max-w-5xl mx-auto px-6'
          style={{
            borderTop: '1px solid var(--tcw-card-border)',
            borderBottom: '1px solid var(--tcw-card-border)',
          }}
        >
          <div className='grid grid-cols-1 md:grid-cols-3'>
            {[
              {
                value: t('官方直连'),
                label: 'AWS Bedrock',
                desc: t('无号池 · 无逆向 · 无掺水'),
              },
              {
                value: '99.9%',
                label: t('服务可用性'),
                desc: t('书面 SLA 承诺'),
              },
              {
                value: '<100ms',
                label: t('转发延迟'),
                desc: t('P99 端到端'),
              },
            ].map((item, i) => (
              <div
                key={i}
                className='py-14 md:py-20 px-6 md:px-10 text-center'
                style={{
                  borderRight: i < 2 && !isMobile ? '1px solid var(--tcw-card-border)' : 'none',
                  borderBottom: i < 2 && isMobile ? '1px solid var(--tcw-card-border)' : 'none',
                }}
              >
                <div
                  className='text-3xl md:text-4xl font-bold tracking-tight mb-2'
                  style={{ color: 'var(--tcw-heading)' }}
                >
                  {item.value}
                </div>
                <div
                  className='text-sm font-mono tracking-wide uppercase mb-3'
                  style={{ color: 'var(--tcw-sub)' }}
                >
                  {item.label}
                </div>
                <div
                  className='text-sm'
                  style={{ color: 'var(--tcw-body)' }}
                >
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Code ── */}
      <section
        className='py-24 md:py-32'
        style={{ background: 'var(--tcw-bg)' }}
      >
        <div className='max-w-5xl mx-auto px-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start'>
            {/* Left: text */}
            <div className='lg:pt-8'>
              <h2
                className='text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-6'
                style={{ color: 'var(--tcw-heading)' }}
              >
                {t('几行代码')}
                <br />
                <span style={{ color: 'var(--pricing-accent)' }}>
                  {t('即刻接入。')}
                </span>
              </h2>
              <p
                className='text-base leading-relaxed mb-8'
                style={{ color: 'var(--tcw-body)' }}
              >
                {t('完全兼容 OpenAI SDK，无需修改现有代码，只需替换 base_url。')}
              </p>
              <div className='space-y-3'>
                {[
                  t('兼容 OpenAI / Anthropic / Google 协议'),
                  t('支持 Python / Node.js / Go / Java / cURL'),
                  t('流式传输 & Function Calling 完整支持'),
                ].map((line, i) => (
                  <div key={i} className='flex items-start gap-3'>
                    <span
                      className='text-xs mt-1 flex-shrink-0'
                      style={{ color: 'var(--pricing-accent)' }}
                    >
                      &#x2713;
                    </span>
                    <span
                      className='text-sm'
                      style={{ color: 'var(--tcw-body)' }}
                    >
                      {line}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: code block */}
            <div
              className='rounded-xl overflow-hidden'
              style={{
                border: '1px solid var(--tcw-card-border)',
              }}
            >
              {/* Header */}
              <div
                className='flex items-center justify-between px-4 py-2.5'
                style={{
                  borderBottom: '1px solid var(--tcw-card-border)',
                }}
              >
                <span
                  className='text-xs font-mono'
                  style={{ color: 'var(--tcw-sub)' }}
                >
                  main.py
                </span>
                <button
                  onClick={handleCopyCode}
                  className='flex items-center gap-1.5 text-xs transition-colors cursor-pointer'
                  style={{ color: 'var(--tcw-sub)', background: 'none', border: 'none' }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? t('已复制') : t('复制')}
                </button>
              </div>
              {/* Code */}
              <pre
                className='p-5 text-[13px] leading-[1.75] overflow-x-auto'
                style={{
                  color: 'var(--tcw-heading)',
                  fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", monospace',
                  margin: 0,
                  background: 'transparent',
                }}
              >
                <code>{`from openai import OpenAI

client = OpenAI(
    base_url="${serverAddress}/v1",
    api_key="sk-..."
)

response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[{"role": "user", "content": "Hello"}]
)

print(response.choices[0].message.content)`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
