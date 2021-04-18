import React from 'react';
import Link from 'next/link';
import {
  Box, Button, Container, Typography,
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import withUserSignedIn from '../../src/HOC/withUserSignedIn';
import AddOrEditWordForm from '../../src/component/AddOrEditWordForm';

function AddWord() {
  return (
    <Container fixed maxWidth="md">
      <Box padding={2}>
        <Typography variant="h2" color="textPrimary" gutterBottom>
          Add Word
        </Typography>

        <Link href="/user">
          <Button startIcon={<ArrowBack />} variant="contained" color="primary">
            Back
          </Button>
        </Link>

        <AddOrEditWordForm />
      </Box>
    </Container>
  );
}

export default withUserSignedIn(AddWord);
