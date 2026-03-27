/*
Copyright (C) 2025 QuantumNous
AGPL-3.0 License - see LICENSE for details.
*/

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Shield, BarChart3, Globe, Key, RefreshCcw } from 'lucide-react';

const features = [
  {
    icon: Globe,
    titleKey: '多供应商聚合',
    descKey: '40+ AI 供应商统一接入，完全兼容 OpenAI API 协议，一个接口调用所有模型',
    accent: '#27272a',
    large: true,
    stat: '40+',
    statLabel: 'Providers',
  },
  {
    icon: Zap,
    titleKey: '高性能转发',
    descKey: '基于高性能异步架构，支持流式传输，毫秒级响应延迟',
    accent: '#f59e0b',
    stat: '<10ms',
    statLabel: 'Latency',
  },
  {
    icon: Shield,
    titleKey: '企业级安全',
    descKey: '完善的权限管理、令牌隔离、速率限制和审计日志',
    accent: '#22c55e',
  },
  {
    icon: RefreshCcw,
    titleKey: '智能容错',
    descKey: '自动故障转移、负载均衡和重试机制，保障服务高可用',
    accent: '#3f3f46',
    large: true,
    stat: '99.9%',
    statLabel: 'Uptime',
  },
  {
    icon: BarChart3,
    titleKey: '精细化计费',
    descKey: '按 Token 精确计费，支持分组倍率和多维度用量统计',
    accent: '#ec4899',
  },
  {
    icon: Key,
    titleKey: '灵活的令牌管理',
    descKey: '支持令牌分组、模型权限、配额限制和过期策略',
    accent: '#06b6d4',
  },
];

const FeatureCards = () => {
  const { t } = useTranslation();

  return (
    <section className='feature-section'>
      <div className='feature-section-inner'>
        {/* Header */}
        <div className='feature-header'>
          <h2 className='feature-title'>{t('为什么选择我们')}</h2>
          <p className='feature-subtitle'>
            {t('企业级 AI API 网关，为你的应用提供可靠、高效的模型接入服务')}
          </p>
        </div>

        {/* Bento grid */}
        <div className='bento-grid'>
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.titleKey}
                className={`bento-card ${feature.large ? 'bento-card-lg' : ''}`}
              >
                {/* Icon */}
                <div
                  className='bento-icon'
                  style={{
                    backgroundColor: `${feature.accent}12`,
                    color: feature.accent,
                  }}
                >
                  <Icon size={22} strokeWidth={1.5} />
                </div>

                {/* Content */}
                <h3 className='bento-card-title'>{t(feature.titleKey)}</h3>
                <p className='bento-card-desc'>{t(feature.descKey)}</p>

                {/* Optional stat */}
                {feature.stat && (
                  <div className='bento-stat'>
                    <span className='bento-stat-number' style={{ color: feature.accent }}>
                      {feature.stat}
                    </span>
                    <span className='bento-stat-label'>{feature.statLabel}</span>
                  </div>
                )}

                {/* Hover glow */}
                <div
                  className='bento-glow'
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${feature.accent}15, transparent 70%)`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
