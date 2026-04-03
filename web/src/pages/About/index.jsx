/*
Copyright (C) 2025 QuantumNous
AGPL-3.0 License - see LICENSE for details.
*/

import React, { useEffect, useState } from 'react';
import { API, showError } from '../../helpers';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  const [about, setAbout] = useState('');
  const [aboutLoaded, setAboutLoaded] = useState(false);
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

      </div>
    </div>
  );
};

export default About;
