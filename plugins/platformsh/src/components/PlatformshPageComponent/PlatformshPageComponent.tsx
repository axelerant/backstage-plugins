import React from 'react';
import { Grid } from '@material-ui/core';
import { Header, Page, Content } from '@backstage/core-components';
import { PlatformshProjectsComponent } from '../PlatformshProjectsComponent';

export const PlatformshPageComponent = () => (
  <Page themeId="tool">
    <Header title="Platform.sh Project Explorer" />
    <Content>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <PlatformshProjectsComponent />
        </Grid>
      </Grid>
    </Content>
  </Page>
);
