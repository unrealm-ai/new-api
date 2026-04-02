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
import { Button } from '@douyinfe/semi-ui';
import { RefreshCw, Search } from 'lucide-react';

const DashboardHeader = ({
  getGreeting,
  greetingVisible,
  showSearchModal,
  refresh,
  loading,
  t,
}) => {
  return (
    <div className='flex items-center justify-between mb-6'>
      <h2
        className='text-xl font-semibold transition-opacity duration-1000 ease-in-out'
        style={{
          opacity: greetingVisible ? 1 : 0,
          color: 'var(--tcw-heading)',
        }}
      >
        {getGreeting}
      </h2>
      <div className='flex gap-2'>
        <button
          onClick={showSearchModal}
          className='flex items-center justify-center w-8 h-8 rounded-md transition-colors cursor-pointer'
          style={{
            border: '1px solid var(--tcw-card-border)',
            background: 'transparent',
            color: 'var(--tcw-sub)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--pricing-accent)';
            e.currentTarget.style.color = 'var(--pricing-accent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--tcw-card-border)';
            e.currentTarget.style.color = 'var(--tcw-sub)';
          }}
        >
          <Search size={14} />
        </button>
        <button
          onClick={refresh}
          disabled={loading}
          className='flex items-center justify-center w-8 h-8 rounded-md transition-colors cursor-pointer'
          style={{
            border: '1px solid var(--tcw-card-border)',
            background: 'transparent',
            color: 'var(--tcw-sub)',
            opacity: loading ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--pricing-accent)';
            e.currentTarget.style.color = 'var(--pricing-accent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--tcw-card-border)';
            e.currentTarget.style.color = 'var(--tcw-sub)';
          }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
