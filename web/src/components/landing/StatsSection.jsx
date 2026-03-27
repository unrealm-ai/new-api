/*
Copyright (C) 2025 QuantumNous
AGPL-3.0 License - see LICENSE for details.
*/

import React from 'react';
import { useTranslation } from 'react-i18next';

const stats = [
  { value: '40+', labelKey: '模型供应商' },
  { value: '99.9%', labelKey: '服务可用性' },
  { value: '<10ms', labelKey: '转发延迟' },
  { value: '100%', labelKey: 'OpenAI 协议兼容' },
];

const StatsSection = () => {
  const { t } = useTranslation();

  return (
    <section className='stats-section'>
      <div className='stats-inner'>
        {stats.map((stat) => (
          <div key={stat.labelKey} className='stats-item'>
            <div className='stats-value'>{stat.value}</div>
            <div className='stats-label'>{t(stat.labelKey)}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
