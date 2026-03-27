/*
Copyright (C) 2025 QuantumNous
AGPL-3.0 License - see LICENSE for details.
*/

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  const { t } = useTranslation();

  return (
    <section className='cta-section'>
      <div className='cta-inner'>
        <div className='cta-card'>
          {/* Background orbs */}
          <div className='cta-orb cta-orb-1' />
          <div className='cta-orb cta-orb-2' />

          <div className='cta-content'>
            <h2 className='cta-title'>{t('开始构建你的 AI 应用')}</h2>
            <p className='cta-subtitle'>
              {t('只需几分钟即可完成接入，立即体验统一的 AI API 网关服务')}
            </p>
            <div className='cta-buttons'>
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
        </div>
      </div>
    </section>
  );
};

export default CTASection;
