import React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@material-ui/data-grid';
import { WordLearningMemo } from '../type/Word';

interface LearnSummaryProps {
  wordsLearned: WordLearningMemo[]
  wordsLearning: WordLearningMemo[]
}

function LearnSummary({ wordsLearned, wordsLearning }: LearnSummaryProps) {
  const columns: GridColDef[] = [
    {
      field: 'literal',
      headerName: 'Word',
      width: 150,
      valueGetter: (params: GridValueGetterParams) => (params.row as WordLearningMemo).word.literal,
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
        (params.row as WordLearningMemo).word.nextDue.seconds * 1000,
      ),
    },
    {
      field: 'gapDays',
      headerName: 'Gap Days',
      width: 150,
      valueGetter: (params: GridValueGetterParams) => (params.row as WordLearningMemo).word.prevGapDays,
    },
    {
      field: 'learned',
      headerName: 'Learned',
      description: 'whether the words are learned in this session',
      width: 125,
      type: 'boolean',
      valueGetter: (params: GridValueGetterParams) => wordsLearned.includes(params.row as WordLearningMemo),
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

export default LearnSummary;
