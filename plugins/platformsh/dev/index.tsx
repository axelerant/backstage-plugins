import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { platformshPlugin, PlatformshPage } from '../src/plugin';

createDevApp()
  .registerPlugin(platformshPlugin)
  .addPage({
    element: <PlatformshPage />,
    title: 'Root Page',
    path: '/platformsh',
  })
  .render();
