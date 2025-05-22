import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
  Box,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

type DeleteConfirmDialogProps = {
  open: boolean;
  concertName: string;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
};

export default function DeleteConfirmDialog({
  open,
  concertName,
  onClose,
  onConfirm,
  title,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Box display="flex" justifyContent="center" mt={1}>
          <CancelIcon color="error" />
        </Box>
        <Typography align="center" mt={2} fontWeight="bold">
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <DialogContentText align="center">
          &quot;{concertName}&quot;
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", mb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Yes, Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
