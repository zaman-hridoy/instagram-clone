import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { Modal, Button } from 'semantic-ui-react';
import CloseSharp from '@material-ui/icons/CloseRounded';
import './Modal.css';
import { Link } from 'react-router-dom';

const isFollowing = (loggedInFollowing, followerId) => {
    // console.log(loggedInFollowing, followerId)
    const isFollow =  loggedInFollowing?.some(data => data.followingId === followerId);
    // console.log(isFollow);
    return isFollow;
}



const LikerModal = ({ open, setClose, setOpen, likes, user, loggedInFollowing, startFollowing, unFollowing }) => {
    return (
        <Modal
                open={open}
                onClose={setClose}
                onOpen={setOpen}
                className="like_modal_style"
                dimmer={true}
        >
            <div className="modal_header_action">
                    <h4>Likes</h4>
                    <CloseSharp onClick={setClose} style={{ cursor: 'pointer' }} />
            </div>
            {likes && likes.map(liker => (
                <div className="modal__post__likers" key={liker.id}>
                    <div className="modal__user">
                        <Link to={`/accounts/profile/${liker.id}`}>
                            <Avatar 
                                style={{ width: 40, height: 40, cursor: 'pointer', marginRight: 10 }} 
                                className="post__avatar"
                                alt={'profile?.fullname'} 
                                src={ liker.photoURL || "/assets/images/avatar.png" }
                            />
                        </Link>
                        <div>
                            <Link to={`/accounts/profile/${liker.id}`}>
                                <h4>{liker.displayName || "Guest"}</h4>
                            </Link>
                            <h5 style={{ color: 'lightgrey'}}>{liker.fullname}</h5>
                        </div>
                    </div>
                    {liker.id !== user?.uid &&
                    (
                        !isFollowing(loggedInFollowing, liker.id) ? (
                            <div className="modal__user_follow" onClick={() => startFollowing(liker.id)}>follow</div>
                        ) : (
                            <div className="modal__user_unfollow" onClick={() => unFollowing(liker.id)}>Unfollow</div>
                        )
                    )
                    }
                </div>
            ))}
        </Modal>
    );
}

export default LikerModal;
