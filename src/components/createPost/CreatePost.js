import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { Modal, Button } from 'semantic-ui-react';
import CloseSharp from '@material-ui/icons/CloseRounded';
import EmojiEmotions from '@material-ui/icons/EmojiEmotions';
import InsertPhoto from '@material-ui/icons/InsertPhoto';
import './CreatePost.css';
import { Link } from 'react-router-dom';
import Picker, { SKIN_TONE_LIGHT } from 'emoji-picker-react';
import Dropzone from 'react-dropzone';
import { Progress } from 'semantic-ui-react';

import { createPost } from '../../actions/postsActions';
import { connect } from 'react-redux';

class CreatePost extends Component {
    state = {
        emojiObject: '',
        showEmojiPicker: false,
        description: '',
        files: [],
        previewUrls: []
    }
    onEmojiClick = (event, emojiObject) => {
        let description = this.state.description;
        let valueWithEmoji = `${description} ${emojiObject.emoji}`;
        this.setState({
            emojiObject, 
            showEmojiPicker: false,
            description: valueWithEmoji
        });
        
    };
    handleShowPicker = () => this.setState({ showEmojiPicker: !this.state.showEmojiPicker });

    changneHandler = event => {
        this.setState({ description: event.target.value });
    }

    handleUploadFiles = files => {
        let isImage = false;
        let previewUrls = [];
        if(files) {
            files.forEach(file => {
                if(file.type === 'image/png' || file.type === 'image/jpeg') {
                    let previewUrl = URL.createObjectURL(file);
                    previewUrls.push(previewUrl);
                    isImage= true;
                }
            })
        }
        if(isImage) {
            this.setState({ 
                files, 
                previewUrls
            })
        }
    }

    clearPostonCloseModal = () => {
        this.props.setClose();
        this.setState({
            emojiObject: '',
            showEmojiPicker: false,
            description: '',
            files: [],
            previewUrls: []
        })
    }

    handleSubmitPost = event => {
        event.preventDefault();
        const { description, files } = this.state;
        const post = {
            description,
            files
        }
        this.props.createPost(post);
        this.setState({
            emojiObject: '',
            showEmojiPicker: false,
            description: '',
            files: [],
            previewUrls: []
        })
    }

    render() {
        const { open, setClose, setOpen, profile, isProgress, progress, loading } = this.props;
        const { showEmojiPicker, description, previewUrls } = this.state;
        let isvalidForm = false;
        if(this.state.description !== '' || this.state.description.length > 0 || previewUrls.length > 0) {
            isvalidForm = true;
        }
        return (
            <Modal
                open={open}
                onClose={setClose}
                onOpen={setOpen}
                className="modal_style"
                dimmer={true}
            >
                <div className="create_post_header">
                    <h4>Create Post</h4>
                    <CloseSharp onClick={this.clearPostonCloseModal} style={{ cursor: 'pointer' }} />
                </div>
                <div className="create_post_user">
                    <Link to={`/accounts/profile/${profile?.id}`}>
                        <Avatar 
                            style={{ width: 40, height: 40, cursor: 'pointer', marginRight: 10 }} 
                            className="post__avatar"
                            alt={profile?.fullname} 
                            src={ profile?.photoURL || "/assets/images/avatar.png"}
                        />
                    </Link>
                    <h4>{profile?.displayName || 'Guest'}</h4>
                </div>
                <form className="create_post_form" onSubmit={this.handleSubmitPost}>
                    <textarea 
                        name="description"
                        type="text"
                        placeholder={`What's on your mind${profile && ' , '+profile.displayName}?`}
                        rows={3}
                        className="create_post_input"
                        value={description}
                        onChange={this.changneHandler}
                    />
                    <div className="preview_post_images">
                        {previewUrls && previewUrls.map((url, index) => (
                            <img 
                                key={index} 
                                src={url} 
                                alt="preview"
                                className="preview_image"
                            />
                        ))}
                    </div>
                    <div className="emoji_picker_wrapper">
                        <div className="post_upload_photo">
                            <Dropzone 
                                onDrop={acceptedFiles => this.handleUploadFiles(acceptedFiles)}
                                multiple={true}
                            >
                                {({getRootProps, getInputProps}) => (
                                    <section>
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <InsertPhoto style={{ width: 35, height: 35, color: 'greenyellow', cursor: 'pointer' }} />
                                    </div>
                                    </section>
                                )}
                            </Dropzone>
                        </div>
                        {showEmojiPicker && (
                            <div className="emoji__picker">
                                <Picker 
                                    onEmojiClick={this.onEmojiClick} 
                                    skinTone={SKIN_TONE_LIGHT}
                                />
                            </div>
                        )}
                        <EmojiEmotions 
                            onClick={this.handleShowPicker}
                            style={{ 
                                color: "silver", 
                                cursor: 'pointer', 
                                width: 35, 
                                height: 35,
                                float: 'right'
                            }} />
                    </div>
                    {isProgress && <Progress percent={progress} size='tiny' className="post__progress" style={{ margin: '5px 0' }} />}
                    <Button
                        disabled={!isvalidForm} 
                        type="submit" 
                        className="create_post_button"
                        color="facebook"
                        style={{ margin: '10px 0' }}
                        loading={loading}
                    >
                        Post
                    </Button>
                    {/* <button disabled={!isvalidForm} type="submit" className="create_post_button">Post</button> */}
                </form>
            </Modal>
        );
    }
}

const actions = {
    createPost
}

const mapStateToProps = state => ({
    profile: state.auth.profile,
    progress: state.posts.progress,
    isProgress: state.posts.isProgress,
    loading: state.posts.loading
})

export default connect(mapStateToProps, actions)(CreatePost);

