import { Typography, Container } from '@material-ui/core';

export default function Home() {
  return (
    <Container fixed maxWidth="md">
      <Typography variant="h1" color="textPrimary" align="center" gutterBottom>
        Vocabulary Flashcard
      </Typography>
      <Typography paragraph color="textPrimary">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Quisque eu purus tincidunt, consequat neque a, vulputate felis.
        Aliquam malesuada vehicula felis, ac efficitur est volutpat a.
        Mauris quam mauris, bibendum vel urna a, hendrerit elementum ante.
        Aliquam volutpat, elit quis elementum scelerisque,
        erat nunc volutpat ante, non vulputate lorem ipsum vel nisl.
        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
        Integer imperdiet, ipsum quis tristique tincidunt,
        sapien ipsum laoreet leo, vitae rutrum quam magna nec sem.
        Maecenas euismod diam eget sollicitudin sollicitudin.
        Fusce quis felis congue, rutrum enim ut, auctor est.
        Aliquam in fringilla eros, at aliquet arcu.
      </Typography>
    </Container>
  );
}
