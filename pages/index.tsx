import { Typography } from '@material-ui/core';

export default function Home() {
  return (
    <Typography color="textPrimary">
      {[...new Array(24)]
        .map(
          () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
        )
        .join('\n')}
    </Typography>
  );
}
