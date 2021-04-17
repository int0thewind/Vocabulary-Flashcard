import React from 'react';
import Link from 'next/link';
import {
  Box, Button, Container, makeStyles, MenuItem, Paper, Select, TextField, Typography,
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { useSnackbar } from 'notistack';
import firebase from 'firebase/app';
import withUserSignedIn from '../../src/HOC/withUserSignedIn';
import { addWord, checkWordExist } from '../../src/lib/firebase';
import { Word, WordFetch } from '../../src/type/Word';
import { useFlag } from '../../src/lib/hooks';
import { MWQuery } from '../../src/lib/api';

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
    marginTop: theme.spacing(3),
  },
  fillInForm: {
    marginTop: theme.spacing(3),
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

function AddWord() {
  const classes = addWordStyle();
  const { enqueueSnackbar } = useSnackbar();

  // Add word form input element
  const literalRef = React.useRef<HTMLInputElement>(null);
  const phoneticRef = React.useRef<HTMLInputElement>(null);
  const definitionRef = React.useRef<HTMLInputElement>(null);
  const sampleRef = React.useRef<HTMLInputElement>(null);
  const etymologyRef = React.useRef<HTMLInputElement>(null);
  const relatedRef = React.useRef<HTMLInputElement>(null);

  // Query form related
  const [wordSuggestion, setWordSuggestion] = React.useState<string[]>([]);
  const [source, setSource] = React.useState('MW');
  const onSourceChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    e.preventDefault();
    setSource(e.target.value as string);
  };
  const [fetchButtonClicked, setFetchClickedTrue, setFetchedClickedFalse] = useFlag();

  const submitQueryForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFetchClickedTrue();
    const formData = new FormData(e.currentTarget);
    const literal = formData.get('literal') as string;
    if (source === 'MW') {
      MWQuery(literal).then((val) => {
        if (Array.isArray(val)) setWordSuggestion(val);
        else {
          const {
            literal: lit, phoneticSymbol, definition, sampleSentence, etymology, related,
          } = val as WordFetch;
          setWordSuggestion([]);
          if (literalRef.current) literalRef.current.value = lit ?? '';
          if (phoneticRef.current) phoneticRef.current.value = phoneticSymbol ?? '';
          if (definitionRef.current) definitionRef.current.value = definition ?? '';
          if (sampleRef.current) sampleRef.current.value = sampleSentence ?? '';
          if (etymologyRef.current) etymologyRef.current.value = etymology ?? '';
          if (relatedRef.current) relatedRef.current.value = related?.join(', ') ?? '';
        }
      });
    }
  };

  // Add word form related.
  const submitAddWordForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const literal = data.get('literal');
    if (!literal) {
      enqueueSnackbar('A word must exist', { variant: 'error' });
      return;
    }
    if (!data.get('definition')) {
      enqueueSnackbar('A word must has definition.', { variant: 'error' });
      return;
    }
    checkWordExist(literal as string).then((cond) => {
      if (cond) {
        enqueueSnackbar(`The word "${literal}" has existed.`, { variant: 'error' });
      } else {
        const wordData: Word = {
          literal: literal as string,
          source: fetchButtonClicked ? source : 'Manual',
          definition: data.get('definition') as string,
          phoneticSymbol: data.get('phonetic') as string,
          sampleSentence: data.get('sampleSentence') as string,
          etymology: data.get('etymology') as string,
          related: (data.get('related') as string)
            .split(',').map((s) => s.trim()),
          addedAt: firebase.firestore.Timestamp.now(),
          nextDue: firebase.firestore.Timestamp.now(),
          prevGapDays: 1,
        };
        addWord(wordData).then(() => {
          enqueueSnackbar(`"${literal}" added.`, { variant: 'success' });
        }).catch(() => {
          enqueueSnackbar(`Failed to add word "${literal}"`, { variant: 'error' });
        });
      }
    }).catch((error) => {
      enqueueSnackbar(error, { variant: 'error' });
    });
  };
  const resetAddWordForm = () => setFetchedClickedFalse();

  return (
    <Container fixed maxWidth="md">
      <Box padding={2}>
        <Typography variant="h2" color="textPrimary" gutterBottom>
          Add Word
        </Typography>

        <Link href="/user">
          <Button startIcon={<ArrowBack />} variant="contained" color="primary">
            Back
          </Button>
        </Link>

        <Paper elevation={3} className={classes.queryFormPaper}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Auto Query
          </Typography>
          <form onSubmit={submitQueryForm} className={classes.queryForm}>
            <Autocomplete
              renderInput={(params) => (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <TextField {...params} label="Word Literal" name="literal" variant="outlined" />
              )}
              freeSolo
              options={wordSuggestion}
              style={{ width: 300 }}
            />
            <Select value={source} onChange={onSourceChange}>
              <MenuItem value="MW">Merriam-Webster Collegiate Dictionary</MenuItem>
              <MenuItem value="Oxford">Oxford Dictionary of English</MenuItem>
            </Select>
            <Button type="submit" color="primary" variant="outlined">Fetch</Button>
          </form>
          {Boolean(wordSuggestion.length) && (
          <Typography color="error" variant="caption">
            {`Your input word does not exist. Did you mean one of ${wordSuggestion.join(', ')}?`}
          </Typography>
          )}
        </Paper>

        <form
          className={classes.fillInForm}
          onSubmit={submitAddWordForm}
          onReset={resetAddWordForm}
        >
          <TextField inputRef={literalRef} name="literal" placeholder="Word Literal" />
          <TextField inputRef={phoneticRef} name="phonetic" placeholder="Phonetic Symbol" />
          <TextField inputRef={definitionRef} fullWidth multiline rows={3} placeholder="Definition" name="definition" />
          <TextField inputRef={sampleRef} fullWidth multiline rows={2} placeholder="Sample Sentence" name="sampleSentence" />
          <TextField inputRef={etymologyRef} fullWidth multiline rows={2} placeholder="Etymology" name="etymology" />
          <TextField inputRef={relatedRef} fullWidth multiline rows={2} placeholder="Related Words" name="related" />
          <Button type="submit" color="primary" variant="contained">Add</Button>
          <Button type="reset">Clear Form</Button>
        </form>
      </Box>
    </Container>
  );
}

export default withUserSignedIn(AddWord);
