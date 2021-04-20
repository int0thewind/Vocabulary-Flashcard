import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardActionArea, CardActions, CardContent, Button, Container, makeStyles, Paper,
  Tooltip, Typography, IconButton,
} from '@material-ui/core';
import { useRouter } from 'next/dist/client/router';
import { ArrowBack, Help, LibraryBooks } from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import {
  WordLearningMemo, Word, WordDifficulty, WordUpdateDue,
} from '../../src/type/Word';
import withUserSignedIn from '../../src/HOC/withUserSignedIn';
import WordInfo from '../../src/component/WordInfo';
import { useFlag, useToggle } from '../../src/lib/hooks';
import { updateWordDueDate } from '../../src/lib/firebase';
import { clearLearnStorage, readLearnStorage, storeLearnSession } from '../../src/lib/storage';
import HelpDialog from '../../src/dialog/HelpDialog';
import { getWordWithNewDue } from '../../src/lib/word';
import LearnSummary from '../../src/dialog/LearnSummary';

const useStyles = makeStyles((theme) => ({
  toolbar: { marginBottom: theme.spacing(2) },
  toolbarElement: {
    '& > *': { margin: theme.spacing(1) },
  },
  gridContainer: { marginBottom: theme.spacing(3) },
}));

function Learn() {
  // react hooks
  const router = useRouter();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  // states
  const [wordsLearning, setWordsLearning] = useState<WordLearningMemo[]>([]);
  const [wordsLearned, setWordsLearned] = useState<WordLearningMemo[]>([]);
  const [allWordsToLearn, setAllWordsToLearn] = useState<Word[]>([]);
  const [showSummary, setSummaryShown, setSummaryHidden] = useFlag();
  const [helpDialogOpen, openHelpDialog, closeHelpDialog] = useFlag();

  // read localStorage to get data
  useEffect(() => {
    const { learnSession, wordsToLearn } = readLearnStorage();
    // check whether there is stored learn session
    if (learnSession) {
      setAllWordsToLearn(learnSession.allWordsToLearn);
      setWordsLearning(learnSession.wordsLearning);
      setWordsLearned(learnSession.wordsLearned);
    } else if (wordsToLearn) { // else check whether there is stored words to learn
      setAllWordsToLearn(wordsToLearn);
      setWordsLearning(wordsToLearn.map((word) => ({ word, againTimes: 0, rating: null })));
    } else { // Nothing in local storage. Route back to user dashboard.
      enqueueSnackbar('No learning session.', { variant: 'warning' });
      router.replace('/user');
    }
  }, [router, enqueueSnackbar]);

  // set handler for leaving the page:
  // data would be stored if user reload or jump away from the page
  useEffect(() => {
    const leaveHandler = () => {
      if (wordsLearning.length === 0) clearLearnStorage();
      else storeLearnSession({ allWordsToLearn, wordsLearning, wordsLearned });
    };

    window.addEventListener('beforeunload', leaveHandler);
    router.events.on('routeChangeStart', leaveHandler);

    return () => {
      window.removeEventListener('beforeunload', leaveHandler);
      router.events.off('routeChangeStart', leaveHandler);
    };
  }, [router.events, allWordsToLearn, wordsLearned, wordsLearning]);

  const WordCard = ({ word }: { word: WordLearningMemo }) => {
    const [showWordDetail, toggleShowWordDetail] = useToggle(false);

    const updateAndMoveCurrWordToLearned = (newRating: WordDifficulty) => {
      const [currWord, ...rest] = wordsLearning;
      const updatedCurrWord: WordLearningMemo = { ...currWord };
      updatedCurrWord.rating = newRating;
      updatedCurrWord.word = getWordWithNewDue(updatedCurrWord.word, newRating);

      const wordUpdateDue: WordUpdateDue = {
        nextDue: updatedCurrWord.word.nextDue,
        prevGapDays: updatedCurrWord.word.prevGapDays,
      };
      updateWordDueDate(updatedCurrWord.word.literal, wordUpdateDue).catch(() => {
        enqueueSnackbar(`Failed to update "${updatedCurrWord.word.literal}" to firestore.`,
          { variant: 'warning' });
      });

      setWordsLearning(rest);
      setWordsLearned(wordsLearned.concat(updatedCurrWord));
    };

    const handleHard = () => updateAndMoveCurrWordToLearned('hard');
    const handleMedium = () => updateAndMoveCurrWordToLearned('medium');
    const handleEasy = () => updateAndMoveCurrWordToLearned('easy');
    const handleAgain = () => {
      const [currWord, ...rest] = wordsLearning;
      const updatedCurrWord = { ...currWord };
      updatedCurrWord.againTimes += 1;
      setWordsLearning([...rest, updatedCurrWord]);
    };

    // capture keys
    useEffect(() => {
      const keyDownHandler = (event: KeyboardEvent) => {
        switch (event.key) {
          case 'a': handleAgain(); break;
          case 'h': handleHard(); break;
          case 'm': handleMedium(); break;
          case 'e': handleEasy(); break;
          case ' ': event.preventDefault(); toggleShowWordDetail(); break;
          default: break;
        }
      };
      document.addEventListener('keydown', keyDownHandler, false);
      return () => document.removeEventListener('keydown', keyDownHandler, false);
    });

    return (
      <Card>
        <CardActionArea onClick={toggleShowWordDetail}>
          <CardContent>
            <Typography gutterBottom variant="h5" align="center">
              {word.word.literal}
            </Typography>
            {showWordDetail && <WordInfo word={word.word} />}
          </CardContent>
        </CardActionArea>
        <CardActions style={{ justifyContent: 'center' }}>
          <Button size="small" color="primary" onClick={handleEasy}>
            Easy (e)
          </Button>
          <Button size="small" color="primary" onClick={handleMedium}>
            Medium (m)
          </Button>
          <Button size="small" color="primary" onClick={handleHard}>
            Hard (h)
          </Button>
          <Button size="small" color="primary" onClick={handleAgain}>
            Again (a)
          </Button>
        </CardActions>
      </Card>
    );
  };

  return (
    <Container maxWidth="md" fixed>
      <Box padding={2}>
        {/* Title */}
        <Typography color="textPrimary" variant="h2" gutterBottom>
          Learn Words
        </Typography>

        {/* Help Panel */}
        <Paper className={classes.toolbar} variant="outlined" elevation={3}>
          <Box
            className={classes.toolbarElement}
            display="flex"
            flexDirection="row"
            justifyContent="flex-start"
            alignItems="center"
            flexWrap="wrap"
          >
            <Typography color="textSecondary" style={{ padding: 10 }} gutterBottom>
              {wordsLearning.length > 0
                ? `You have learned ${wordsLearned.length} / ${allWordsToLearn.length} words.`
                : `You have successfully learned ${wordsLearned.length} words.`}
            </Typography>

            <div style={{ flex: 1 }} />

            {wordsLearning.length > 0 && (
              <>
                <Tooltip title="Help">
                  <IconButton onClick={openHelpDialog}>
                    <Help />
                  </IconButton>
                </Tooltip>

                {!showSummary ? (
                  <Button startIcon={<LibraryBooks />} variant="outlined" color="primary" onClick={setSummaryShown}>
                    Show Summary
                  </Button>
                ) : (
                  <Button startIcon={<ArrowBack />} variant="outlined" color="primary" onClick={setSummaryHidden}>
                    Back
                  </Button>
                )}
              </>
            )}

            {wordsLearning.length === 0 && (
              <Button startIcon={<ArrowBack />} variant="outlined" color="primary" onClick={() => router.push('/user')}>
                Back to dashboard
              </Button>
            )}
          </Box>
        </Paper>

        {/* Card / Summary */}
        {wordsLearning.length > 0 && !showSummary
          ? <WordCard word={wordsLearning[0]} />
          : <LearnSummary wordsLearned={wordsLearned} wordsLearning={wordsLearning} />}
      </Box>
      <HelpDialog open={helpDialogOpen} onClose={closeHelpDialog} />
    </Container>
  );
}

export default withUserSignedIn(Learn);
