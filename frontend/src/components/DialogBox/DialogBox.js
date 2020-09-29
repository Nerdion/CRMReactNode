import React, { Component } from 'react';

//Material UI
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText
} from '@material-ui/core/';

class DialogBox extends Component {
    render() {
        const { DialogHeader, DialogContentTextData, children, DialogButtonText1, DialogButtonText2, onClose, onOpen, OnClick_Bt1, OnClick_Bt2, disableBackdropClick } = this.props;
        return (
            <div>
                <Dialog disableBackdropClick={disableBackdropClick} open={onOpen} onClose={onClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">{DialogHeader}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {DialogContentTextData}
                        </DialogContentText>
                        {children}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={OnClick_Bt1} color="primary">
                            {DialogButtonText1}
                        </Button>
                        <Button onClick={OnClick_Bt2} color="primary">
                            {DialogButtonText2}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default DialogBox
