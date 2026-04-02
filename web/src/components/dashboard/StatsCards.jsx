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
import { Skeleton } from '@douyinfe/semi-ui';
import { VChart } from '@visactor/react-vchart';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const StatsCards = ({
  groupedStatsData,
  loading,
  getTrendSpec,
  CARD_PROPS,
  CHART_CONFIG,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className='mb-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px' style={{ border: '1px solid var(--tcw-card-border)', borderRadius: '12px', overflow: 'hidden' }}>
        {groupedStatsData.map((group, idx) =>
          group.items.map((item, itemIdx) => (
            <div
              key={`${idx}-${itemIdx}`}
              className='cursor-pointer transition-colors px-5 py-4'
              style={{
                background: 'var(--tcw-card-bg)',
                borderRight: '1px solid var(--tcw-card-border)',
              }}
              onClick={item.onClick}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--tcw-card-bg-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--tcw-card-bg)';
              }}
            >
              <div className='text-xs mb-1' style={{ color: 'var(--tcw-sub)' }}>
                {item.title}
              </div>
              <div className='flex items-end justify-between'>
                <div className='text-xl font-bold' style={{ color: 'var(--tcw-heading)' }}>
                  <Skeleton
                    loading={loading}
                    active
                    placeholder={
                      <Skeleton.Paragraph
                        active
                        rows={1}
                        style={{ width: '60px', height: '24px' }}
                      />
                    }
                  >
                    {item.value}
                  </Skeleton>
                </div>
                {item.title === t('当前余额') ? (
                  <button
                    className='text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer'
                    style={{
                      border: '1px solid var(--pricing-accent)',
                      color: 'var(--pricing-accent)',
                      background: 'transparent',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/console/topup');
                    }}
                  >
                    {t('充值')}
                  </button>
                ) : (
                  (loading || (item.trendData && item.trendData.length > 0)) && (
                    <div className='w-20 h-8'>
                      <VChart
                        spec={getTrendSpec(item.trendData, item.trendColor)}
                        option={CHART_CONFIG}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StatsCards;
