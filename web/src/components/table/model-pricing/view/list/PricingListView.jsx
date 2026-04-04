/*
Copyright (C) 2025 QuantumNous
AGPL-3.0 License - see LICENSE for details.
*/

import React, { useState, useMemo } from 'react';
import {
  Tag,
  Empty,
  Pagination,
  Spin,
  Avatar,
  Badge,
  Table,
} from '@douyinfe/semi-ui';
import {
  IllustrationNoResult,
  IllustrationNoResultDark,
} from '@douyinfe/semi-illustrations';
import { ChevronRight, Info, Link2, Coins } from 'lucide-react';
import {
  stringToColor,
  calculateModelPrice,
  getModelPriceItems,
  getLobeHubIcon,
} from '../../../../../helpers';
import { useIsMobile } from '../../../../../hooks/common/useIsMobile';

/* ─────────────────────────────────────────────
   Inline Detail Panel — replaces old SideSheet
   Built directly into list rows for visual cohesion
   ───────────────────────────────────────────── */
const InlineDetailPanel = ({
  model,
  groupRatio,
  currency,
  siteDisplayType,
  tokenUnit,
  displayPrice,
  showRatio,
  usableGroup,
  endpointMap,
  autoGroups,
  t,
}) => {
  const modelEnableGroups = Array.isArray(model?.enable_groups)
    ? model.enable_groups
    : [];
  const autoChain = (autoGroups || []).filter((g) =>
    modelEnableGroups.includes(g),
  );

  // Description
  const description =
    model?.description || model?.vendor_description || null;

  // Tags
  const tags = model?.tags
    ? model.tags
        .split(',')
        .filter(Boolean)
        .map((t) => t.trim())
    : [];

  // Endpoints
  const endpointTypes = model?.supported_endpoint_types || [];
  const endpoints = endpointTypes.map((type) => {
    const info = endpointMap[type] || {};
    let path = info.path || '';
    if (path.includes('{model}')) {
      path = path.replaceAll('{model}', model?.model_name || '');
    }
    return { type, path, method: info.method || 'POST' };
  });

  // Group pricing table
  const availableGroups = Object.keys(usableGroup || {})
    .filter((g) => g && g !== 'auto')
    .filter((g) => modelEnableGroups.includes(g));

  const tableData = availableGroups.map((group) => {
    const priceData = calculateModelPrice({
      record: model,
      selectedGroup: group,
      groupRatio,
      tokenUnit,
      displayPrice,
      currency,
      quotaDisplayType: siteDisplayType,
    });
    const groupRatioValue = groupRatio?.[group] ?? 1;
    return {
      key: group,
      group,
      ratio: groupRatioValue,
      billingType:
        model?.quota_type === 0
          ? t('按量计费')
          : model?.quota_type === 1
            ? t('按次计费')
            : '-',
      priceItems: getModelPriceItems(priceData, t, siteDisplayType),
    };
  });

  const tableColumns = [
    {
      title: t('分组'),
      dataIndex: 'group',
      render: (text) => (
        <Tag color='white' size='small' shape='circle'>
          {text}{t('分组')}
        </Tag>
      ),
    },
  ];
  if (showRatio) {
    tableColumns.push({
      title: t('倍率'),
      dataIndex: 'ratio',
      render: (text) => (
        <span className='text-xs font-mono' style={{ color: 'var(--tcw-body)' }}>
          {text}x
        </span>
      ),
    });
  }
  tableColumns.push({
    title: t('计费类型'),
    dataIndex: 'billingType',
    render: (text) => {
      let color = 'white';
      if (text === t('按量计费')) color = 'violet';
      else if (text === t('按次计费')) color = 'teal';
      return (
        <Tag color={color} size='small' shape='circle'>
          {text || '-'}
        </Tag>
      );
    },
  });
  tableColumns.push({
    title: siteDisplayType === 'TOKENS' ? t('计费摘要') : t('价格摘要'),
    dataIndex: 'priceItems',
    render: (items) => (
      <div className='space-y-0.5'>
        {items.map((item) => (
          <div key={item.key} className='flex items-baseline gap-1'>
            <span className='text-sm font-semibold' style={{ color: 'var(--semi-color-primary)' }}>
              {item.value}
            </span>
            <span className='text-xs' style={{ color: 'var(--tcw-sub)' }}>
              {item.label} {item.suffix}
            </span>
          </div>
        ))}
      </div>
    ),
  });

  return (
    <div className='pricing-detail-panel'>
      {/* Three columns on desktop: Description | Endpoints | Pricing */}
      <div className='pricing-detail-grid'>
        {/* Column 1: Basic Info */}
        <div className='pricing-detail-section'>
          <div className='pricing-detail-section-header'>
            <Info size={14} />
            <span>{t('基本信息')}</span>
          </div>
          {description ? (
            <p className='text-sm leading-relaxed' style={{ color: 'var(--tcw-body)' }}>
              {description}
            </p>
          ) : (
            <p className='text-sm' style={{ color: 'var(--tcw-sub)' }}>
              {t('暂无模型描述')}
            </p>
          )}
          {tags.length > 0 && (
            <div className='flex flex-wrap gap-1 mt-2'>
              {tags.map((tag, idx) => (
                <Tag
                  key={idx}
                  color={stringToColor(tag)}
                  shape='circle'
                  size='small'
                >
                  {tag}
                </Tag>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Endpoints */}
        {endpoints.length > 0 && (
          <div className='pricing-detail-section'>
            <div className='pricing-detail-section-header'>
              <Link2 size={14} />
              <span>{t('API端点')}</span>
            </div>
            <div className='space-y-1.5'>
              {endpoints.map((ep) => (
                <div
                  key={ep.type}
                  className='flex items-center justify-between text-xs'
                >
                  <span className='flex items-center gap-1.5'>
                    <Badge dot type='success' />
                    <span style={{ color: 'var(--tcw-heading)' }}>{ep.type}</span>
                    {ep.path && (
                      <span
                        className='font-mono'
                        style={{ color: 'var(--tcw-sub)' }}
                      >
                        {ep.path}
                      </span>
                    )}
                  </span>
                  {ep.path && (
                    <span
                      className='font-mono text-[10px]'
                      style={{ color: 'var(--tcw-sub)' }}
                    >
                      {ep.method}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full-width: Pricing table */}
      <div className='pricing-detail-section mt-3'>
        <div className='pricing-detail-section-header'>
          <Coins size={14} />
          <span>{t('分组价格')}</span>
        </div>
        {autoChain.length > 0 && (
          <div className='flex flex-wrap items-center gap-1 mb-2'>
            <span className='text-xs' style={{ color: 'var(--tcw-sub)' }}>
              {t('auto分组调用链路')} →
            </span>
            {autoChain.map((g, idx) => (
              <React.Fragment key={g}>
                <Tag color='white' size='small' shape='circle'>
                  {g}{t('分组')}
                </Tag>
                {idx < autoChain.length - 1 && (
                  <span className='text-xs' style={{ color: 'var(--tcw-sub)' }}>→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
        <Table
          dataSource={tableData}
          columns={tableColumns}
          pagination={false}
          size='small'
          bordered={false}
          className='pricing-detail-table'
        />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main List View
   ───────────────────────────────────────────── */
const PricingListView = ({
  filteredModels,
  loading,
  pageSize,
  setPageSize,
  currentPage,
  setCurrentPage,
  selectedGroup,
  groupRatio,
  copyText,
  setModalImageUrl,
  setIsModalOpenurl,
  currency,
  siteDisplayType,
  tokenUnit,
  displayPrice,
  showRatio,
  usableGroup,
  vendorsMap,
  endpointMap,
  autoGroups,
  t,
}) => {
  const [expandedKey, setExpandedKey] = useState(null);
  const isMobile = useIsMobile();

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedModels = useMemo(
    () => filteredModels.slice(startIndex, startIndex + pageSize),
    [filteredModels, startIndex, pageSize],
  );

  const getModelKey = (model) => model.key ?? model.model_name ?? model.id;

  const toggleExpand = (modelKey) => {
    setExpandedKey((prev) => (prev === modelKey ? null : modelKey));
  };

  // Get model icon
  const getModelIcon = (model) => {
    if (model.icon) return getLobeHubIcon(model.icon, 28);
    if (model.vendor_icon) return getLobeHubIcon(model.vendor_icon, 28);
    const text = (model.model_name || '??').slice(0, 2).toUpperCase();
    return (
      <Avatar
        size='small'
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          fontSize: 11,
          fontWeight: 'bold',
        }}
      >
        {text}
      </Avatar>
    );
  };

  // Price helpers
  const getPriceData = (model) =>
    calculateModelPrice({
      record: model,
      selectedGroup,
      groupRatio,
      tokenUnit,
      displayPrice,
      currency,
      quotaDisplayType: siteDisplayType,
    });

  const formatPerCallPrice = (model, priceData) => {
    if (model.quota_type !== 1) return '-';
    const items = getModelPriceItems(priceData, t, siteDisplayType);
    const item = items.find((i) => i.key === 'call' || i.key === 'fixed');
    if (item) return item.value + (item.suffix || '');
    if (items.length > 0) return items[0].value + (items[0].suffix || '');
    return '-';
  };

  const formatIOPrice = (model, priceData, type) => {
    if (model.quota_type === 1) return '-';
    const items = getModelPriceItems(priceData, t, siteDisplayType);
    const item = items.find((i) => i.key === type);
    if (!item) return '-';
    const hasMin =
      priceData?.hasMultipleTiers ||
      priceData?.hasImagePricing ||
      priceData?.hasVideoPricing;
    return (
      <>
        {item.value}
        {hasMin && (
          <span className='pricing-list-suffix-min'>{t('起')}</span>
        )}
      </>
    );
  };

  const getDetailInfo = (model, priceData) => {
    if (priceData?.hasMultipleTiers)
      return `${t('阶梯价格')}: ${priceData.tierCount || 2} ${t('档')}`;
    if (priceData?.hasImagePricing)
      return `${t('图片价格')}: ${priceData.imageSpecCount || 1} ${t('种规格')}`;
    if (priceData?.hasVideoPricing)
      return `${t('视频计费')}: ${priceData.videoSpecCount || 1} ${t('种规格')}`;
    return '-';
  };

  const renderTags = (model) => {
    if (!model.tags) return <span style={{ color: 'var(--tcw-sub)' }}>-</span>;
    const tags = model.tags.split(',').filter(Boolean);
    if (tags.length === 0) return <span style={{ color: 'var(--tcw-sub)' }}>-</span>;
    return (
      <div className='flex items-center gap-1 flex-wrap'>
        {tags.slice(0, 2).map((tag, idx) => (
          <Tag key={idx} color={stringToColor(tag.trim())} shape='circle' size='small'>
            {tag.trim().length > 12 ? tag.trim().slice(0, 12) + '...' : tag.trim()}
          </Tag>
        ))}
        {tags.length > 2 && (
          <span className='text-[10px]' style={{ color: 'var(--tcw-sub)' }}>
            +{tags.length - 2}
          </span>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center py-20'>
        <Spin size='large' />
      </div>
    );
  }

  if (!filteredModels || filteredModels.length === 0) {
    return (
      <div className='flex justify-center items-center py-20'>
        <Empty
          image={<IllustrationNoResult style={{ width: 150, height: 150 }} />}
          darkModeImage={
            <IllustrationNoResultDark style={{ width: 150, height: 150 }} />
          }
          description={t('搜索无结果')}
        />
      </div>
    );
  }

  return (
    <div>
      {/* List container */}
      <div className='pricing-list-container'>
        {/* Header */}
        <div className='pricing-list-header'>
          <div className='pricing-list-col-expand' />
          <div className='pricing-list-col-model'>{t('模型')}</div>
          {!isMobile && (
            <>
              <div className='pricing-list-col-callprice'>{t('按次价格')}</div>
              <div className='pricing-list-col-detail'>{t('详细信息')}</div>
              <div className='pricing-list-col-tags'>{t('特点')}</div>
            </>
          )}
          <div className='pricing-list-col-billing'>{t('计费')}</div>
          <div className='pricing-list-col-price'>{t('输入价格')}</div>
          <div className='pricing-list-col-price'>{t('输出价格')}</div>
        </div>

        {/* Rows */}
        {paginatedModels.map((model) => {
          const modelKey = getModelKey(model);
          const isExpanded = expandedKey === modelKey;
          const priceData = getPriceData(model);

          return (
            <React.Fragment key={modelKey}>
              {/* Row */}
              <div
                className={`pricing-list-row ${isExpanded ? 'expanded' : ''}`}
                onClick={() => toggleExpand(modelKey)}
              >
                {/* Chevron */}
                <div className='pricing-list-col-expand'>
                  <ChevronRight
                    size={16}
                    className={`pricing-list-chevron ${isExpanded ? 'rotated' : ''}`}
                  />
                </div>

                {/* Model */}
                <div className='pricing-list-col-model'>
                  <div className='flex items-center gap-2.5 min-w-0'>
                    <div className='pricing-list-icon'>
                      {getModelIcon(model)}
                    </div>
                    <span
                      className='pricing-list-model-name'
                      title={model.model_name}
                      onClick={(e) => {
                        e.stopPropagation();
                        copyText(model.model_name);
                      }}
                    >
                      {model.model_name}
                    </span>
                  </div>
                </div>

                {!isMobile && (
                  <>
                    <div className='pricing-list-col-callprice pricing-list-cell-text'>
                      {formatPerCallPrice(model, priceData)}
                    </div>
                    <div className='pricing-list-col-detail pricing-list-cell-sub'>
                      {getDetailInfo(model, priceData)}
                    </div>
                    <div className='pricing-list-col-tags'>
                      {renderTags(model)}
                    </div>
                  </>
                )}

                <div className='pricing-list-col-billing'>
                  {model.quota_type === 0 ? (
                    <span className='pricing-list-billing-badge'>
                      {t('按量')}
                    </span>
                  ) : model.quota_type === 1 ? (
                    <span className='pricing-list-billing-badge accent'>
                      {t('按次')}
                    </span>
                  ) : (
                    <span className='pricing-list-cell-sub'>-</span>
                  )}
                </div>

                <div className='pricing-list-col-price pricing-list-price-value'>
                  {formatIOPrice(model, priceData, 'input')}
                </div>
                <div className='pricing-list-col-price pricing-list-price-value'>
                  {formatIOPrice(model, priceData, 'output')}
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <InlineDetailPanel
                  model={model}
                  groupRatio={groupRatio}
                  currency={currency}
                  siteDisplayType={siteDisplayType}
                  tokenUnit={tokenUnit}
                  displayPrice={displayPrice}
                  showRatio={showRatio}
                  usableGroup={usableGroup}
                  endpointMap={endpointMap}
                  autoGroups={autoGroups}
                  t={t}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Pagination */}
      {filteredModels.length > 0 && (
        <div className='flex justify-center mt-4 py-4'>
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            total={filteredModels.length}
            showSizeChanger={true}
            pageSizeOptions={[10, 20, 50, 100]}
            size={isMobile ? 'small' : 'default'}
            onPageChange={(page) => {
              setCurrentPage(page);
              setExpandedKey(null);
            }}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
              setExpandedKey(null);
            }}
          />
        </div>
      )}

      {/* Footer count */}
      <div className='text-center pb-2'>
        <span className='text-xs' style={{ color: 'var(--tcw-sub)' }}>
          {t('显示前')} {Math.min(paginatedModels.length, pageSize)} {t('个模型')} / {t('共')} {filteredModels.length} {t('个')}
        </span>
      </div>
    </div>
  );
};

export default PricingListView;
