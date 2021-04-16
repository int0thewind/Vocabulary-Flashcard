import React from 'react';
import {
  Box,
  Container,
  IconButton,
  makeStyles,
  Typography,
  Tooltip,
  Grid,
  Paper,
  Checkbox,
  Dialog,
  Link as MuiLink,
  DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
} from '@material-ui/core';
import {
  Add, Refresh, GetApp as Export, Delete,
} from '@material-ui/icons';
import Link from 'next/link';
import withUserSignedIn from 'src/HOC/withUserSignedIn';
import { useSnackbar } from 'notistack';
import { deleteWord, getAllWordLiteral, getMultipleWords } from '../../src/lib/firebase';
import WordDisplayComponent from '../../src/component/WordDisplayComponent';

const userPageStyle = makeStyles((theme) => ({
  toolbar: { marginBottom: theme.spacing(2) },
}));

function User() {
  const classes = userPageStyle();
  const { enqueueSnackbar } = useSnackbar();

  // Refresh list related
  const [wordList, setWordList] = React.useState<string[]>([]);
  const refresh = () => {
    getAllWordLiteral().then((list) => setWordList(list));
  };
  React.useEffect(() => { refresh(); }, []);

  // Checkbox selected
  const [selectedWordList, setSelectedWordList] = React.useState<string[]>([]);
  const selectFormRef = React.useRef<HTMLFormElement>(null);
  const getAllSelectedWords = () => Array.from(
    new FormData(selectFormRef.current ?? undefined).keys(),
  );

  // Batch delete words related
  const [batchDeleteDialogOpen, setBatchDeleteDialogOpen] = React.useState(false);
  const closeBatchDeleteDialog = () => setBatchDeleteDialogOpen(false);
  const batchDeleteCheck = () => {
    const words = getAllSelectedWords();
    setSelectedWordList(words);
    if (words.length !== 0) setBatchDeleteDialogOpen(true);
  };
  const batchDelete = () => {
    const tasks = selectedWordList.map((w) => deleteWord(w));
    Promise.all(tasks).then(() => {
      enqueueSnackbar('Batch delete successful.', { variant: 'success' });
      closeBatchDeleteDialog();
      refresh();
    }).catch((e) => {
      enqueueSnackbar(e, { variant: 'error' });
    });
  };

  // Batch export words related
  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);
  const closeExportDialog = () => setExportDialogOpen(false);
  const [exportLink, setExportLink] = React.useState('');
  const batchExport = () => {
    const keys = getAllSelectedWords();
    if (keys.length === 0) return;
    getMultipleWords(keys)
      .then((w) => JSON.stringify(w))
      .then((s) => {
        setExportLink(`data:text/plain;charset=utf-8,${encodeURIComponent(s)}`);
        setExportDialogOpen(true);
      })
      .catch((e) => enqueueSnackbar(e, { variant: 'error' }));
  };

  return (
    <Container maxWidth="md" fixed>
      <Box padding={2}>
        {/* Title */}
        <Typography color="textPrimary" variant="h2" gutterBottom>
          Manage Words
        </Typography>

        {/* Panel */}
        <Paper elevation={3} className={classes.toolbar}>
          <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center" flexWrap="wrap" margin={1}>
            <Tooltip title="Delete" placement="bottom" onClick={batchDeleteCheck}>
              <IconButton color="secondary"><Delete /></IconButton>
            </Tooltip>
            <Tooltip title="Export" placement="bottom" onClick={batchExport}>
              <IconButton><Export /></IconButton>
            </Tooltip>
            <div style={{ flex: 1 }} />
            <Button startIcon={<Refresh />} onClick={refresh}>
              Refresh
            </Button>
            <Link href="/user/add">
              <Button startIcon={<Add />} color="primary">
                Add Word
              </Button>
            </Link>
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

        {/* Batch Delete Prompt. */}
        <Dialog open={batchDeleteDialogOpen} onClose={closeBatchDeleteDialog}>
          <DialogTitle>Batch Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`Are you sure you want to delete 
              ${selectedWordList.map((w) => `"${w}"`).join(', ')}?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeBatchDeleteDialog}>Cancel</Button>
            <Button color="secondary" onClick={batchDelete}>Delete</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={exportDialogOpen} onClose={closeExportDialog}>
          <DialogTitle>Export</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Your export data is ready.
            </DialogContentText>
            <DialogContentText>
              <MuiLink href={exportLink} download="export.json">
                Export
              </MuiLink>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Box>
    </Container>
  );
}

export default withUserSignedIn(User);
