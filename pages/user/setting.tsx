import React from 'react';
import withUserSignedIn, { WithUserSignedInProps } from 'src/component/withUserSignedIn';
import {
  Paper, Container, Typography, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Box, makeStyles, DialogContentText,
} from '@material-ui/core';

const userSettingsStyle = makeStyles((theme) => ({
  hr: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function UserSettings({ user }: WithUserSignedInProps) {
  const classes = userSettingsStyle();
  const { email, emailVerified, displayName } = user;

  const [changeDisplayNameDialogOpen, setChangeDisplayNameDialogOpen] = React.useState(false);
  const openChangeDisplayNameDialog = () => setChangeDisplayNameDialogOpen(true);
  const closeChangeDisplayNameDialog = () => setChangeDisplayNameDialogOpen(false);

  const newDisplayNameRef = React.useRef<HTMLInputElement>(null);

  const changeDisplayName = () => {
    const newDisplayName = newDisplayNameRef.current?.value;
    if (!newDisplayName) return;
    user.updateProfile({
      displayName: newDisplayName,
    }).then(() => {
      closeChangeDisplayNameDialog();
    });
  };

  const verifyEmail = () => user.sendEmailVerification();

  const [changeEmailDialogOpen, setChangeEmailDialogOpen] = React.useState(false);
  const openChangeEmailDialog = () => setChangeEmailDialogOpen(true);
  const closeChangeEmailDialog = () => setChangeEmailDialogOpen(false);

  const newEmailRef = React.useRef<HTMLInputElement>(null);
  const changeEmail = () => {
    const newEmail = newEmailRef.current?.value;
    if (!newEmail) return;
    user.updateEmail(newEmail)
      .then(() => closeChangeEmailDialog());
  };

  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = React.useState(false);
  const openChangePasswordDialog = () => setChangePasswordDialogOpen(true);
  const closeChangePasswordDialog = () => setChangePasswordDialogOpen(false);

  const newPasswordRef = React.useRef<HTMLInputElement>(null);
  const newPasswordVerifyRef = React.useRef<HTMLInputElement>(null);

  const changePassword = () => {
    const newPassword = newPasswordRef.current?.value;
    const newPasswordVerify = newPasswordVerifyRef.current?.value;
    if (newPassword !== newPasswordVerify || !newPassword) return;
    user.updatePassword(newPassword)
      .then(() => closeChangePasswordDialog());
  };

  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = React.useState(false);
  const openDeleteAccountDialog = () => setDeleteAccountDialogOpen(true);
  const closeDeleteAccountDialog = () => setDeleteAccountDialogOpen(false);

  const deleteAccount = () => {
    user.delete().then(() => {
      closeDeleteAccountDialog();
      window.location.href = '/';
    });
  };

  return (
    <Container maxWidth="md" fixed>
      <Paper elevation={3}>
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
          <Dialog open={changeDisplayNameDialogOpen} onClose={closeChangeDisplayNameDialog}>
            <DialogTitle>Change Display Name</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                inputRef={newDisplayNameRef}
                color="primary"
                name="displayName"
                placeholder="New display name"
                type="text"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button variant="text" autoFocus onClick={closeChangeDisplayNameDialog}>Cancel</Button>
              <Button variant="text" onClick={changeDisplayName} color="secondary">Submit</Button>
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
          {!emailVerified && (
          <>
            <Typography color="textSecondary" variant="caption">
              Your email is not verified.
            </Typography>
            <Button variant="text" color="secondary" onClick={verifyEmail}>
              Verify Email
            </Button>
          </>
          )}
          <Button variant="text" color="primary" onClick={openChangeEmailDialog}>
            Change Email
          </Button>
          <Dialog open={changeEmailDialogOpen} onClose={closeChangeEmailDialog}>
            <DialogTitle>Change Email</DialogTitle>
            <DialogContent>
              <TextField
                inputRef={newEmailRef}
                autoFocus
                color="primary"
                name="email"
                placeholder="New email address"
                type="email"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button variant="text" autoFocus onClick={closeChangeEmailDialog}>Cancel</Button>
              <Button variant="text" onClick={changeEmail} color="secondary">Submit</Button>
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
          <Dialog open={changePasswordDialogOpen} onClose={closeChangePasswordDialog}>
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
              <TextField
                inputRef={newPasswordRef}
                autoFocus
                color="primary"
                name="password"
                placeholder="New password"
                type="password"
                fullWidth
              />
              <TextField
                inputRef={newPasswordVerifyRef}
                autoFocus
                color="primary"
                name="confirmPassword"
                placeholder="Confirm new password"
                type="password"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button variant="text" autoFocus onClick={closeChangePasswordDialog}>Cancel</Button>
              <Button variant="text" onClick={changePassword} color="secondary">Submit</Button>
            </DialogActions>
          </Dialog>
          <Divider className={classes.hr} />

          <Button variant="contained" color="secondary" onClick={openDeleteAccountDialog}>
            Delete Account
          </Button>
          <Dialog open={deleteAccountDialogOpen} onClose={closeDeleteAccountDialog}>
            <DialogTitle>
              Delete Account
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete your account?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant="text" autoFocus onClick={closeDeleteAccountDialog}>Cancel</Button>
              <Button variant="text" onClick={deleteAccount} color="secondary">Delete</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Paper>
    </Container>
  );
}

export default withUserSignedIn(UserSettings);
