import { Typography, Container } from '@material-ui/core';
import { appTitle } from '../src/lib/manifest';

export default function Home() {
  return (
    <Container fixed maxWidth="md">
      <Typography variant="h1" color="textPrimary" align="center">
        {appTitle}
      </Typography>
    </Container>
  );
}
