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

import React, { useState, useCallback, memo } from 'react';
import { Input, Button, Switch, Select, Popover } from '@douyinfe/semi-ui';
import { IconSearch, IconCopy, IconFilter, IconRefresh } from '@douyinfe/semi-icons';
import {
  Building2,
  Layers,
  CreditCard,
  Tag,
  Plug,
  ChevronDown,
} from 'lucide-react';
import PricingVendors from '../filter/PricingVendors';
import PricingGroups from '../filter/PricingGroups';
import PricingQuotaTypes from '../filter/PricingQuotaTypes';
import PricingTags from '../filter/PricingTags';
import PricingEndpointTypes from '../filter/PricingEndpointTypes';
import PricingFilterModal from '../modal/PricingFilterModal';
import { resetPricingFilters } from '../../../../helpers/utils';
import { usePricingFilterCounts } from '../../../../hooks/model-pricing/usePricingFilterCounts';

/**
 * 水平筛选栏组件 — 替代原侧边栏
 * 桌面端：搜索行 + 筛选胶囊行
 * 移动端：搜索行 + 筛选按钮（弹出 modal）
 */
const PricingFilterBar = memo(
  ({
    // search
    handleChange,
    handleCompositionStart,
    handleCompositionEnd,
    searchValue,
    // selection
    selectedRowKeys = [],
    copyText,
    // filters
    filterVendor,
    setFilterVendor,
    filterGroup,
    setFilterGroup,
    handleGroupClick,
    filterQuotaType,
    setFilterQuotaType,
    filterEndpointType,
    setFilterEndpointType,
    filterVendor: _fv,
    filterTag,
    setFilterTag,
    // display settings
    showWithRecharge,
    setShowWithRecharge,
    currency,
    setCurrency,
    siteDisplayType,
    showRatio,
    setShowRatio,
    tokenUnit,
    setTokenUnit,
    currentPage,
    setCurrentPage,
    // data
    models = [],
    filteredModels = [],
    usableGroup,
    groupRatio,
    loading,
    // misc
    isMobile,
    t,
    ...rest
  }) => {
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [openPopover, setOpenPopover] = useState(null);

    const {
      quotaTypeModels,
      endpointTypeModels,
      vendorModels,
      tagModels,
      groupCountModels,
    } = usePricingFilterCounts({
      models,
      filterGroup,
      filterQuotaType,
      filterEndpointType,
      filterVendor,
      filterTag,
      searchValue,
    });

    const supportsCurrencyDisplay = siteDisplayType !== 'TOKENS';

    const handleCopyClick = useCallback(() => {
      if (copyText && selectedRowKeys.length > 0) {
        copyText(selectedRowKeys);
      }
    }, [copyText, selectedRowKeys]);

    const handleTokenUnitToggle = useCallback(() => {
      setTokenUnit?.(tokenUnit === 'K' ? 'M' : 'K');
    }, [tokenUnit, setTokenUnit]);

    const handleResetFilters = useCallback(() => {
      resetPricingFilters({
        handleChange,
        setShowWithRecharge,
        setCurrency,
        setShowRatio,
        setFilterGroup,
        setFilterQuotaType,
        setFilterEndpointType,
        setFilterVendor,
        setFilterTag,
        setCurrentPage,
        setTokenUnit,
      });
    }, [
      handleChange, setShowWithRecharge, setCurrency, setShowRatio,
      setFilterGroup, setFilterQuotaType, setFilterEndpointType,
      setFilterVendor, setFilterTag, setCurrentPage, setTokenUnit,
    ]);

    // 检查是否有任何活跃的筛选
    const hasActiveFilters =
      filterVendor !== 'all' ||
      filterGroup !== 'all' ||
      filterQuotaType !== 'all' ||
      filterTag !== 'all' ||
      filterEndpointType !== 'all';

    // 获取筛选器的选中标签
    const getFilterLabel = (filterKey, value) => {
      if (value === 'all') return null;
      return value;
    };

    // 筛选胶囊按钮配置
    const filterChips = [
      {
        key: 'vendor',
        icon: <Building2 size={14} />,
        label: t('供应商'),
        value: filterVendor,
        active: filterVendor !== 'all',
        content: (
          <div className='pricing-filter-popover-content'>
            <PricingVendors
              filterVendor={filterVendor}
              setFilterVendor={(v) => {
                setFilterVendor(v);
                setOpenPopover(null);
              }}
              models={vendorModels}
              allModels={models}
              loading={loading}
              t={t}
            />
          </div>
        ),
      },
      {
        key: 'group',
        icon: <Layers size={14} />,
        label: t('分组'),
        value: filterGroup,
        active: filterGroup !== 'all',
        content: (
          <div className='pricing-filter-popover-content'>
            <PricingGroups
              filterGroup={filterGroup}
              setFilterGroup={(v) => {
                handleGroupClick?.(v) || setFilterGroup?.(v);
                setOpenPopover(null);
              }}
              usableGroup={usableGroup}
              groupRatio={groupRatio}
              models={groupCountModels}
              loading={loading}
              t={t}
            />
          </div>
        ),
      },
      {
        key: 'quota',
        icon: <CreditCard size={14} />,
        label: t('计费类型'),
        value: filterQuotaType,
        active: filterQuotaType !== 'all',
        content: (
          <div className='pricing-filter-popover-content'>
            <PricingQuotaTypes
              filterQuotaType={filterQuotaType}
              setFilterQuotaType={(v) => {
                setFilterQuotaType(v);
                setOpenPopover(null);
              }}
              models={quotaTypeModels}
              loading={loading}
              t={t}
            />
          </div>
        ),
      },
      {
        key: 'tag',
        icon: <Tag size={14} />,
        label: t('标签'),
        value: filterTag,
        active: filterTag !== 'all',
        content: (
          <div className='pricing-filter-popover-content'>
            <PricingTags
              filterTag={filterTag}
              setFilterTag={(v) => {
                setFilterTag(v);
                setOpenPopover(null);
              }}
              models={tagModels}
              allModels={models}
              loading={loading}
              t={t}
            />
          </div>
        ),
      },
      {
        key: 'endpoint',
        icon: <Plug size={14} />,
        label: t('端点类型'),
        value: filterEndpointType,
        active: filterEndpointType !== 'all',
        content: (
          <div className='pricing-filter-popover-content'>
            <PricingEndpointTypes
              filterEndpointType={filterEndpointType}
              setFilterEndpointType={(v) => {
                setFilterEndpointType(v);
                setOpenPopover(null);
              }}
              models={endpointTypeModels}
              allModels={models}
              loading={loading}
              t={t}
            />
          </div>
        ),
      },
    ];

    // 构建 sidebarProps 供移动端 FilterModal 使用
    const sidebarProps = {
      handleChange,
      setShowWithRecharge,
      setCurrency,
      setShowRatio,
      setFilterGroup,
      handleGroupClick,
      setFilterQuotaType,
      setFilterEndpointType,
      setFilterVendor,
      setFilterTag,
      setCurrentPage,
      setTokenUnit,
      filterGroup,
      filterQuotaType,
      filterEndpointType,
      filterVendor,
      filterTag,
      usableGroup,
      groupRatio,
      models,
      loading,
      t,
      searchValue,
    };

    return (
      <div className='pricing-filter-bar'>
        {/* 第一行：搜索 + 操作 */}
        <div className='flex items-center gap-2 w-full'>
          <div className='flex-1 max-w-md'>
            <Input
              prefix={<IconSearch />}
              placeholder={t('搜索模型名称、描述、标签...')}
              value={searchValue}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              onChange={handleChange}
              showClear
              className='pricing-search-input'
            />
          </div>

          <div className='flex items-center gap-2'>
            <Button
              theme='outline'
              type='tertiary'
              icon={<IconCopy />}
              onClick={handleCopyClick}
              disabled={selectedRowKeys.length === 0}
              className='pricing-action-btn'
            >
              {!isMobile && t('复制')}
            </Button>

            {!isMobile && (
              <>
                {/* Token 单位 */}
                <button
                  className='pricing-chip-btn'
                  onClick={handleTokenUnitToggle}
                >
                  {tokenUnit}
                </button>

                {/* 倍率开关 */}
                <div className='flex items-center gap-1.5'>
                  <span
                    className='text-xs'
                    style={{ color: 'var(--landing-text-2)' }}
                  >
                    {t('倍率')}
                  </span>
                  <Switch
                    size='small'
                    checked={showRatio}
                    onChange={setShowRatio}
                  />
                </div>

                {/* 充值价格 */}
                {supportsCurrencyDisplay && (
                  <div className='flex items-center gap-1.5'>
                    <span
                      className='text-xs'
                      style={{ color: 'var(--landing-text-2)' }}
                    >
                      {t('充值价格显示')}
                    </span>
                    <Switch
                      size='small'
                      checked={showWithRecharge}
                      onChange={setShowWithRecharge}
                    />
                  </div>
                )}

                {/* 货币选择 */}
                {supportsCurrencyDisplay && showWithRecharge && (
                  <Select
                    value={currency}
                    onChange={setCurrency}
                    size='small'
                    className='pricing-currency-select'
                    optionList={[
                      { value: 'USD', label: 'USD' },
                      { value: 'CNY', label: 'CNY' },
                      { value: 'CUSTOM', label: t('自定义货币') },
                    ]}
                  />
                )}
              </>
            )}

            {/* 移动端筛选按钮 */}
            {isMobile && (
              <Button
                theme='outline'
                type='tertiary'
                icon={<IconFilter />}
                onClick={() => setShowFilterModal(true)}
                className='pricing-action-btn'
              >
                {t('筛选')}
              </Button>
            )}
          </div>
        </div>

        {/* 第二行：筛选胶囊（仅桌面端） */}
        {!isMobile && (
          <div className='pricing-filter-chips'>
            {filterChips.map((chip) => (
              <Popover
                key={chip.key}
                content={chip.content}
                trigger='click'
                position='bottomLeft'
                visible={openPopover === chip.key}
                onVisibleChange={(visible) =>
                  setOpenPopover(visible ? chip.key : null)
                }
                showArrow={false}
                spacing={8}
                contentClassName='pricing-filter-popover'
              >
                <button
                  className={`pricing-filter-chip ${chip.active ? 'active' : ''}`}
                >
                  {chip.icon}
                  <span>{chip.label}</span>
                  {chip.active && (
                    <span className='pricing-filter-chip-value'>
                      {getFilterLabel(chip.key, chip.value)}
                    </span>
                  )}
                  <ChevronDown
                    size={12}
                    className={`pricing-filter-chip-arrow ${openPopover === chip.key ? 'rotated' : ''}`}
                  />
                </button>
              </Popover>
            ))}

            {/* 重置按钮 */}
            {hasActiveFilters && (
              <button
                className='pricing-filter-reset'
                onClick={handleResetFilters}
              >
                <IconRefresh size='small' />
                <span>{t('重置')}</span>
              </button>
            )}

            {/* 结果计数 */}
            <div className='pricing-filter-count'>
              <span style={{ color: 'var(--landing-text-2)' }}>
                {filteredModels.length} {t('个模型')}
              </span>
            </div>
          </div>
        )}

        {/* 移动端筛选 Modal */}
        {isMobile && (
          <PricingFilterModal
            visible={showFilterModal}
            onClose={() => setShowFilterModal(false)}
            sidebarProps={sidebarProps}
            t={t}
          />
        )}
      </div>
    );
  },
);

PricingFilterBar.displayName = 'PricingFilterBar';

export default PricingFilterBar;
