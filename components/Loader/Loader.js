import React from 'react';
import Spinkit from 'react-spinkit';
import { ACCENT_COLOR } from '../../consts';

// Вариации спинеров можно посмотреть на: https://kyleamathews.github.io/react-spinkit/
export default () => <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
  <Spinkit name='ball-clip-rotate' color={ACCENT_COLOR} />
</div>;
