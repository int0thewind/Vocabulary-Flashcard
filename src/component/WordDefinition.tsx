import React from 'react';
import {
  Button, Dialog, DialogTitle, Divider, List, ListItem, ListItemText, Typography,
} from '@material-ui/core';

export type Definitions = [{
  partOfSpeech: string;
  definitions: [{
    definition: string;
    synonyms: [string];
    example: string;
  }];
}];

type WordDefinitionProps = {
  wordLiteral: string;
  definitions: Definitions;
};

// Currently I would only show google definitions here
export const WordDefinition = (props: WordDefinitionProps) => {
  const { wordLiteral, definitions } = props;
  const [definitionDialogOpen, setDefinitionDialogOpen] = React.useState(false);

  const openDefinitionDialog = () => setDefinitionDialogOpen(true);
  const closeDefinitionDialog = () => setDefinitionDialogOpen(false);

  return (
    <div>
      <Button variant="contained" color="primary" size="small" onClick={openDefinitionDialog}>
        See
      </Button>
      <Dialog onClose={closeDefinitionDialog} open={definitionDialogOpen}>
        <DialogTitle id="simple-dialog-title">{wordLiteral}</DialogTitle>
        <List style={{ padding: 20 }}>
          {definitions.map((definition) => (
            <>
              <Typography variant="h5" color="textPrimary">
                {definition.partOfSpeech}
              </Typography>
              {definition.definitions.map((subDef, index) => (
                <>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={`${index + 1}. ${subDef.definition}`}
                      secondary={(
                        <Typography component="span" variant="body2" color="textPrimary">
                          {subDef.example}
                        </Typography>
                      )}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </>
              ))}
            </>
          ))}
          <ListItem>
            <Button>Forget</Button>
          </ListItem>
        </List>
      </Dialog>
    </div>
  );
};
