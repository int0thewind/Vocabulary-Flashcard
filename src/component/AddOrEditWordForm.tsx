/**
 * Add or Edit Word Form (React Component).
 *
 * This component is used to edit or add a word,
 * consumed by `/user/add` page and edit word dialog.
 *
 * @author Hanzhi Yin
 * @since 0.1.0
 */

import React from 'react';
import {
  Button, makeStyles, MenuItem, Paper, Select, TextField, Typography,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useSnackbar } from 'notistack';
import firebase from 'firebase/app';
import { addWord, checkWordExist, updateWord } from '../lib/firebase';
import { Word, WordFetch, WordUpdate } from '../type/Word';
import { useFlag } from '../lib/hooks';
import { MWQuery } from '../lib/api';

type Props = {
  word?: Word,
};

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

function AddOrEditWordForm(props: Props) {
  const { word: wordToDisplay } = props;
  const isEdit = wordToDisplay !== undefined;

  const classes = addWordStyle();
  const { enqueueSnackbar } = useSnackbar();

  // Add word form input element
  const literalRef = React.useRef<HTMLInputElement>(null);
  const phoneticRef = React.useRef<HTMLInputElement>(null);
  const definitionRef = React.useRef<HTMLInputElement>(null);
  const sampleRef = React.useRef<HTMLInputElement>(null);
  const etymologyRef = React.useRef<HTMLInputElement>(null);
  const relatedRef = React.useRef<HTMLInputElement>(null);

  const fillInForm = (w?: Word | WordFetch) => {
    if (!w) return;
    const {
      literal: lit, phoneticSymbol, definition, sampleSentence, etymology, related,
    } = w;
    if (literalRef.current) literalRef.current.value = lit ?? '';
    if (phoneticRef.current) phoneticRef.current.value = phoneticSymbol ?? '';
    if (definitionRef.current) definitionRef.current.value = definition ?? '';
    if (sampleRef.current) sampleRef.current.value = sampleSentence ?? '';
    if (etymologyRef.current) etymologyRef.current.value = etymology ?? '';
    if (relatedRef.current) relatedRef.current.value = related?.join(', ') ?? '';
  };

  // Fill in previous value if a data object is present.
  React.useEffect(() => { fillInForm(wordToDisplay); }, [isEdit, wordToDisplay]);

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
          setWordSuggestion([]);
          fillInForm(val);
        }
      });
    }
  };
  const submitAddWordForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const literal = formData.get('literal');
    if (!formData.get('definition')) {
      enqueueSnackbar('A word must has definition.', { variant: 'error' });
      return;
    }
    const wordDataUpdate: WordUpdate = {
      source: fetchButtonClicked ? source : 'Manual',
      definition: formData.get('definition') as string,
      phoneticSymbol: formData.get('phonetic') as string,
      sampleSentence: formData.get('sampleSentence') as string,
      etymology: formData.get('etymology') as string,
      related: (formData.get('related') as string)
        .split(',').map((s) => s.trim()),
    };
    if (!isEdit) {
      if (!literal) {
        enqueueSnackbar('A word must exist', { variant: 'error' });
        return;
      }
      checkWordExist(literal as string).then((cond) => {
        if (cond) {
          enqueueSnackbar(`The word "${literal}" has existed.`, { variant: 'error' });
        } else {
          const wordData: Word = {
            literal: literal as string,
            ...wordDataUpdate,
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
    } else {
      updateWord(literal as string, wordDataUpdate).then(() => {
        enqueueSnackbar(`"${literal}" updated.`, { variant: 'success' });
      }).catch((error) => {
        enqueueSnackbar(error, { variant: 'error' });
      });
    }
  };
  const resetAddWordForm = () => setFetchedClickedFalse();

  return (
    <>
      {!isEdit && (
      <Paper variant="outlined" elevation={3} className={classes.queryFormPaper}>
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
      )}

      <form className={classes.fillInForm} onSubmit={submitAddWordForm} onReset={resetAddWordForm}>
        <TextField InputProps={{ readOnly: isEdit }} inputRef={literalRef} name="literal" placeholder="Word Literal" />
        <TextField inputRef={phoneticRef} name="phonetic" placeholder="Phonetic Symbol" />
        <TextField inputRef={definitionRef} fullWidth multiline rows={3} placeholder="Definition" name="definition" />
        <TextField inputRef={sampleRef} fullWidth multiline rows={2} placeholder="Sample Sentence" name="sampleSentence" />
        <TextField inputRef={etymologyRef} fullWidth multiline rows={2} placeholder="Etymology" name="etymology" />
        <TextField inputRef={relatedRef} fullWidth multiline rows={2} placeholder="Related Words" name="related" />
        <Button type="submit" color="primary" variant="contained">
          {isEdit ? 'Update' : 'Add'}
        </Button>
        {!isEdit && <Button type="reset">Clear Form</Button>}
      </form>
    </>
  );
}

AddOrEditWordForm.defaultProps = {
  word: undefined,
};

export default AddOrEditWordForm;
