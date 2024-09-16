import React, { useState } from 'react';
import {
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { PlatformshEnvironment } from '@axelerant/backstage-plugin-platformsh-common';
import useAsyncFn from 'react-use/lib/useAsyncFn';

export const ActionButtons = ({
  enviroment,
  actionCallback,
}: {
  enviroment: PlatformshEnvironment;
  actionCallback: (action: string, env_id: string) => Promise<void>;
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const [doing, doingCallback] = useAsyncFn(
    async (action: string) => {
      await actionCallback(action, enviroment.id);
    },
    [enviroment.id],
  );

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const deactivateEnvironment = async () => {
    handleClose();
    await doingCallback('deactivate');
  };

  const pauseEnvironment = async () => {
    handleClose();
    await doingCallback('pause');
  };

  const resumeEnvironment = async () => {
    handleClose();
    await doingCallback('resume');
  };

  const deleteEnvironment = async () => {
    handleClose();
    await doingCallback('delete');
  };

  const activateEnvironment = async () => {
    handleClose();
    await doingCallback('activate');
  };

  if (enviroment.type === 'production') {
    return <></>;
  }

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        {doing.loading ? <CircularProgress size={24} /> : <MoreVertIcon />}
      </IconButton>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {enviroment.status === 'active' && [
          <MenuItem onClick={pauseEnvironment} key="pause">
            Pause
          </MenuItem>,
          <MenuItem onClick={deactivateEnvironment} key="deactivate">
            Deactivate
          </MenuItem>,
        ]}

        {enviroment.status === 'paused' && [
          <MenuItem onClick={resumeEnvironment} key="resume">
            Resume
          </MenuItem>,
          <MenuItem onClick={deactivateEnvironment} key="deactivate">
            Deactivate
          </MenuItem>,
        ]}

        {enviroment.status === 'deleting' && (
          <MenuItem disabled>Deleting...</MenuItem>
        )}

        {enviroment.status === 'dirty' && [
          <MenuItem onClick={deactivateEnvironment} key="deactivate">
            Deactivate
          </MenuItem>,
        ]}

        {enviroment.status === 'inactive' && [
          <MenuItem onClick={activateEnvironment} key="activate">
            Activate
          </MenuItem>,
          <MenuItem onClick={deleteEnvironment} key="delete">
            Delete
          </MenuItem>,
        ]}
      </Menu>
    </div>
  );
};
