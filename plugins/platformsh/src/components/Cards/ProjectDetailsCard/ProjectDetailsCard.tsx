import React from 'react';
import {
  InfoCard,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { Typography, Box, makeStyles, Link } from '@material-ui/core';
import { platformshApiRef } from '../../../api';
import { useApi } from '@backstage/core-plugin-api';
import { PlatformshProject } from '@internal/backstage-plugin-platformsh-common';
import useAsync from 'react-use/lib/useAsync';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.grey[200],
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    width: 300,
  },
  boxStyle: {
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    color: 'white',
    marginBottom: theme.spacing(2),
  },
  finishSetupLink: {
    textDecoration: 'underline',
    color: theme.palette.primary.main,
    cursor: 'pointer',
    marginBottom: theme.spacing(2),
  },
  planDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  specDetails: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  linkContainer: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
  },
  linkBox: {
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
  },
  upgradeLink: {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
}));

export const ProjectDetailsCard = ({ projectId }: { projectId: string }) => {
  const platformshApi = useApi(platformshApiRef);
  const classes = useStyles();

  const { value, loading, error } =
    useAsync(async (): Promise<PlatformshProject> => {
      return platformshApi.getProjectInfo(projectId);
    }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  if (value === undefined) {
    return <ResponseErrorPanel error={new Error('No project found')} />;
  }

  return (
    <InfoCard title="Project Details">
      <Typography variant="h6">{value.project_title}</Typography>
      <Typography variant="body2" color="textSecondary">
        {value.project_region_label}, {projectId}
      </Typography>

      <Box className={classes.planDetails}>
        <Typography variant="subtitle2">{value.plan} Plan</Typography>
      </Box>

      <Box className={classes.specDetails}>
        <Typography variant="body1">{value.size} MB</Typography>
        <Typography variant="body1">
          {value.environment?.used} out of {value.environment?.count}
        </Typography>
      </Box>

      <Box className={classes.specDetails}>
        <Typography variant="caption">Disk</Typography>
        <Typography variant="caption">Environments</Typography>
      </Box>

      <Box className={classes.linkContainer}>
        <Box className={classes.linkBox}>
          <Typography variant="body2">
            <Link href={value.url} target="blank">
              {value.url}
            </Link>
          </Typography>
        </Box>
      </Box>
    </InfoCard>
  );
};
