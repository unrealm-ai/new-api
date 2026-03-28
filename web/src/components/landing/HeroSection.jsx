/*
Copyright (C) 2025 QuantumNous
AGPL-3.0 License - see LICENSE for details.
*/

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Copy, Check, ArrowRight, BookOpen } from 'lucide-react';
import { copy, showSuccess } from '../../helpers';
import { API_ENDPOINTS } from '../../constants/common.constant';

const HeroSection = ({
  serverAddress,
  isDemoSiteMode,
  docsLink,
  version,
}) => {
  const { t, i18n } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [endpointIndex, setEndpointIndex] = useState(0);
  const isChinese = i18n.language.startsWith('zh');

  // 打字机轮播副标题
  const subtitles = [
    t('一个端点聚合主流大模型，内置路由调度与故障自愈'),
    t('兼容 OpenAI 协议，迁移零成本，无需改动一行代码'),
    t('智能负载均衡，自动故障转移，99.9% 服务可用性'),
    t('按 Token 精确计费，多维度用量统计，成本一目了然'),
  ];
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const currentText = subtitles[subtitleIndex];

    if (!isDeleting) {
      // 打字阶段
      if (displayText.length < currentText.length) {
        timerRef.current = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, 80);
      } else {
        // 打完后停顿 2.5 秒再开始删除
        timerRef.current = setTimeout(() => setIsDeleting(true), 2500);
      }
    } else {
      // 删除阶段
      if (displayText.length > 0) {
        timerRef.current = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 30);
      } else {
        // 删完后停顿 800ms 再切换到下一句
        timerRef.current = setTimeout(() => {
          setIsDeleting(false);
          setSubtitleIndex((prev) => (prev + 1) % subtitles.length);
        }, 800);
      }
    }

    return () => clearTimeout(timerRef.current);
  }, [displayText, isDeleting, subtitleIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setEndpointIndex((prev) => (prev + 1) % API_ENDPOINTS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = useCallback(async () => {
    const ok = await copy(serverAddress);
    if (ok) {
      setCopied(true);
      showSuccess(t('已复制到剪切板'));
      setTimeout(() => setCopied(false), 2000);
    }
  }, [serverAddress, t]);

  return (
    <section className='hero-section relative min-h-screen flex items-center justify-center overflow-hidden'>
      {/* Animated gradient mesh background */}
      <div className='hero-mesh-bg' />

      {/* Grid overlay */}
      <div className='absolute inset-0 hero-grid-overlay' />

      {/* Floating orbs */}
      <div className='hero-orb hero-orb-1' />
      <div className='hero-orb hero-orb-2' />
      <div className='hero-orb hero-orb-3' />

      {/* Content */}
      <div className='relative z-10 max-w-5xl mx-auto px-6 py-24 md:py-32 text-center'>
        {/* Status badge */}
        <div className='hero-badge animate-fade-in'>
          <span className='hero-badge-dot' />
          <span>{t('AI 模型基础设施')}</span>
          <ArrowRight size={14} style={{ opacity: 0.5 }} />
        </div>

        {/* Main headline */}
        <h1
          className={`hero-title animate-fade-in-up ${isChinese ? 'tracking-wide' : ''}`}
        >
          <span className='hero-title-line1'>{t('模型在变')}</span>
          <br />
          <span className='hero-title-gradient'>{t('你的代码不变')}</span>
        </h1>

        {/* Typewriter subtitle */}
        <p className='hero-subtitle animate-fade-in' style={{ animationDelay: '0.15s', minHeight: '1.6em' }}>
          <span>{displayText}</span>
          <span className='hero-typewriter-cursor'>|</span>
        </p>

        {/* Terminal-style API box */}
        <div className='hero-terminal animate-fade-in-up' style={{ animationDelay: '0.25s' }}>
          {/* Terminal header */}
          <div className='hero-terminal-header'>
            <div className='hero-terminal-dots'>
              <span className='hero-terminal-dot' style={{ background: '#ff5f57' }} />
              <span className='hero-terminal-dot' style={{ background: '#febc2e' }} />
              <span className='hero-terminal-dot' style={{ background: '#28c840' }} />
            </div>
            <span className='hero-terminal-title'>Terminal</span>
            <div style={{ width: 52 }} />
          </div>

          {/* Terminal body */}
          <div className='hero-terminal-body'>
            <div className='hero-terminal-line'>
              <span className='hero-terminal-prompt'>$</span>
              <span className='hero-terminal-cmd'>curl</span>
              <span className='hero-terminal-url'>{serverAddress}</span>
              <span className='hero-terminal-endpoint'>
                {API_ENDPOINTS[endpointIndex]}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className='hero-terminal-copy'
              title={t('复制')}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* CTA buttons */}
        <div className='hero-cta animate-fade-in' style={{ animationDelay: '0.35s' }}>
          <Link to='/console'>
            <button className='hero-btn-primary'>
              <span>{t('获取密钥')}</span>
              <ArrowRight size={18} />
            </button>
          </Link>

          {isDemoSiteMode && version ? (
            <a
              href='https://github.com/QuantumNous/new-api'
              target='_blank'
              rel='noopener noreferrer'
            >
              <button className='hero-btn-secondary'>
                <span>GitHub</span>
                <span className='hero-btn-badge'>{version}</span>
              </button>
            </a>
          ) : (
            docsLink && (
              <a href={docsLink} target='_blank' rel='noopener noreferrer'>
                <button className='hero-btn-secondary'>
                  <BookOpen size={18} />
                  <span>{t('文档')}</span>
                </button>
              </a>
            )
          )}
        </div>
      </div>

      {/* Bottom fade */}
      <div className='hero-bottom-fade' />
    </section>
  );
};

export default HeroSection;
