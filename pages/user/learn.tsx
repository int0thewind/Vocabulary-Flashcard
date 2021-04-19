import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { useRouter } from 'next/dist/client/router';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { DataGrid, GridColDef, GridValueGetterParams } from '@material-ui/data-grid';
import {
  ArrowBack, ArrowRightAlt, Help, LibraryBooks, Shuffle,
} from '@material-ui/icons';
import Slide from '@material-ui/core/Slide';
import firebase from 'firebase';
import { useSnackbar } from 'notistack';
import { MemoWord, Word } from '../../src/type/Word';
import withUserSignedIn from '../../src/HOC/withUserSignedIn';
import WordInfo from '../../src/component/WordInfo';
import { useFlag } from '../../src/lib/hooks';
import { updateWord } from '../../src/lib/firebase';
import { clearLearnStorage, readLearnStorage, storeLearnSession } from '../../src/lib/storage';

const shuffleArray = (arr: any[]) => arr.sort(() => Math.random() - 0.5);

const getWordWithNewDue = (word: Word, rating: 'hard' | 'medium' | 'easy'): Word => {
  const secondsForOneDay = 24 * 60 * 60;
  const learningGapDay = {
    hard: 1, // one day
    medium: 4, // 4 days
    easy: 7, // 7 days
  };
  return {
    ...word,
    prevGapDays: learningGapDay[rating],
    nextDue: firebase.firestore.Timestamp.fromMillis(
      (word.nextDue.seconds + word.prevGapDays * secondsForOneDay) * 1000,
    ),
  };
};

const useStyles = makeStyles((theme) => ({
  root: {},
  toolbar: { marginBottom: theme.spacing(2) },
  toolbarElement: {
    '& > *': { margin: theme.spacing(1) },
  },
  gridContainer: { marginBottom: theme.spacing(3) },
}));

interface LearnSummaryProps {
  wordsLearned: MemoWord[]
  wordsLearning: MemoWord[]
}

function LearnSummary({ wordsLearned, wordsLearning }: LearnSummaryProps) {
  const columns: GridColDef[] = [
    {
      field: 'literal',
      headerName: 'Word',
      width: 150,
      valueGetter: (params: GridValueGetterParams) => (params.row as MemoWord).word.literal,
    },
    {
      field: 'againTimes',
      description: 'how many agains in this session',
      headerName: 'Again',
      width: 100,
    },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 100,
    },
    {
      field: 'nextDue',
      headerName: 'Next Due',
      type: 'dateTime',
      width: 200,
      valueGetter: (params: GridValueGetterParams) => new Date(
        (params.row as MemoWord).word.nextDue.seconds * 1000,
      ),
    },
    {
      field: 'gapDays',
      headerName: 'Gap Days',
      width: 150,
      valueGetter: (params: GridValueGetterParams) => (params.row as MemoWord).word.prevGapDays,
    },
    {
      field: 'learned',
      headerName: 'Learned',
      description: 'whether the words are learned in this session',
      width: 125,
      type: 'boolean',
      valueGetter: (params: GridValueGetterParams) => wordsLearned.includes(params.row as MemoWord),
    },
  ];

  return (
    <div style={{ height: 800, width: '100%' }}>
      <DataGrid
        rows={wordsLearned.concat(wordsLearning)}
        columns={columns}
        pageSize={25}
        checkboxSelection
        getRowId={(word) => word.word.literal}
      />
    </div>
  );
}

