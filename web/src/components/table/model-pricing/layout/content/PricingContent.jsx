/*
Copyright (C) 2025 QuantumNous
AGPL-3.0 License - see LICENSE for details.
*/

import React from 'react';
import PricingView from './PricingView';

const PricingContent = ({ isMobile, ...props }) => {
  return (
    <div className='pricing-view-wrapper'>
      <PricingView {...props} />
    </div>
  );
};

export default PricingContent;
