import React from 'react';
import { Grid } from '@material-ui/core';
import { Header, Page, Content } from '@backstage/core-components';
import { ProjectsComponent } from '../ProjectsComponent';

export const PageComponent = () => (
  <Page themeId="tool">
    <Header title="Platform.sh Project Explorer" />
    <Content>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <ProjectsComponent />
        </Grid>
      </Grid>
    </Content>
  </Page>
);
