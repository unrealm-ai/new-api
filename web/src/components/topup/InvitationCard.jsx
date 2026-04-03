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
import {
  Typography,
  Button,
  Input,
  Badge,
  Space,
} from '@douyinfe/semi-ui';
import { Copy, Users, BarChart2, TrendingUp, Gift, Zap } from 'lucide-react';

const { Text } = Typography;

const InvitationCard = ({
  t,
  userState,
  renderQuota,
  setOpenTransfer,
  affLink,
  handleAffLinkClick,
}) => {
  const statsItems = [
    {
      icon: <TrendingUp size={15} />,
      label: t('待使用收益'),
      value: renderQuota(userState?.user?.aff_quota || 0),
    },
    {
      icon: <BarChart2 size={15} />,
      label: t('总收益'),
      value: renderQuota(userState?.user?.aff_history_quota || 0),
    },
    {
      icon: <Users size={15} />,
      label: t('邀请人数'),
      value: userState?.user?.aff_count || 0,
    },
  ];

  return (
    <div
      style={{
        border: '1px solid var(--tcw-card-border)',
        borderRadius: '12px',
        background: 'var(--tcw-card-bg)',
        padding: '24px',
      }}
    >
      {/* Card header */}
      <div className='flex items-center gap-3 mb-5'>
        <div
          className='w-8 h-8 rounded-lg flex items-center justify-center'
          style={{
            border: '1px solid var(--tcw-card-border)',
            color: 'var(--tcw-title)',
          }}
        >
          <Gift size={16} />
        </div>
        <div>
          <div
            className='text-base font-semibold'
            style={{ color: 'var(--tcw-heading)' }}
          >
            {t('邀请奖励')}
          </div>
          <div className='text-xs' style={{ color: 'var(--tcw-sub)' }}>
            {t('邀请好友获得额外奖励')}
          </div>
        </div>
      </div>

      <Space vertical style={{ width: '100%' }}>
        {/* Stats + Transfer */}
        <div
          className='rounded-xl p-4'
          style={{ border: '1px solid var(--tcw-card-border)' }}
        >
          <div className='flex justify-between items-center mb-4'>
            <span
              className='text-sm font-medium'
              style={{ color: 'var(--tcw-heading)' }}
            >
              {t('收益统计')}
            </span>
            <Button
              type='primary'
              theme='solid'
              size='small'
              disabled={
                !userState?.user?.aff_quota ||
                userState?.user?.aff_quota <= 0
              }
              onClick={() => setOpenTransfer(true)}
            >
              <Zap size={12} className='mr-1' />
              {t('划转到余额')}
            </Button>
          </div>

          <div className='grid grid-cols-3 gap-4'>
            {statsItems.map((item, i) => (
              <div key={i} className='text-center'>
                <div
                  className='text-lg sm:text-2xl font-bold mb-1'
                  style={{ color: 'var(--tcw-heading)' }}
                >
                  {item.value}
                </div>
                <div className='flex items-center justify-center gap-1'>
                  <span style={{ color: 'var(--tcw-sub)' }}>{item.icon}</span>
                  <span
                    className='text-xs'
                    style={{ color: 'var(--tcw-body)' }}
                  >
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invitation link */}
        <Input
          value={affLink}
          readonly
          prefix={t('邀请链接')}
          suffix={
            <Button
              type='primary'
              theme='solid'
              onClick={handleAffLinkClick}
              icon={<Copy size={14} />}
            >
              {t('复制')}
            </Button>
          }
        />

        {/* Reward explanation */}
        <div
          className='rounded-xl p-4'
          style={{ border: '1px solid var(--tcw-card-border)' }}
        >
          <div
            className='text-sm font-medium mb-3'
            style={{ color: 'var(--tcw-heading)' }}
          >
            {t('奖励说明')}
          </div>
          <div className='space-y-3'>
            <div className='flex items-start gap-2'>
              <Badge dot type='success' />
              <Text type='tertiary' className='text-sm'>
                {t('邀请好友注册，好友充值后您可获得相应奖励')}
              </Text>
            </div>
            <div className='flex items-start gap-2'>
              <Badge dot type='success' />
              <Text type='tertiary' className='text-sm'>
                {t('通过划转功能将奖励额度转入到您的账户余额中')}
              </Text>
            </div>
            <div className='flex items-start gap-2'>
              <Badge dot type='success' />
              <Text type='tertiary' className='text-sm'>
                {t('邀请的好友越多，获得的奖励越多')}
              </Text>
            </div>
          </div>
        </div>
      </Space>
    </div>
  );
};

export default InvitationCard;
