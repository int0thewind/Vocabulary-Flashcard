import React from 'react';
import axios from 'axios';
import {
  Box, CircularProgress, Typography, useTheme,
} from '@material-ui/core';
import { ErrorRounded } from '@material-ui/icons';

type Props = {
  word: string,
  uid: string,
};

function WordQuery({ word, uid }: Props) {
  const theme = useTheme();
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    axios.put('/api/vocabularies', null, {
      params: { word, uid, vocabulary: 'default' },
    }).then(() => setProgress((v) => v + 50))
      .catch(() => setProgress(-200));
    axios.put('/api/words', null, {
      params: { word },
    }).then(() => setProgress((v) => v + 50))
      .catch(() => setProgress(-200));
  }, [uid, word]);

  return (
    <Box display="flex" flexDirection="row" alignItems="center" marginBottom={1}>
      {progress >= 0 && <CircularProgress size="2rem" value={progress} />}
      {progress < 0 && <ErrorRounded style={{ color: theme.palette.error.main, fontSize: '2rem' }} />}
      <Typography variant="body1" color="textSecondary">
        {word}
      </Typography>
    </Box>
  );
}

export default WordQuery;
