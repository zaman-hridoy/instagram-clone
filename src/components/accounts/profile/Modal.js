import React from 'react';
import { Modal } from 'semantic-ui-react';
import CloseSharp from '@material-ui/icons/CloseRounded';

const PhotoModal = ({ open, setClose, setOpen, selectedPhoto, setProfilePhoto, deleteProfilePhoto, isLoggedInUser }) => {
    // console.log(selectedPhoto)
    return (
        <Modal
                open={open}
                onClose={setClose}
                onOpen={setOpen}
                className="like_modal_style"
                dimmer={true}
        >
            <div className="modal_header_action">
                    <h4>Photo</h4>
                    <CloseSharp onClick={setClose} style={{ cursor: 'pointer' }} />
            </div>
            <div className="profile__zoom__image__wrapper">
                <img className="profile__photo__zoom" src={selectedPhoto?.url} alt={selectedPhoto?.name} />
            </div>
            { isLoggedInUser && <div className="profile__zoom__action">
                <h4 onClick={() => setProfilePhoto(selectedPhoto?.url)}>Set profile picture</h4>
                <button onClick={() => deleteProfilePhoto(selectedPhoto?.name)}>Delete</button> 
            </div>  }     
        </Modal>
    );
}

export default PhotoModal;
