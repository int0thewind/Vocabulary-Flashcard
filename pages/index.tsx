import { Typography, Container } from '@material-ui/core';

export default function Home() {
  return (
    <Container fixed maxWidth="md">
      <Typography variant="h1" color="textPrimary" align="center">
        Vocabulary Flashcard
      </Typography>
    </Container>
  );
}
