/*
Copyright (C) 2025 QuantumNous
AGPL-3.0 License - see LICENSE for details.
*/

import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { API, showError, getSystemName, getLogo } from '../../helpers';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import { StatusContext } from '../../context/Status';
import {
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  Code2,
  Globe,
  GitBranch,
} from 'lucide-react';
import FooterBar from '../../components/layout/Footer';

const About = () => {
  const { t } = useTranslation();
  const [about, setAbout] = useState('');
  const [aboutLoaded, setAboutLoaded] = useState(false);
  const [statusState] = useContext(StatusContext);
  const systemName = getSystemName();
  const logo = getLogo();
  const currentYear = new Date().getFullYear();
  const version = statusState?.status?.version || '';

  const displayAbout = async () => {
    setAbout(localStorage.getItem('about') || '');
    const res = await API.get('/api/about');
    const { success, message, data } = res.data;
    if (success) {
      let aboutContent = data;
      if (!data.startsWith('https://')) {
        aboutContent = marked.parse(data);
      }
      setAbout(aboutContent);
      localStorage.setItem('about', aboutContent);
    } else {
      showError(message);
      setAbout('');
    }
    setAboutLoaded(true);
  };

  useEffect(() => {
    displayAbout().then();
  }, []);

  const capabilities = [
    {
      icon: <Zap size={24} />,
      title: t('统一接入'),
      desc: t('一个端点聚合主流大模型，标准 OpenAI 协议，迁移零成本'),
    },
    {
      icon: <Shield size={24} />,
      title: t('高可用'),
      desc: t('智能负载均衡与自动故障转移，99.9% 服务可用性保障'),
    },
    {
      icon: <BarChart3 size={24} />,
      title: t('精确计费'),
      desc: t('按 Token 精确计量，多维度用量统计，成本透明可控'),
    },
    {
      icon: <Code2 size={24} />,
      title: t('开发者友好'),
      desc: t('完善的 API 文档与 SDK，分钟级接入，专注业务逻辑'),
    },
    {
      icon: <Globe size={24} />,
      title: t('多供应商'),
      desc: t('覆盖 OpenAI、Claude、Gemini、通义等 40+ 主流供应商'),
    },
    {
      icon: <GitBranch size={24} />,
      title: t('开源驱动'),
      desc: t('基于开源构建，社区驱动迭代，代码透明可审计'),
    },
  ];

  // 如果管理员配置了自定义关于内容，优先展示
  if (aboutLoaded && about !== '') {
    return (
      <div className='mt-[60px] px-2'>
        {about.startsWith('https://') ? (
          <iframe
            src={about}
            style={{ width: '100%', height: '100vh', border: 'none' }}
          />
        ) : (
          <div
            style={{ fontSize: 'larger' }}
            dangerouslySetInnerHTML={{ __html: about }}
          />
        )}
      </div>
    );
  }

  return (
    <div className='w-full overflow-x-hidden'>
      <div className='landing-page'>
        {/* Hero */}
        <section
          className='relative min-h-[60vh] flex items-center justify-center overflow-hidden'
          style={{ backgroundColor: 'var(--landing-bg-0)' }}
        >
          <div className='hero-mesh-bg' />
          <div className='absolute inset-0 hero-grid-overlay' />

          <div className='relative z-10 max-w-4xl mx-auto px-6 py-24 md:py-32 text-center'>
            <div className='flex items-center justify-center gap-3 mb-8'>
              {logo && (
                <img
                  src={logo}
                  alt={systemName}
                  className='w-12 h-12 rounded-lg object-contain'
                />
              )}
              <h1
                className='text-4xl md:text-5xl font-bold'
                style={{ color: 'var(--landing-text-0)' }}
              >
                {t('关于')}{' '}
                <span className='gradient-text'>{systemName}</span>
              </h1>
            </div>
            <p
              className='text-lg md:text-xl max-w-2xl mx-auto leading-relaxed'
              style={{ color: 'var(--landing-text-2)' }}
            >
              {t('面向开发者与企业的 AI 模型统一接入平台，一个端点连接所有主流大模型。')}
            </p>
            {version && (
              <div
                className='inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-md text-sm'
                style={{
                  backgroundColor: 'var(--landing-bg-2)',
                  color: 'var(--landing-text-2)',
                  border: '1px solid var(--landing-border)',
                }}
              >
                <span>{t('当前版本')}</span>
                <span
                  className='font-mono font-medium'
                  style={{ color: 'var(--landing-text-0)' }}
                >
                  {version}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Capabilities */}
        <section
          className='py-20 md:py-28'
          style={{ backgroundColor: 'var(--landing-bg-1)' }}
        >
          <div className='max-w-6xl mx-auto px-6'>
            <h2
              className='text-2xl md:text-3xl font-bold text-center mb-4'
              style={{ color: 'var(--landing-text-0)' }}
            >
              {t('核心能力')}
            </h2>
            <p
              className='text-center mb-12 md:mb-16 max-w-xl mx-auto'
              style={{ color: 'var(--landing-text-2)' }}
            >
              {t('为 AI 应用提供稳定、高效、透明的模型接入基础设施')}
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {capabilities.map((item, i) => (
                <div
                  key={i}
                  className='p-6 rounded-lg transition-all duration-200 hover:-translate-y-0.5'
                  style={{
                    backgroundColor: 'var(--landing-card-bg)',
                    border: '1px solid var(--landing-card-border)',
                    boxShadow: 'var(--landing-card-shadow)',
                  }}
                >
                  <div
                    className='w-10 h-10 rounded-md flex items-center justify-center mb-4'
                    style={{
                      backgroundColor: 'var(--landing-bg-2)',
                      color: 'var(--landing-text-1)',
                    }}
                  >
                    {item.icon}
                  </div>
                  <h3
                    className='text-base font-semibold mb-2'
                    style={{ color: 'var(--landing-text-0)' }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className='text-sm leading-relaxed'
                    style={{ color: 'var(--landing-text-2)' }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Source & Attribution */}
        <section
          className='py-20 md:py-28'
          style={{ backgroundColor: 'var(--landing-bg-0)' }}
        >
          <div className='max-w-4xl mx-auto px-6'>
            <h2
              className='text-2xl md:text-3xl font-bold text-center mb-12'
              style={{ color: 'var(--landing-text-0)' }}
            >
              {t('开源与致谢')}
            </h2>

            <div className='space-y-6'>
              <div
                className='p-6 rounded-lg'
                style={{
                  backgroundColor: 'var(--landing-card-bg)',
                  border: '1px solid var(--landing-card-border)',
                }}
              >
                <h3
                  className='text-base font-semibold mb-3'
                  style={{ color: 'var(--landing-text-0)' }}
                >
                  {t('项目许可')}
                </h3>
                <p
                  className='text-sm leading-relaxed'
                  style={{ color: 'var(--landing-text-2)' }}
                >
                  {t('本项目基于')}{' '}
                  <a
                    href='https://www.gnu.org/licenses/agpl-3.0.html'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-medium underline underline-offset-2'
                    style={{ color: 'var(--landing-text-0)' }}
                  >
                    AGPL v3.0
                  </a>{' '}
                  {t('许可证开源。')}{' '}
                  {t('上游项目')}{' '}
                  <a
                    href='https://github.com/songquanpeng/one-api'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-medium underline underline-offset-2'
                    style={{ color: 'var(--landing-text-0)' }}
                  >
                    One API
                  </a>{' '}
                  {t('由 JustSong 基于 MIT 许可证发布。')}
                </p>
              </div>

              <div
                className='p-6 rounded-lg'
                style={{
                  backgroundColor: 'var(--landing-card-bg)',
                  border: '1px solid var(--landing-card-border)',
                }}
              >
                <h3
                  className='text-base font-semibold mb-3'
                  style={{ color: 'var(--landing-text-0)' }}
                >
                  {t('技术栈')}
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {['Go', 'Gin', 'GORM', 'React', 'Vite', 'Semi Design', 'Tailwind CSS', 'Redis'].map(
                    (tech) => (
                      <span
                        key={tech}
                        className='px-3 py-1 rounded-md text-xs font-medium'
                        style={{
                          backgroundColor: 'var(--landing-bg-2)',
                          color: 'var(--landing-text-1)',
                          border: '1px solid var(--landing-border)',
                        }}
                      >
                        {tech}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className='py-16 md:py-20'
          style={{ backgroundColor: 'var(--landing-bg-1)' }}
        >
          <div className='max-w-3xl mx-auto px-6 text-center'>
            <h2
              className='text-2xl md:text-3xl font-bold mb-4'
              style={{ color: 'var(--landing-text-0)' }}
            >
              {t('开始使用')}
            </h2>
            <p
              className='mb-8'
              style={{ color: 'var(--landing-text-2)' }}
            >
              {t('几分钟完成接入，一个接口调用所有 AI 模型')}
            </p>
            <div className='flex items-center justify-center gap-4'>
              <Link to='/register'>
                <button className='hero-btn-primary'>
                  <span>{t('免费开始')}</span>
                  <ArrowRight size={18} />
                </button>
              </Link>
              <Link to='/pricing'>
                <button className='hero-btn-secondary'>
                  <span>{t('查看定价')}</span>
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <FooterBar />
      </div>
    </div>
  );
};

export default About;
