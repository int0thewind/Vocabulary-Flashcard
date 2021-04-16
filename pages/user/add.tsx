import React from 'react';
import withUserSignedIn, { WithUserSignedInProps } from 'src/HOC/withUserSignedIn';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import firebase from 'firebase/app';
import { checkWordExist } from '../../src/lib/firebase';
import Word from '../../src/type/Word';

const addWordStyle = makeStyles((theme) => ({
  queryForm: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
      '&:first-child': { marginLeft: 0 },
    },
  },
  queryFormPaper: {
    padding: theme.spacing(2),
  },
  fillInForm: {
    marginTop: theme.spacing(3),
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

function AddWord({ user }: WithUserSignedInProps) {
  const classes = addWordStyle();
  const { enqueueSnackbar } = useSnackbar();

  const [wordSuggestion, setWordSuggestion] = React.useState<string[]>([]);

  const submitQueryForm = (e: React.FormEvent<HTMLFormElement>) => {
    const data = new FormData(e.currentTarget);
    console.log(data);
  };

  const addWord = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    if (!data.get('literal')) {
      enqueueSnackbar('A word must exist', { variant: 'error' });
      return;
    }
    if (!data.get('definition')) {
      enqueueSnackbar('A word must has definition.', { variant: 'error' });
      return;
    }

    checkWordExist(data.get('literal') as string) // The form only has strings.
      .then((cond) => {
        if (cond === true) {
          // Open Dialog
        } else {
          const wordData: Word = {
            literal: data.get('literal') as string,
            definition: data.get('definition') as string,
            phoneticSymbol: data.get('phonetic') as string,
            sampleSentence: data.get('sampleSentence') as string,
            etymology: data.get('etymology') as string,
            related: (data.get('related') as string)
              .split(',').map((s) => s.trim()),
            addedAt: firebase.firestore.Timestamp.now(),
            nextDue: firebase.firestore.Timestamp.now(),
          };
        }
      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: 'error' });
      });
  };

  // @ts-ignore
  return (
    <Container>
      <Box padding={1}>
        <Typography variant="h2" color="textPrimary" gutterBottom>
          Add Word
        </Typography>

        <Paper elevation={3} className={classes.queryFormPaper}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Auto Query
          </Typography>
          <form onSubmit={submitQueryForm} className={classes.queryForm}>
            <TextField
              autoComplete={wordSuggestion.join(' ')}
              label="Word Literal"
              name="literal"
              variant="outlined"
            />
            <select name="source">
              <option value="MW">Merriam-Webster Collegiate Dictionary</option>
              <option value="Oxford">Oxford Dictionary of English</option>
            </select>
            <Button color="primary" variant="outlined" type="submit">Fetch</Button>
          </form>
          {Boolean(wordSuggestion.length) && (
          <Typography color="error" variant="caption">
            {`Your input word does not exist. Did you mean one of ${wordSuggestion.join(' ,')}?`}
          </Typography>
          )}
        </Paper>

        <form className={classes.fillInForm} onSubmit={addWord}>
          <TextField name="literal" variant="outlined" label="Word Literal" />
          <TextField name="phonetic" variant="outlined" label="Phonetic Symbol" />
          <TextField fullWidth multiline rows={3} label="Definition" name="definition" variant="outlined" />
          <TextField fullWidth multiline rows={2} label="Sample Sentence" name="sampleSentence" variant="outlined" />
          <TextField fullWidth multiline rows={2} label="Etymology" name="etymology" variant="outlined" />
          <TextField fullWidth multiline rows={2} label="Related Words" name="related" variant="outlined" />
          <Button type="submit" color="primary" variant="contained">Add</Button>
        </form>

      </Box>
    </Container>
  );
}

export default withUserSignedIn(AddWord);
