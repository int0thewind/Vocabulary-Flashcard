import React from 'react';
import { Box, Paper, Typography } from '@material-ui/core';
import { Word } from '../type/Word';

type Props = {
  word: Word,
  showDue?: boolean,
};

function WordInfo({ word, showDue }: Props) {
  return (
    <>
      {/* Word display dialog. */}
      {word.phoneticSymbol && (
        <Typography variant="h6" color="textSecondary" display="block" gutterBottom>
          {word.phoneticSymbol}
        </Typography>
      )}
      <Typography color="textPrimary">
        {word.definition}
      </Typography>
      {word.sampleSentence && (
        <Paper variant="outlined">
          <Typography variant="h6" color="textSecondary">
            Example:
          </Typography>
          <Typography color="textSecondary">
            {word.sampleSentence}
          </Typography>
        </Paper>
      )}
      {word.etymology && (
        <Box marginTop={4}>
          <Typography variant="h6" color="textSecondary">
            Etymology
          </Typography>
          <Typography color="textSecondary">
            {word.etymology}
          </Typography>
        </Box>
      )}
      {word.related && (
        <Box overflow="visible">
          {word.related.join(', ')}
        </Box>
      )}
      {showDue && (
        <Box marginTop={4}>
          <Typography variant="subtitle2" color="textSecondary">
            {`Added at: ${word.addedAt.toDate().toLocaleDateString()}`}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {`Next due at: ${word.nextDue.toDate().toLocaleDateString()}`}
          </Typography>
        </Box>
      )}
    </>
  );
}

WordInfo.defaultProps = {
  showDue: false,
};

export default WordInfo;
