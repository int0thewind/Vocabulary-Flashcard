import React from 'react';
import {
  Container, Typography, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Box, makeStyles, DialogContentText,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { validate as validateEmail } from 'email-validator';
import withUserSignedIn, { WithUserSignedInProps } from 'src/HOC/withUserSignedIn';
import { useFlag } from '../../src/lib/hooks';

const userSettingsStyle = makeStyles((theme) => ({
  hr: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function UserSettings({ user }: WithUserSignedInProps) {
  const classes = userSettingsStyle();
  const { enqueueSnackbar } = useSnackbar();
  const { email, emailVerified, displayName } = user;

  const [dialogState, setDialogState] = React.useState({
    displayNameButton: false,
    newDisplayName: '',
    emailButton: false,
    newEmail: '',
    passwordButton: false,
    newPassword: '',
    newPasswordVerify: '',
    deleteAccountButton: false,
    deleteAccountVerify: '',
  });

  const [displayNameDialog,
    openChangeDisplayNameDialog, closeChangeDisplayNameDialog] = useFlag();
  const [emailDialog, openChangeEmailDialog, closeChangeEmailDialog] = useFlag();
  const [passwordDialog,
    openChangePasswordDialog, closeChangePasswordDialog] = useFlag();
  const [deleteAccountDialog,
    openDeleteAccountDialog, closeDeleteAccountDialog] = useFlag();

  const pushErrorNotification = (e: any) => {
    enqueueSnackbar(`Failed to change display name.\n${e}`, { variant: 'error' });
  };
  const pushSuccessNotification = (s: string) => enqueueSnackbar(s, { variant: 'success' });

  const onNewDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDisplayName = e.currentTarget.value;
    setDialogState((s) => ({
      ...s,
      newDisplayName,
      displayNameButton: Boolean(newDisplayName),
    }));
  };
  const onNewEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.currentTarget.value;
    setDialogState((s) => ({
      ...s,
      newEmail,
      emailButton: validateEmail(newEmail),
    }));
  };
  const onNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.currentTarget.value;
    setDialogState((s) => ({
      ...s,
      newPassword,
      passwordButton: Boolean(newPassword && newPassword === s.newPasswordVerify),
    }));
  };
  const onNewPasswordVerifyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPasswordVerify = e.currentTarget.value;
    setDialogState((s) => ({
      ...s,
      newPasswordVerify,
      passwordButton: Boolean(newPasswordVerify && newPasswordVerify === s.newPassword),
    }));
  };
  const onDeleteAccountVerifyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const deleteAccountVerify = e.currentTarget.value;
    setDialogState((s) => ({
      ...s,
      deleteAccountVerify,
      deleteAccountButton: deleteAccountVerify === displayName,
    }));
  };

  const changeDisplayName = () => {
    const { newDisplayName } = dialogState;
    user.updateProfile({
      displayName: newDisplayName,
    }).then(() => {
      pushSuccessNotification(`Successfully changed display name to "${newDisplayName}".`);
      closeChangeDisplayNameDialog();
    }).catch(pushErrorNotification);
  };
  const verifyEmail = () => {
    user.sendEmailVerification().then(() => {
      pushSuccessNotification('Verification email sent. Please check your inbox.');
    });
  };
  const changeEmail = () => {
    const { newEmail } = dialogState;
    user.updateEmail(newEmail)
      .then(() => {
        pushSuccessNotification(`Successfully changed email to "${newEmail}".`);
        closeChangeEmailDialog();
      })
      .catch(pushErrorNotification);
  };
  const changePassword = () => {
    const { newPassword } = dialogState;
    user.updatePassword(newPassword)
      .then(() => {
        pushSuccessNotification('Successfully change password.');
        closeChangePasswordDialog();
      })
      .catch(pushErrorNotification);
  };
  const deleteAccount = () => {
    user.delete()
      .then(() => {
        pushSuccessNotification('Account deleted.');
        closeDeleteAccountDialog();
      })
      .catch(pushErrorNotification);
  };

  return (
    <Container maxWidth="md" fixed>
      <Box padding={2}>
        {/* Title of the page */}
        <Typography color="textPrimary" variant="h2" gutterBottom>
          Account Settings
        </Typography>

        {/* Display Name Settings */}
        <Typography color="textPrimary" variant="h6" gutterBottom>
          Display Name
        </Typography>
        <Typography color="textSecondary" variant="body1">
          {displayName || 'No display name specified'}
        </Typography>
        <Button variant="text" color="primary" onClick={openChangeDisplayNameDialog}>
          Change Display Name
        </Button>
        <Dialog open={displayNameDialog} onClose={closeChangeDisplayNameDialog}>
          <DialogTitle>Change Display Name</DialogTitle>
          <DialogContent>
            <TextField autoFocus onChange={onNewDisplayNameChange} color="primary" name="displayName" placeholder="New display name" type="text" fullWidth />
          </DialogContent>
          <DialogActions>
            <Button variant="text" onClick={closeChangeDisplayNameDialog}>
              Cancel
            </Button>
            <Button variant="text" onClick={changeDisplayName} color="secondary" disabled={!dialogState.displayNameButton}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
        <Divider className={classes.hr} />

        {/* Email Settings */}
        <Typography color="textPrimary" variant="h6" gutterBottom>
          Email
        </Typography>
        <Typography color="textSecondary" variant="body1">
          {email || 'No email specified'}
        </Typography>
        {emailVerified ? (
          <Button variant="text" color="primary" onClick={openChangeEmailDialog}>
            Change Email
          </Button>
        ) : (
          <>
            <Typography color="textSecondary" variant="caption">
              Your email is not verified.
            </Typography>
            <Button variant="text" color="secondary" onClick={verifyEmail}>
              Verify Email
            </Button>
          </>
        )}
        <Dialog open={emailDialog} onClose={closeChangeEmailDialog}>
          <DialogTitle>Change Email</DialogTitle>
          <DialogContent>
            <TextField onChange={onNewEmailChange} autoFocus color="primary" name="email" placeholder="New email address" type="email" fullWidth />
          </DialogContent>
          <DialogActions>
            <Button variant="text" onClick={closeChangeEmailDialog}>Cancel</Button>
            <Button variant="text" onClick={changeEmail} color="secondary" disabled={!dialogState.emailButton}>Submit</Button>
          </DialogActions>
        </Dialog>
        <Divider className={classes.hr} />

        {/* Password Settings */}
        <Typography color="textPrimary" variant="h6" gutterBottom>
          Password
        </Typography>
        <Button variant="text" color="primary" onClick={openChangePasswordDialog}>
          Change Password
        </Button>
        <Dialog open={passwordDialog} onClose={closeChangePasswordDialog}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField autoFocus onChange={onNewPasswordChange} color="primary" name="password" placeholder="New password" type="password" error={!dialogState.passwordButton} fullWidth />
            <TextField onChange={onNewPasswordVerifyChange} color="primary" name="confirmPassword" placeholder="Confirm new password" type="password" error={!dialogState.passwordButton} fullWidth />
          </DialogContent>
          <DialogActions>
            <Button variant="text" onClick={closeChangePasswordDialog}>Cancel</Button>
            <Button variant="text" onClick={changePassword} color="secondary" disabled={!dialogState.passwordButton}>Submit</Button>
          </DialogActions>
        </Dialog>
        <Divider className={classes.hr} />

        {/* Delete Account */}
        <Button variant="contained" color="secondary" onClick={openDeleteAccountDialog}>
          Delete Account
        </Button>
        <Dialog open={deleteAccountDialog} onClose={closeDeleteAccountDialog}>
          <DialogTitle>
            Delete Account
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete your account?
              Please input your display name to verify.
            </DialogContentText>
            <TextField onChange={onDeleteAccountVerifyChange} color="primary" name="displayNameVerify" placeholder="Confirm display name" type="text" error={!dialogState.deleteAccountButton} fullWidth />
          </DialogContent>
          <DialogActions>
            <Button variant="text" onClick={closeDeleteAccountDialog}>Cancel</Button>
            <Button variant="text" onClick={deleteAccount} color="secondary" disabled={!dialogState.deleteAccountButton}>Delete</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default withUserSignedIn(UserSettings);
