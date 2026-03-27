/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React from 'react';
import { ImagePreview } from '@douyinfe/semi-ui';
import PricingFilterBar from './PricingFilterBar';
import PricingContent from './content/PricingContent';
import ModelDetailSideSheet from '../modal/ModelDetailSideSheet';
import { useModelPricingData } from '../../../../hooks/model-pricing/useModelPricingData';
import { useIsMobile } from '../../../../hooks/common/useIsMobile';
import { useTranslation } from 'react-i18next';

const PricingPage = () => {
  const pricingData = useModelPricingData();
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const [showRatio, setShowRatio] = React.useState(false);
  const [viewMode, setViewMode] = React.useState('card');

  const allProps = {
    ...pricingData,
    showRatio,
    setShowRatio,
    viewMode,
    setViewMode,
  };

  return (
    <div className='pricing-page'>
      {/* 页面标题区 */}
      <div className='pricing-hero'>
        <h1 className='pricing-hero-title'>
          {t('模型定价')}
        </h1>
        <p className='pricing-hero-subtitle'>
          {t('探索所有可用模型及其定价信息，选择最适合您需求的方案')}
        </p>
      </div>

      {/* 搜索 + 筛选 水平栏 */}
      <PricingFilterBar
        {...allProps}
        isMobile={isMobile}
      />

      {/* 内容区域 */}
      <div className='pricing-content-area'>
        <PricingContent
          {...allProps}
          isMobile={isMobile}
          sidebarProps={allProps}
        />
      </div>

      <ImagePreview
        src={pricingData.modalImageUrl}
        visible={pricingData.isModalOpenurl}
        onVisibleChange={(visible) => pricingData.setIsModalOpenurl(visible)}
      />

      <ModelDetailSideSheet
        visible={pricingData.showModelDetail}
        onClose={pricingData.closeModelDetail}
        modelData={pricingData.selectedModel}
        groupRatio={pricingData.groupRatio}
        usableGroup={pricingData.usableGroup}
        currency={pricingData.currency}
        siteDisplayType={pricingData.siteDisplayType}
        tokenUnit={pricingData.tokenUnit}
        displayPrice={pricingData.displayPrice}
        showRatio={showRatio}
        vendorsMap={pricingData.vendorsMap}
        endpointMap={pricingData.endpointMap}
        autoGroups={pricingData.autoGroups}
        t={pricingData.t}
      />
    </div>
  );
};

export default PricingPage;
