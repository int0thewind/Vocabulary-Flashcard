import React from 'react';
import { Box, Paper, Typography } from '@material-ui/core';
import { Word } from '../type/Word';

type Props = { word: Word };

export default function WordInfo({ word }: Props) {
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
          <Typography>
            Example:
          </Typography>
          <Typography>
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
    </>
  );
}
