import { Typography, Box } from '@material-ui/core';

export default function Home() {
  return (
    <Box margin={2}>
      <Typography variant="h1" color="textPrimary" align="center" gutterBottom>
        Vocabulary Flashcard
      </Typography>
      <Typography paragraph color="textPrimary">
        Welcome to Vocabulary Flashcard!
        This web app allows you to add, export, and learn new English verbiages!
      </Typography>
    </Box>
  );
}
