import React from 'react';
import Link from 'next/link';
import {
  Box, Container, IconButton, makeStyles, Typography, Tooltip, Grid, Dialog,
  Link as MuiLink, DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
} from '@material-ui/core';
import {
  Add, Refresh, GetApp as Export, Delete, LocalLibrary,
} from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/dist/client/router';
import UserToolbar from 'src/component/UserToolbar';
import withUserSignedIn from '../../src/HOC/withUserSignedIn';
import { deleteWord, getAllWord, getMultipleWords } from '../../src/lib/firebase';
import WordDisplayComponent from '../../src/component/WordDisplayComponent';
import { useFlag } from '../../src/lib/hooks';
import { Word } from '../../src/type/Word';
import { clearLearnStorage, createLearnStorage, readLearnStorage } from '../../src/lib/storage';

const userPageStyle = makeStyles((theme) => ({
  gridContainer: { marginBottom: theme.spacing(3) },
}));

function User() {
  const classes = userPageStyle();
  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  // Refresh list related
  const [wordList, setWordList] = React.useState<Word[]>([]);
  const refresh = () => {
    getAllWord().then((list) => setWordList(list));
  };
  React.useEffect(() => {
    refresh();
    // refresh per 5 seconds
    const interval = setInterval(() => {
      refresh();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Checkbox selected
  // const [selectedWordList, setSelectedWordList] = React.useState<string[]>([]);
  const selectFormRef = React.useRef<HTMLFormElement>(null);
  const getAllSelectedWords = () => Array.from(
    new FormData(selectFormRef.current ?? undefined).keys(),
  );

  // Batch delete words related
  const [batchDeleteDialogOpen,
    openBatchDeleteDialog, closeBatchDeleteDialog] = useFlag();
  const batchDeleteCheck = () => {
    const words = getAllSelectedWords();
    if (words.length === 0) enqueueSnackbar('No selected words.', { variant: 'warning' });
    else openBatchDeleteDialog();
  };
  const batchDelete = () => {
    const tasks = getAllSelectedWords().map((w) => deleteWord(w));
    Promise.all(tasks)
      .then(() => {
        enqueueSnackbar('Batch delete successful.', { variant: 'success' });
        refresh();
      })
      .catch((e) => {
        enqueueSnackbar(e, { variant: 'error' });
      });
    closeBatchDeleteDialog();
    refresh();
  };

  // Batch export words related
  const [exportDialogOpen, openExportDialog, closeExportDialog] = useFlag();
  const [exportLink, setExportLink] = React.useState('');
  const batchExport = () => {
    const keys = getAllSelectedWords();
    if (keys.length === 0) {
      enqueueSnackbar('No selected words.', { variant: 'warning' });
      return;
    }
    getMultipleWords(keys)
      .then((w) => JSON.stringify(w))
      .then((s) => {
        setExportLink(`data:text/plain;charset=utf-8,${encodeURIComponent(s)}`);
        openExportDialog();
      })
      .catch((e) => enqueueSnackbar(e, { variant: 'error' }));
  };

  // learn dialog related
  const [learnDialogOpen,
    openLearnDialog, closeLearnDialog] = useFlag();
  const createNewLearn = () => {
    const selectedWords = getAllSelectedWords();
    const newWordsToLearn = wordList.filter(
      (word) => selectedWords.includes(word.literal),
    );
    clearLearnStorage();
    createLearnStorage(newWordsToLearn);
    router.push('/user/learn');
  };
  const learn = () => {
    const selectedWords = getAllSelectedWords();
    const { wordsToLearn, learnSession } = readLearnStorage();
    if (wordsToLearn !== null && learnSession !== null) {
      if (selectedWords.length === 0) router.push('/user/learn');
      else openLearnDialog();
    } else if (selectedWords.length === 0) {
      enqueueSnackbar('No selected words.', { variant: 'warning' });
    } else {
      createNewLearn();
    }
  };

  return (
    <Container maxWidth="md" fixed>
      <Box padding={2}>
        {/* Title */}
        <Typography color="textPrimary" variant="h2" gutterBottom>
          Manage Words
        </Typography>

        {/* Panel */}
        <UserToolbar>
          <Link href="/user/add">
            <Button startIcon={<Add />} color="primary">Add Word</Button>
          </Link>
          <Button startIcon={<Refresh />} onClick={refresh}>Refresh</Button>
          <div style={{ flex: 1 }} />
          <Button
            startIcon={<LocalLibrary />}
            color="primary"
            variant="contained"
            onClick={learn}
          >
            Learn
          </Button>
          <Tooltip title="Export" placement="bottom" onClick={batchExport}>
            <IconButton><Export /></IconButton>
          </Tooltip>
          <Tooltip title="Delete" placement="bottom" onClick={batchDeleteCheck}>
            <IconButton color="secondary"><Delete /></IconButton>
          </Tooltip>
        </UserToolbar>

        {/* Word list */}
        <form ref={selectFormRef}>
          <Typography variant="h6" color="error" gutterBottom>
            Due
          </Typography>
          <Grid container spacing={1} className={classes.gridContainer}>
            {wordList
              .filter((word) => word.nextDue.toDate().getTime() <= Date.now())
              .map((word) => (
                <Grid item xs={12} sm={6} md={4} key={word.literal}>
                  <WordDisplayComponent word={word} refresh={refresh} />
                </Grid>
              ))}
          </Grid>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Others
          </Typography>
          <Grid container spacing={1} className={classes.gridContainer}>
            {wordList
              .filter((word) => word.nextDue.toDate().getTime() > Date.now())
              .map((word) => (
                <Grid item xs={12} sm={6} md={4} key={word.literal}>
                  <WordDisplayComponent word={word} refresh={refresh} />
                </Grid>
              ))}
          </Grid>
        </form>

        {/* Batch delete prompt. */}
        <Dialog open={batchDeleteDialogOpen} onClose={closeBatchDeleteDialog}>
          <DialogTitle>Batch Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete selected words?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeBatchDeleteDialog}>Cancel</Button>
            <Button color="secondary" onClick={batchDelete}>Delete</Button>
          </DialogActions>
        </Dialog>

        {/* Export dialog. */}
        <Dialog open={exportDialogOpen} onClose={closeExportDialog}>
          <DialogTitle>Export</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Your export data is ready.
            </DialogContentText>
            <DialogContentText>
              <MuiLink href={exportLink} download="export.json">Export</MuiLink>
            </DialogContentText>
          </DialogContent>
        </Dialog>

        {/* Learn prompt. */}
        <Dialog open={learnDialogOpen} onClose={closeLearnDialog}>
          <DialogTitle>Learn</DialogTitle>
          <DialogContent>
            <DialogContentText>
              It seems that you have already a started learning session.
              Do you want to continue the existed session or create a new one?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => router.push('/user/learn')}>Continue</Button>
            <Button color="secondary" onClick={createNewLearn}>Create</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default withUserSignedIn(User);
