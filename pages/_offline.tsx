import { Typography } from '@material-ui/core';
import MiddleCenter from '../src/component/MiddleCenter';

function Offline() {
  return (
    <MiddleCenter>
      <Typography variant="h1" color="textPrimary">
        Offline
      </Typography>
      <Typography variant="subtitle1" color="textSecondary">
        This page was not cached. Please connect to network to see the content.
      </Typography>
    </MiddleCenter>
  );
}

export default Offline;
