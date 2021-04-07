import { Typography, Container } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

export default function Home() {
  return (
    <Container fixed maxWidth="md">
      <Grid>
        <Typography variant="h1" color="textPrimary" align="center">
          Vocabulary Flashcard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" align="center" gutterBottom>
          This is a web app aiming at helping people learn vocabularies.
        </Typography>
      </Grid>
      <Grid style={{ marginTop: 10 }}>
        <Typography color="textPrimary" paragraph>
          Having a capacious vocabulary has positive impact on personal success,
          <br />
          yet so far, not many word memorizing apps have incorporated the best ways to memorize,
          <br />
          which are studying by adding time/Ebbinghaus forgetting curve/synonyms/prefix/suffix.
        </Typography>
        <Typography color="textPrimary" paragraph>
          Therefore, we decide to create a web app to support:
          <br />
          1. allow user to add/export vocabulary,
          <br />
          2. automatically fetch definitions from authoritative dictionaries by their APIs,
          <br />
          3. and learn/manage their vocabularies by a variety of different methods.
          <br />
        </Typography>
      </Grid>
    </Container>
  );
}
