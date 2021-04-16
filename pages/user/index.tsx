import React from 'react';
import {
  Box, Container, IconButton, makeStyles, Typography, Tooltip, Grid, Paper, Checkbox,
} from '@material-ui/core';
import {
  Add, Refresh, GetApp as Export, Delete,
} from '@material-ui/icons';
import Link from 'next/link';
import withUserSignedIn from 'src/HOC/withUserSignedIn';
import { getAllWord } from '../../src/lib/firebase';
import WordDisplayComponent from '../../src/component/WordDisplayComponent';

const userPageStyle = makeStyles((theme) => ({
  toolbar: { marginBottom: theme.spacing(2) },
}));

function User() {
  const classes = userPageStyle();
  const [wordList, setWordList] = React.useState<string[]>([]);
  const selectFormRef = React.useRef<HTMLFormElement>(null);

  const refresh = () => {
    getAllWord()
      .then((querySnapshot) => {
        const list = querySnapshot.docs
          .map((val) => val.get('literal') as string);
        setWordList(list);
      });
  };

  const deleteOrExport = () => {
    const data = new FormData(selectFormRef.current ?? undefined);
    console.log(new Map(data.entries()));
  };

  React.useEffect(() => {
    refresh();
  }, []);

  return (
    <Container maxWidth="md" fixed>
      <Box padding={1}>
        {/* Title */}
        <Typography color="textPrimary" variant="h2" gutterBottom>
          Manage Words
        </Typography>

        {/* Panel */}
        <Paper elevation={3} className={classes.toolbar}>
          <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center" flexWrap="wrap" margin={1}>
            <Tooltip title="Refresh" placement="bottom">
              <IconButton color="primary" onClick={refresh}><Refresh /></IconButton>
            </Tooltip>
            <Link href="/user/add">
              <Tooltip title="Add" placement="bottom">
                <IconButton color="primary"><Add /></IconButton>
              </Tooltip>
            </Link>
            <Tooltip title="Delete" placement="bottom" onClick={deleteOrExport}>
              <IconButton color="secondary"><Delete /></IconButton>
            </Tooltip>
            <Tooltip title="Export" placement="bottom" onClick={deleteOrExport}>
              <IconButton><Export /></IconButton>
            </Tooltip>
          </Box>
        </Paper>

        {/* Word List */}
        <form ref={selectFormRef}>
          <Grid container spacing={1}>
            {wordList.map((word) => (
              <Grid item xs={12} sm={6} md={4} key={word}>
                <Paper>
                  <Checkbox color="primary" name={word} />
                  <WordDisplayComponent word={word} refresh={refresh} />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </form>
      </Box>
    </Container>
  );
}

export default withUserSignedIn(User);
