/*
Copyright (C) 2025 QuantumNous
AGPL-3.0 License - see LICENSE for details.
*/

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// 最近 14 天的模拟服务成功率数据
const MOCK_UPTIME_DATA = [
  99.8, 100, 99.9, 100, 99.7, 100, 100,
  99.9, 100, 99.8, 100, 100, 99.9, 100,
];

/**
 * 迷你 SVG 折线图 —— 显示最近 N 天服务成功率波动
 */
const UptimeSparkline = ({ data = MOCK_UPTIME_DATA }) => {
  const width = 120;
  const height = 32;
  const padding = 2;

  const points = useMemo(() => {
    const min = Math.min(...data) - 0.2;
    const max = 100;
    const range = max - min || 1;
    const stepX = (width - padding * 2) / (data.length - 1);

    return data
      .map((v, i) => {
        const x = padding + i * stepX;
        const y = height - padding - ((v - min) / range) * (height - padding * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [data]);

  // 渐变填充区域的路径
  const areaPath = useMemo(() => {
    const min = Math.min(...data) - 0.2;
    const max = 100;
    const range = max - min || 1;
    const stepX = (width - padding * 2) / (data.length - 1);

    const linePoints = data.map((v, i) => {
      const x = padding + i * stepX;
      const y = height - padding - ((v - min) / range) * (height - padding * 2);
      return { x, y };
    });

    let d = `M ${linePoints[0].x} ${linePoints[0].y}`;
    linePoints.slice(1).forEach((p) => {
      d += ` L ${p.x} ${p.y}`;
    });
    // 关闭区域到底部
    d += ` L ${linePoints[linePoints.length - 1].x} ${height}`;
    d += ` L ${linePoints[0].x} ${height} Z`;
    return d;
  }, [data]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className='stats-sparkline'
    >
      <defs>
        <linearGradient id='sparkline-fill' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#22c55e' stopOpacity='0.2' />
          <stop offset='100%' stopColor='#22c55e' stopOpacity='0' />
        </linearGradient>
      </defs>
      {/* 填充区域 */}
      <path d={areaPath} fill='url(#sparkline-fill)' />
      {/* 折线 */}
      <polyline
        points={points}
        fill='none'
        stroke='#22c55e'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      {/* 最后一个点高亮 */}
      {(() => {
        const min = Math.min(...data) - 0.2;
        const max = 100;
        const range = max - min || 1;
        const stepX = (width - padding * 2) / (data.length - 1);
        const lastVal = data[data.length - 1];
        const cx = padding + (data.length - 1) * stepX;
        const cy =
          height - padding - ((lastVal - min) / range) * (height - padding * 2);
        return (
          <>
            <circle cx={cx} cy={cy} r='3' fill='#22c55e' opacity='0.3' />
            <circle cx={cx} cy={cy} r='1.5' fill='#22c55e' />
          </>
        );
      })()}
    </svg>
  );
};

/**
 * 日成功率条形图 —— 每天一个竖条，高度代表成功率
 */
const UptimeDayBars = ({ data = MOCK_UPTIME_DATA }) => {
  const barWidth = 6;
  const gap = 3;
  const height = 28;
  const totalWidth = data.length * (barWidth + gap) - gap;

  return (
    <div className='stats-uptime-bars' title='Last 14 days uptime'>
      <svg
        width={totalWidth}
        height={height}
        viewBox={`0 0 ${totalWidth} ${height}`}
      >
        {data.map((val, i) => {
          const barH = Math.max(2, ((val - 99) / 1) * (height - 2));
          const x = i * (barWidth + gap);
          const y = height - barH;
          const isFullUptime = val >= 100;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={barH}
              rx={2}
              fill={isFullUptime ? '#22c55e' : '#f59e0b'}
              opacity={0.8}
            />
          );
        })}
      </svg>
    </div>
  );
};

const stats = [
  { value: '40+', labelKey: '模型供应商' },
  {
    value: '99.9%',
    labelKey: '服务可用性',
    extra: 'uptimeChart',
  },
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
            {stat.extra === 'uptimeChart' && (
              <div className='stats-extra'>
                <UptimeSparkline />
                <span className='stats-extra-label'>{t('近 14 天')}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
