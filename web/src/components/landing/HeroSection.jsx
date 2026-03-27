/*
Copyright (C) 2025 QuantumNous
AGPL-3.0 License - see LICENSE for details.
*/

import React, { useState, useEffect, useCallback } from 'react';
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
          <span>{t('统一 AI 模型网关')}</span>
          <ArrowRight size={14} style={{ opacity: 0.5 }} />
        </div>

        {/* Main headline */}
        <h1
          className={`hero-title animate-fade-in-up ${isChinese ? 'tracking-wide' : ''}`}
        >
          <span className='hero-title-line1'>{t('统一的')}</span>
          <br />
          <span className='hero-title-gradient'>{t('大模型接口网关')}</span>
        </h1>

        {/* Subtitle */}
        <p className='hero-subtitle animate-fade-in' style={{ animationDelay: '0.15s' }}>
          {t('更好的价格，更好的稳定性，只需要将模型基址替换为：')}
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
