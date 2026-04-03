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
import { Tag } from '@douyinfe/semi-ui';
import {
  isRoot,
  isAdmin,
  renderQuota,
  stringToColor,
} from '../../../../helpers';
import { Coins, BarChart2, Users, Wallet } from 'lucide-react';

const UserInfoHeader = ({ t, userState }) => {
  const getUsername = () => {
    if (userState.user) {
      return userState.user.username;
    } else {
      return 'null';
    }
  };

  const getAvatarText = () => {
    const username = getUsername();
    if (username && username.length > 0) {
      return username.slice(0, 2).toUpperCase();
    }
    return 'NA';
  };

  const statsItems = [
    {
      icon: <Coins size={15} />,
      label: t('历史消耗'),
      value: renderQuota(userState?.user?.used_quota),
    },
    {
      icon: <BarChart2 size={15} />,
      label: t('请求次数'),
      value: userState.user?.request_count || 0,
    },
    {
      icon: <Users size={15} />,
      label: t('用户分组'),
      value: userState?.user?.group || t('默认'),
    },
  ];

  return (
    <div
      style={{
        border: '1px solid var(--tcw-card-border)',
        borderRadius: '12px',
        background: 'var(--tcw-card-bg)',
      }}
    >
      {/* User profile section */}
      <div className='p-5 sm:p-6'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          {/* Left: Avatar + User info */}
          <div className='flex items-center gap-4'>
            {/* Avatar */}
            <div
              className='w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0'
              style={{
                backgroundColor: stringToColor(getUsername()),
                color: '#fff',
              }}
            >
              {getAvatarText()}
            </div>
            {/* Name + Role */}
            <div>
              <div
                className='text-xl sm:text-2xl font-bold tracking-tight'
                style={{ color: 'var(--tcw-heading)' }}
              >
                {getUsername()}
              </div>
              <div className='flex flex-wrap items-center gap-1.5 mt-1.5'>
                {isRoot() ? (
                  <Tag size='small' shape='circle' color='amber'>
                    {t('超级管理员')}
                  </Tag>
                ) : isAdmin() ? (
                  <Tag size='small' shape='circle' color='amber'>
                    {t('管理员')}
                  </Tag>
                ) : (
                  <Tag size='small' shape='circle'>
                    {t('普通用户')}
                  </Tag>
                )}
                <span
                  className='text-xs font-mono'
                  style={{ color: 'var(--tcw-sub)' }}
                >
                  ID: {userState?.user?.id}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Balance */}
          <div className='flex items-center gap-3 sm:text-right'>
            <div
              className='w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 sm:hidden'
              style={{
                border: '1px solid var(--tcw-card-border)',
                color: 'var(--tcw-title)',
              }}
            >
              <Wallet size={18} />
            </div>
            <div>
              <div
                className='text-xs font-mono uppercase tracking-widest mb-1'
                style={{ color: 'var(--tcw-sub)' }}
              >
                {t('当前余额')}
              </div>
              <div
                className='text-2xl sm:text-3xl font-bold tracking-tight'
                style={{ color: 'var(--tcw-heading)' }}
              >
                {renderQuota(userState?.user?.quota)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div
        className='px-5 sm:px-6 py-3'
        style={{
          borderTop: '1px solid var(--tcw-card-border)',
        }}
      >
        <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6'>
          {statsItems.map((item, i) => (
            <div key={i} className='flex items-center gap-2'>
              <span style={{ color: 'var(--tcw-sub)' }}>{item.icon}</span>
              <span
                className='text-xs'
                style={{ color: 'var(--tcw-body)' }}
              >
                {item.label}
              </span>
              <span
                className='text-xs font-medium'
                style={{ color: 'var(--tcw-heading)' }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserInfoHeader;
