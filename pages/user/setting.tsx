import React from 'react';
import withUserSignedIn, { WithUserSignedInProps } from 'src/component/withUserSignedIn';
import {
  Container, Typography, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Box, makeStyles, DialogContentText,
} from '@material-ui/core';
import { validateEmailAddress } from 'src/utils/account';
import { useSnackbar } from 'notistack';

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
    displayNameDialog: false,
    displayNameButton: false,
    newDisplayName: '',
    emailDialog: false,
    emailButton: false,
    newEmail: '',
    passwordDialog: false,
    passwordButton: false,
    newPassword: '',
    newPasswordVerify: '',
    deleteAccountDialog: false,
    deleteAccountButton: false,
    deleteAccountVerify: '',
  });

  const openChangeDisplayNameDialog = () => {
    setDialogState((s) => ({ ...s, displayNameDialog: true }));
  };
  const closeChangeDisplayNameDialog = () => {
    setDialogState((s) => ({ ...s, displayNameDialog: false }));
  };
  const openChangeEmailDialog = () => {
    setDialogState((s) => ({ ...s, emailDialog: true }));
  };
  const closeChangeEmailDialog = () => {
    setDialogState((s) => ({ ...s, emailDialog: false }));
  };
  const openChangePasswordDialog = () => {
    setDialogState((s) => ({ ...s, passwordDialog: true }));
  };
  const closeChangePasswordDialog = () => {
    setDialogState((s) => ({ ...s, passwordDialog: false }));
  };
  const openDeleteAccountDialog = () => {
    setDialogState((s) => ({ ...s, deleteAccountDialog: true }));
  };
  const closeDeleteAccountDialog = () => {
    setDialogState((s) => ({ ...s, deleteAccountDialog: false }));
  };

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
      emailButton: validateEmailAddress(newEmail),
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
      enqueueSnackbar(`Successfuly changed display name to "${newDisplayName}".`, { variant: 'success' });
      closeChangeDisplayNameDialog();
    }).catch((e) => {
      enqueueSnackbar(`Failed to change display name.\n${e}`, { variant: 'error' });
    });
  };
  const verifyEmail = () => {
    user.sendEmailVerification().then(() => {
      enqueueSnackbar('Verification email sent. Please check your inbox.', { variant: 'success' });
    });
  };
  const changeEmail = () => {
    const { newEmail } = dialogState;
    user.updateEmail(newEmail)
      .then(() => {
        enqueueSnackbar(`Successfully changed email to "${newEmail}".`, { variant: 'success' });
        closeChangeEmailDialog();
      })
      .catch((e) => {
        enqueueSnackbar(`Failed to change email.\n${e}`, { variant: 'error' });
      });
  };
  const changePassword = () => {
    const { newPassword } = dialogState;
    user.updatePassword(newPassword)
      .then(() => {
        enqueueSnackbar('Successfully change password.', { variant: 'success' });
        closeChangePasswordDialog();
      })
      .catch((e) => {
        enqueueSnackbar(`Failed to change password.\n${e}`, { variant: 'error' });
      });
  };
  const deleteAccount = () => {
    user.delete()
      .then(() => {
        enqueueSnackbar('Account deleted.', { variant: 'success' });
        closeDeleteAccountDialog();
      })
      .catch((e) => {
        enqueueSnackbar(`Failed to change display name.\n${e}`, { variant: 'error' });
      });
  };

  return (
    <Container maxWidth="md" fixed>
      <Box padding={2}>
        {/* Title of the page */}
        <Typography color="textPrimary" variant="h3" gutterBottom>
          Account Settings
        </Typography>

        {/* Display Name Settings */}
        <Typography color="textPrimary" variant="h6" gutterBottom>
          Display Name
        </Typography>
        <Typography color="textSecondary" variant="body1">
          {displayName}
        </Typography>
        <Button variant="text" color="primary" onClick={openChangeDisplayNameDialog}>
          Change Display Name
        </Button>
        <Dialog open={dialogState.displayNameDialog} onClose={closeChangeDisplayNameDialog}>
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
          { email || 'No email specified'}
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
        <Dialog open={dialogState.emailDialog} onClose={closeChangeEmailDialog}>
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
        <Dialog open={dialogState.passwordDialog} onClose={closeChangePasswordDialog}>
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
        <Dialog open={dialogState.deleteAccountDialog} onClose={closeDeleteAccountDialog}>
          <DialogTitle>
            Delete Account
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete your account?Please input your display name to verify.
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
