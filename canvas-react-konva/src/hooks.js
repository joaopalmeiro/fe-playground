import { useMemo } from 'react';

import { defaultMargin } from './constants';

// Source: https://github.com/plouc/nivo/blob/master/packages/core/src/hooks/useDimensions.js
// More info: https://github.com/facebook/react/issues/16265#issuecomment-517518539
export const useDimensions = (width, height, partialMargin = {}) =>
  useMemo(() => {
    const margin = {
      ...defaultMargin,
      ...partialMargin
    };

    return {
      margin,
      innerWidth: width - margin.left - margin.right,
      innerHeight: height - margin.top - margin.bottom,
      outerWidth: width,
      outerHeight: height
    };
  }, [width, height, partialMargin]);
