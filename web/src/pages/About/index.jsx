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

        {/* ── The ToChord Way — Bento Grid ────────────────────────── */}
        <section className='tcw-section w-full'>
          <div className='tcw-glow' />

          {/* Top amber hairline */}
          <div
            className='absolute top-0 left-0 right-0 h-px z-10'
            style={{ background: 'var(--tcw-topline)' }}
          />

          <div className='relative z-10 max-w-[1280px] mx-auto px-4 md:px-8 lg:px-10 py-12 md:py-16 lg:py-20'>

            {/* ── Compact header ── */}
            <div className='flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 mb-6 md:mb-8'>
              <div className='flex items-baseline gap-4'>
                <span
                  className='inline-block w-[6px] h-[6px] rounded-sm flex-shrink-0 translate-y-[-1px]'
                  style={{ background: '#f59e0b', transform: 'rotate(45deg)' }}
                />
                <h2
                  className='text-3xl md:text-4xl font-extrabold tracking-tight'
                  style={{ color: 'var(--tcw-heading)' }}
                >
                  The <span style={{ color: '#f59e0b' }}>ToChord</span> Way
                </h2>
              </div>
              <p
                className='text-xs font-mono tracking-widest uppercase sm:text-right flex-shrink-0'
                style={{ color: 'var(--tcw-sub)' }}
              >
                6 principles. Non-negotiable.
              </p>
            </div>

            {/* ── Bento grid ── */}
            <div className='tcw-grid'>

              {/* I — Hero: Precision Clientele (2×2) */}
              <div
                className='tcw-card tcw-card--hero tcw-grid--i'
                style={{ animationDelay: '0.05s' }}
              >
                <div className='tcw-card__numeral' aria-hidden='true'>I</div>
                {/* Decorative network/constellation illustration */}
                <svg
                  className='tcw-card__illus'
                  style={{ right: '5%', top: '18%', width: '55%', height: '50%' }}
                  viewBox='0 0 320 200'
                  fill='none'
                  aria-hidden='true'
                >
                  {/* Connection lines */}
                  <line x1='40' y1='60' x2='160' y2='30' stroke='var(--tcw-illus-stroke)' strokeWidth='1' />
                  <line x1='160' y1='30' x2='280' y2='70' stroke='var(--tcw-illus-stroke)' strokeWidth='1' />
                  <line x1='160' y1='30' x2='120' y2='120' stroke='var(--tcw-illus-stroke)' strokeWidth='1' />
                  <line x1='120' y1='120' x2='240' y2='140' stroke='var(--tcw-illus-stroke)' strokeWidth='1' />
                  <line x1='280' y1='70' x2='240' y2='140' stroke='var(--tcw-illus-stroke)' strokeWidth='1' />
                  <line x1='40' y1='60' x2='120' y2='120' stroke='var(--tcw-illus-stroke)' strokeWidth='1' />
                  <line x1='80' y1='170' x2='120' y2='120' stroke='var(--tcw-illus-stroke)' strokeWidth='1' />
                  <line x1='80' y1='170' x2='240' y2='140' stroke='var(--tcw-illus-stroke)' strokeWidth='1' />
                  <line x1='200' y1='80' x2='280' y2='70' stroke='var(--tcw-illus-stroke)' strokeWidth='1' />
                  <line x1='200' y1='80' x2='240' y2='140' stroke='var(--tcw-illus-stroke)' strokeWidth='1' />
                  <line x1='160' y1='30' x2='200' y2='80' stroke='var(--tcw-illus-stroke)' strokeWidth='1' />
                  {/* Nodes — key node amber */}
                  <circle cx='160' cy='30' r='5' fill='var(--tcw-illus-fill)' stroke='var(--tcw-illus-stroke)' strokeWidth='1' />
                  <circle cx='40' cy='60' r='3' fill='var(--tcw-illus-stroke)' />
                  <circle cx='280' cy='70' r='3.5' fill='var(--tcw-illus-stroke)' />
                  <circle cx='120' cy='120' r='6' fill='var(--tcw-illus-fill)' stroke='rgba(245,158,11,0.15)' strokeWidth='1' />
                  <circle cx='240' cy='140' r='4' fill='var(--tcw-illus-stroke)' />
                  <circle cx='80' cy='170' r='3' fill='var(--tcw-illus-stroke)' />
                  <circle cx='200' cy='80' r='3.5' fill='var(--tcw-illus-fill)' stroke='var(--tcw-illus-stroke)' strokeWidth='1' />
                  {/* Pulse rings on key nodes */}
                  <circle cx='160' cy='30' r='12' fill='none' stroke='rgba(245,158,11,0.08)' strokeWidth='0.8' />
                  <circle cx='120' cy='120' r='14' fill='none' stroke='rgba(245,158,11,0.06)' strokeWidth='0.6' />
                </svg>
                <div>
                  <div className='tcw-card__index'>I</div>
                  <h3 className='tcw-card__title'>Precision Clientele</h3>
                </div>
                <p className='tcw-card__body'>
                  我们的客群是一线大厂与高成长企业中对稳定性有专业判断力的工程师和技术决策者。我们不以规模为目标——我们以匹配为标准。能理解我们价值的客户，才是我们服务的客户。
                </p>
              </div>

              {/* II — Source Integrity (1×1) */}
              <div
                className='tcw-card tcw-grid--ii'
                style={{ animationDelay: '0.1s' }}
              >
                <div className='tcw-card__numeral' aria-hidden='true'>II</div>
                <div>
                  <div className='tcw-card__index'>II</div>
                  <h3 className='tcw-card__title'>Uncompromised Source Integrity</h3>
                </div>
                <p className='tcw-card__body'>
                  所有请求通过 AWS Bedrock 等官方一方通道直达模型。不存在共享账号池、不存在逆向协议、不存在任何形式的流量混合。
                </p>
              </div>

              {/* III — Warning: Arithmetic (1×2) */}
              <div
                className='tcw-card tcw-card--warning tcw-grid--iii'
                style={{ animationDelay: '0.15s' }}
              >
                <div className='tcw-card__numeral' aria-hidden='true'>III</div>
                {/* Decorative scale/balance illustration */}
                <svg
                  className='tcw-card__illus'
                  style={{ right: '-5%', top: '30%', width: '65%', height: '40%' }}
                  viewBox='0 0 200 120'
                  fill='none'
                  aria-hidden='true'
                >
                  {/* Balance beam */}
                  <line x1='100' y1='15' x2='100' y2='45' stroke='rgba(245,158,11,0.12)' strokeWidth='1.5' />
                  <line x1='40' y1='50' x2='160' y2='40' stroke='rgba(245,158,11,0.1)' strokeWidth='1.2' />
                  {/* Fulcrum triangle */}
                  <path d='M92 45 L100 30 L108 45 Z' fill='none' stroke='rgba(245,158,11,0.12)' strokeWidth='1' />
                  {/* Left pan (heavier — low price, tilted down) */}
                  <line x1='40' y1='50' x2='40' y2='70' stroke='rgba(245,158,11,0.08)' strokeWidth='0.8' />
                  <ellipse cx='40' cy='72' rx='22' ry='5' fill='none' stroke='rgba(245,158,11,0.1)' strokeWidth='0.8' />
                  <text x='40' y='76' textAnchor='middle' fontSize='7' fill='rgba(245,158,11,0.15)' fontFamily='monospace'>LOW $</text>
                  {/* Right pan (lighter — real API, tilted up) */}
                  <line x1='160' y1='40' x2='160' y2='58' stroke='rgba(245,158,11,0.08)' strokeWidth='0.8' />
                  <ellipse cx='160' cy='60' rx='22' ry='5' fill='none' stroke='rgba(245,158,11,0.1)' strokeWidth='0.8' />
                  <text x='160' y='64' textAnchor='middle' fontSize='7' fill='rgba(245,158,11,0.15)' fontFamily='monospace'>REAL</text>
                  {/* ≠ symbol */}
                  <text x='100' y='95' textAnchor='middle' fontSize='24' fill='rgba(245,158,11,0.1)' fontWeight='700' fontFamily='monospace'>&ne;</text>
                </svg>
                <div>
                  <div className='tcw-card__index'>III</div>
                  <h3 className='tcw-card__title'>The Arithmetic Does Not Lie</h3>
                </div>
                <p className='tcw-card__body'>
                  AI 服务商的定价是公开记录。任何报价大幅低于官方成本的服务，在数学上不可能提供真实 API——无一例外。这不是观点，是算术。我们欢迎你自行验算。
                </p>
              </div>

              {/* IV — Engineering (1×1) */}
              <div
                className='tcw-card tcw-grid--iv'
                style={{ animationDelay: '0.2s' }}
              >
                <div className='tcw-card__numeral' aria-hidden='true'>IV</div>
                <div>
                  <div className='tcw-card__index'>IV</div>
                  <h3 className='tcw-card__title'>Engineering at Production Scale</h3>
                </div>
                <p className='tcw-card__body'>
                  核心团队来自字节跳动、阿里巴巴、腾讯、百度。日活亿级平台的实战经验，全天候主动监控与快速事故响应。
                </p>
              </div>

              {/* V — Privacy (2×1) */}
              <div
                className='tcw-card tcw-grid--v'
                style={{ animationDelay: '0.25s' }}
              >
                <div className='tcw-card__numeral' aria-hidden='true'>V</div>
                <div>
                  <div className='tcw-card__index'>V</div>
                  <h3 className='tcw-card__title'>Privacy as Architecture</h3>
                </div>
                <p className='tcw-card__body'>
                  请求载荷经由路由层后不被留存。这不是一项可以修订的数据保留政策——这是架构约束：我们的系统从设计上即不具备存储内容的能力。
                </p>
              </div>

              {/* VI — Accountability (2×1) */}
              <div
                className='tcw-card tcw-grid--vi'
                style={{ animationDelay: '0.3s' }}
              >
                <div className='tcw-card__numeral' aria-hidden='true'>VI</div>
                <div>
                  <div className='tcw-card__index'>VI</div>
                  <h3 className='tcw-card__title'>Accountability with Consequences</h3>
                </div>
                <p className='tcw-card__body'>
                  我们公开可用性历史记录。我们维护书面 SLA 协议。服务水平违约触发账户自动返款，无需提交申诉。可靠性若无后果约束，便只是口号。
                </p>
              </div>
            </div>
          </div>
        </section>

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

      </div>
    </div>
  );
};

export default About;
