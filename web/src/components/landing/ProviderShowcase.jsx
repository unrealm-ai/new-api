/*
Copyright (C) 2025 QuantumNous
AGPL-3.0 License - see LICENSE for details.
*/

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Moonshot, OpenAI, XAI, Zhipu, Volcengine, Cohere, Claude,
  Gemini, Suno, Minimax, Wenxin, Spark, Qingyan, DeepSeek,
  Qwen, Midjourney, Grok, AzureAI, Hunyuan, Xinference,
} from '@lobehub/icons';

const row1 = [
  { Icon: OpenAI, name: 'OpenAI' },
  { Icon: Claude, name: 'Claude', color: true },
  { Icon: Gemini, name: 'Gemini', color: true },
  { Icon: DeepSeek, name: 'DeepSeek', color: true },
  { Icon: Qwen, name: 'Qwen', color: true },
  { Icon: XAI, name: 'xAI' },
  { Icon: Grok, name: 'Grok' },
  { Icon: Zhipu, name: 'Zhipu', color: true },
  { Icon: Volcengine, name: 'Volcengine', color: true },
  { Icon: Moonshot, name: 'Moonshot' },
];

const row2 = [
  { Icon: Cohere, name: 'Cohere', color: true },
  { Icon: Minimax, name: 'Minimax', color: true },
  { Icon: Wenxin, name: 'Wenxin', color: true },
  { Icon: Spark, name: 'Spark', color: true },
  { Icon: Qingyan, name: 'Qingyan', color: true },
  { Icon: Suno, name: 'Suno' },
  { Icon: Midjourney, name: 'Midjourney' },
  { Icon: AzureAI, name: 'Azure AI', color: true },
  { Icon: Hunyuan, name: 'Hunyuan', color: true },
  { Icon: Xinference, name: 'Xinference', color: true },
];

const ProviderChip = ({ Icon, name, color }) => {
  const Comp = color && Icon.Color ? Icon.Color : Icon;
  return (
    <div className='provider-chip'>
      <Comp size={22} />
      <span>{name}</span>
    </div>
  );
};

const MarqueeRow = ({ items, reverse = false }) => {
  const doubled = [...items, ...items];
  return (
    <div className='marquee-row'>
      <div className={`marquee-track-v2 ${reverse ? 'marquee-reverse' : ''}`}>
        {doubled.map((p, i) => (
          <ProviderChip key={`${p.name}-${i}`} {...p} />
        ))}
      </div>
    </div>
  );
};

const ProviderShowcase = () => {
  const { t } = useTranslation();

  return (
    <section className='provider-section'>
      <div className='provider-section-inner'>
        <p className='provider-label'>{t('支持众多的大模型供应商')}</p>

        <div className='provider-marquee-container'>
          {/* Fade edges */}
          <div className='provider-fade provider-fade-left' />
          <div className='provider-fade provider-fade-right' />

          <MarqueeRow items={row1} />
          <MarqueeRow items={row2} reverse />
        </div>

        <div className='provider-count'>
          <span>40+</span> {t('模型供应商')}
        </div>
      </div>
    </section>
  );
};

export default ProviderShowcase;
