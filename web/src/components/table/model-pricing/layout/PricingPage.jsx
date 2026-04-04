/*
Copyright (C) 2025 QuantumNous
AGPL-3.0 License - see LICENSE for details.
*/

import React from 'react';
import { ImagePreview } from '@douyinfe/semi-ui';
import PricingFilterBar from './PricingFilterBar';
import PricingContent from './content/PricingContent';
import { useModelPricingData } from '../../../../hooks/model-pricing/useModelPricingData';
import { useIsMobile } from '../../../../hooks/common/useIsMobile';
import { useTranslation } from 'react-i18next';

const PricingPage = () => {
  const pricingData = useModelPricingData();
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const [showRatio, setShowRatio] = React.useState(false);

  const allProps = {
    ...pricingData,
    showRatio,
    setShowRatio,
  };

  return (
    <div className='pricing-page'>
      {/* Hero */}
      <div className='pricing-hero'>
        <div className='pricing-hero-label'>
          <span className='pricing-hero-diamond' />
          <span className='pricing-hero-label-text'>Model Marketplace</span>
        </div>
        <div className='flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2'>
          <div>
            <h1 className='pricing-hero-title'>
              {t('模型与')}<span className='accent'>{t('定价')}</span>
            </h1>
            <p className='pricing-hero-subtitle'>
              {t('浏览所有可用模型及定价，找到最适合你的方案')}
            </p>
          </div>
          {pricingData.models && pricingData.models.length > 0 && (
            <span className='pricing-hero-count'>
              {pricingData.models.length} models
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <PricingFilterBar
        {...allProps}
        isMobile={isMobile}
      />

      {/* Content — list view with inline expand */}
      <div className='pricing-content-area'>
        <PricingContent
          {...allProps}
          isMobile={isMobile}
        />
      </div>

      <ImagePreview
        src={pricingData.modalImageUrl}
        visible={pricingData.isModalOpenurl}
        onVisibleChange={(visible) => pricingData.setIsModalOpenurl(visible)}
      />
    </div>
  );
};

export default PricingPage;
