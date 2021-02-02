import { ParentSize } from '@visx/responsive';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <ParentSize>
    {({ width, height }) => <App width={width} height={height} />}
  </ParentSize>,
  document.getElementById('root')
);