function HelpDialog(props: { open: boolean, onClose: () => void }) {
  const { open, onClose } = props;
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Help</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          You can click corresponding buttons or use keyboards:
        </Typography>
        <div style={{ paddingLeft: 20 }}>
          <Typography gutterBottom>
            To show the definition, click the card or press space.
          </Typography>
          <Typography gutterBottom>
            <b>Easy(e)</b>
            : This word is easy for you. Its next due would one week later.
          </Typography>
          <Typography gutterBottom>
            <b>Medium(m)</b>
            : This word is easy for you. Its next due would three days later.
          </Typography>
          <Typography gutterBottom>
            <b>Hard(e)</b>
            : This word is hard for you. Its next due would one day later.
          </Typography>
          <Typography gutterBottom>
            <b>Again(a)</b>
            : You does not recognize this word. It would stay in the session.
          </Typography>
        </div>
        <Typography gutterBottom>
          When learning,
          you can also click the button to change the order of words to random or ordered.
        </Typography>
        <Typography gutterBottom>
          {/* eslint-disable-next-line max-len */}
          Please note that a learn session would not update the due date of words before it is finished.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose} color="primary">
          Got it!
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Learn() {
  // react hooks
  const router = useRouter();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  // states
  const [wordsLearning, setWordsLearning] = useState([] as MemoWord[]);
  const [wordsLearned, setWordsLearned] = useState([] as MemoWord[]);
  const [allWordsToLearn, setAllWordsToLearn] = useState([] as Word[]);
  const [isInvalidLearn, setIsInvalidLearn] = useState(false);
  const [whetherShowSummary, setShowSummary] = useState(false);
  const [isRandom, setIsRandom] = useState(false);
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
      setWordsLearning(wordsToLearn.map(
        (word) => ({ word, againTimes: 0, rating: null }),
      ));
    } else {
      // no valid data
      setIsInvalidLearn(true);
    }
  }, []);

  // if there is no valid learn session, jump back to the user page
  useEffect(() => {
    if (isInvalidLearn) {
      // if invalid, leave the page
      const goBackToUserPageAfter3Seconds = () => {
        setTimeout(() => {
          router.replace('/user');
        }, 1500);
      };
      goBackToUserPageAfter3Seconds();
    }
  }, [isInvalidLearn, router]);

  /*
    set handler for leaving the page:
    data would be stored if user reload or jump away from the page
  */
  useEffect(() => {
    const leaveHandler = () => {
      if (wordsLearning.length === 0) {
        // remove learn session since it is done
        clearLearnStorage();
      } else {
        // store current learn session when leaving
        storeLearnSession({
          allWordsToLearn,
          wordsLearning,
          wordsLearned,
        });
      }
    };
    window.addEventListener('beforeunload', leaveHandler);
    router.events.on('routeChangeStart', leaveHandler);
    return () => {
      window.removeEventListener('beforeunload', leaveHandler);
      router.events.off('routeChangeStart', leaveHandler);
    };
  }, [router.events, allWordsToLearn, wordsLearned, wordsLearning]);

  const WordCard = ({ word }: { word: MemoWord }) => {
    const [whetherShowWordDetail, setShowWordDetail] = useState(false);

    const updateAndMoveCurrWordToLearned = (newRating: 'hard' | 'medium' | 'easy') => {
      const [currWord, ...rest] = wordsLearning;
      const updatedCurrWord = { ...currWord };
      updatedCurrWord.rating = newRating;
      updatedCurrWord.word = getWordWithNewDue(updatedCurrWord.word, newRating);

      updateWord(updatedCurrWord.word.literal, updatedCurrWord.word)
        .then()
        .catch(() => {
          enqueueSnackbar(`Failed to send update for word ${updatedCurrWord.word.literal} to firestore! Please check the connection.`,
            { variant: 'warning' });
        });

      setWordsLearning(shuffleArray(rest));
      setWordsLearned(wordsLearned.concat(updatedCurrWord as MemoWord));
    };

    const handleHard = () => {
      updateAndMoveCurrWordToLearned('hard');
    };

    const handleMedium = () => {
      updateAndMoveCurrWordToLearned('medium');
    };

    const handleEasy = () => {
      updateAndMoveCurrWordToLearned('easy');
    };

    const handleAgain = () => {
      const [currWord, ...rest] = wordsLearning;
      const updatedCurrWord = { ...currWord };
      updatedCurrWord.againTimes += 1;
      setWordsLearning([...shuffleArray(rest), updatedCurrWord]);
    };

    // capture keys
    useEffect(() => {
      const keyDownHandler = (event: KeyboardEvent) => {
        switch (event.key) {
          case 'a':
            handleAgain();
            break;
          case 'h':
            handleHard();
            break;
          case 'm':
            handleMedium();
            break;
          case 'e':
            handleEasy();
            break;
          case ' ':
            event.preventDefault();
            setShowWordDetail(true);
            break;
          default:
            break;
        }
      };
      document.addEventListener('keydown', keyDownHandler, false);
      return () => {
        document.removeEventListener('keydown', keyDownHandler, false);
      };
    });

    return (
      <Slide in timeout={750} direction="right" mountOnEnter unmountOnExit>
        <Card className={classes.root}>
          <CardActionArea onClick={() => setShowWordDetail(true)}>
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                style={{
                  textAlign: 'center',
                }}
              >
                {word.word.literal}
              </Typography>
              {whetherShowWordDetail ? <WordInfo word={word.word} /> : null}
            </CardContent>
          </CardActionArea>
          <CardActions style={{
            justifyContent: 'center',
            padding: 20,
          }}
          >
            <Button size="large" variant="contained" color="primary" onClick={handleAgain}>
              Again
            </Button>
            <Button size="large" variant="contained" color="primary" onClick={handleHard}>
              Hard
            </Button>
            <Button size="large" variant="contained" color="primary" onClick={handleMedium}>
              Medium
            </Button>
            <Button size="large" variant="contained" color="primary" onClick={handleEasy}>
              Easy
            </Button>
          </CardActions>
        </Card>
      </Slide>
    );
  };

  const Panel = () => (
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

        {wordsLearning.length > 0 ? (
          <>
            <Tooltip title="The order of words" placement="bottom">
              {isRandom
                ? (
                  <Button
                    startIcon={<Shuffle />}
                    onClick={() => setIsRandom(false)}
                  >
                    Random
                  </Button>
                )
                : (
                  <Button
                    startIcon={<ArrowRightAlt />}
                    onClick={() => setIsRandom(true)}
                  >
                    Order
                  </Button>
                )}
            </Tooltip>

            <Button startIcon={<Help />} onClick={openHelpDialog} tabIndex={-1}>Help</Button>

            {!whetherShowSummary ? (
              <Tooltip title="View the summary of the current session" placement="bottom">
                <Button
                  startIcon={<LibraryBooks />}
                  variant="outlined"
                  color="primary"
                  onClick={() => setShowSummary(true)}
                >
                  Summary
                </Button>
              </Tooltip>
            ) : (
              <Button
                startIcon={<ArrowBack />}
                variant="outlined"
                color="primary"
                onClick={() => setShowSummary(false)}
              >
                Back
              </Button>
            )}
          </>
        ) : (
          <Button
            startIcon={<ArrowBack />}
            variant="outlined"
            color="primary"
            onClick={() => router.push('/user')}
          >
            Back to dashboard
          </Button>
        )}

      </Box>
    </Paper>
  );

  if (isInvalidLearn) {
    return (
      <Typography color="error">No words to learn! Please go to the dashboard first!</Typography>
    );
  }
  return (
    <Container maxWidth="md" fixed>
      <Box padding={2}>
        {/* Title */}
        <Typography color="textPrimary" variant="h2" gutterBottom>
          Learn Words
        </Typography>
        {/* Help Panel */}
        <Panel />
        {/* Card / Summary */}
        {wordsLearning.length > 0 && !whetherShowSummary
          ? <WordCard word={wordsLearning[0]} />
          : <LearnSummary wordsLearned={wordsLearned} wordsLearning={wordsLearning} />}
      </Box>
      <HelpDialog open={helpDialogOpen} onClose={closeHelpDialog} />
    </Container>
  );
}

export default withUserSignedIn(Learn);
