import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import FavoriteRounded from '@material-ui/icons/FavoriteRounded';
import BookmarkBorderOutlined from '@material-ui/icons/BookmarkBorderOutlined';
import Bookmark from '@material-ui/icons/Bookmark';
import ChatBubbleOutline from '@material-ui/icons/ChatBubbleOutline';
import ShareOutlined from '@material-ui/icons/ShareOutlined';
import NearMeOutlined from '@material-ui/icons/NearMeOutlined';
import { Link } from 'react-router-dom';
import { Slide } from 'react-slideshow-image';
import { connect } from 'react-redux';
import 'react-slideshow-image/dist/styles.css';
import { objectToArray, getLastFiveComments } from '../../utls/utils';

import { addPostLikes, 
    removePostLikes, 
    commentOnPost, 
    saveUserPost, 
    removeSavedPost,
    deletePost
} from '../../actions/postsActions';

import { startFollowing, unFollowing } from '../../actions/authActions';
import LikeModal from '../modals/LikerModal';

class post extends Component {
    state = {
        comment: '',
        open: false,
        openPostOption: false
    }

    commnetHandler = (e) => {
        this.setState({ comment: e.target.value });
    }
    handleCommentSubmit = (e) => {
        e.preventDefault();
        this.props.commentOnPost(this.state.comment, this.props.post.id, this.props.post);
        this.setState({ comment: '' });
    }

    postActionHandler = () => this.setState({ openPostOption: !this.state.openPostOption });

    // modal handler
    setOpen = () => this.setState({ open : true});
    setClose = () => this.setState({ open : false});

    render() {
    const { open, openPostOption } = this.state;
    const { user, post, addPostLikes, removePostLikes, saveUserPost, removeSavedPost, requestedPost, deletePost } = this.props;
    const likes = post && objectToArray(post.likes);
    const savedPosts = post && objectToArray(post.saved);
    const isUsergivLike = post && likes && likes.some(like => like.userId === user?.uid);
    const isUserSaveThisPost = post && savedPosts && savedPosts.some(save => save.id === user?.uid);
    const isEmpty = this.state.comment === '';
    
    const comments = getLastFiveComments(post.comments);
    const isUserPost = user?.uid === post.userId;
    // const IsFollowing = this.props.loggedInUserFollowing?.some(data => data.followingId)
    return (
        <div className="post">
            {/* modal */}
            <LikeModal 
                setOpen={this.setOpen}
                setClose={this.setClose}
                open={open}
                likes={likes}
                startFollowing={this.props.startFollowing}
                unFollowing={this.props.unFollowing}
                loggedInFollowing={this.props.loggedInUserFollowing}
                user={user}
            />
            {/* avatar + username */}
            <div className="post__header">
                <div className="post_header_user">
                    <Link to={`/accounts/profile/${post.userId}`}>
                        <Avatar 
                            style={{ width: 30, height: 30 }} 
                            className="post__avatar" alt="Remy Sharp" 
                            src={post && (post.photoURL || "/assets/images/avatar.png")} 
                        />
                    </Link>

                    <div className="post_username">
                        <Link to={`/accounts/profile/${post.userId}`}>
                            <span>{post && (post.displayName || 'Guest user')}</span>
                        </Link>
                        {/* <p>Ozone Fitness</p> */}
                    </div>
                </div>
                {isUserPost && 
                    <div className="post__actions">
                        <MoreHoriz onClick={this.postActionHandler} style={{ color: '#333', cursor: 'pointer' }} />
                        {openPostOption && 
                            <div className="post__action__items" onClick={() => deletePost(post.id)}>
                                <span>Delete</span>
                            </div>
                        }
                    </div>
                }
            </div>
            {/* captions */}
            {post && post.description && (
                <div className="post__caption">
                    {post.description}
                </div>
            )}
            {/* image slide*/}
            {post && post.images.length > 1 && (
                <Slide easing="ease">
                    {post.images.map((image, index) => (
                        <div className="each-slide" key={index}>
                            {/* <div style={{'backgroundImage': `url(${image})`}}>
                            </div> */}
                            <img 
                                src={image.url} 
                                alt="react"
                                className="post__image"
                            />
                        </div>
                    ))}
                </Slide>
            )}
            {post && post.images.length === 1 && (
                <img 
                    src={post.images[0].url} 
                    alt={post.images[0].name}
                    className="post__image"
                />
            )}
            
            
            {/* love react + comment icon +  share icon */}
            <div className="post__react_comment_share">
                <div className="love_comment_share">
                    {isUsergivLike ? (
                        <FavoriteRounded onClick={() => removePostLikes(post.id)} style={{ color: '#ED4956', cursor: 'pointer' }} />
                    ) : (
                        <FavoriteBorder onClick={() => addPostLikes(post.id)} style={{ color: '#333', cursor: 'pointer' }} />
                    )}
                    <Link to={`/posts/${post.id}`}>
                        <ChatBubbleOutline style={{ color: '#333', cursor: 'pointer' }} />
                    </Link>
                    <ShareOutlined style={{ color: '#333', cursor: 'pointer' }} />
                </div>
                {!isUserPost && <div className="post__bookmark">
                    {isUserSaveThisPost ? (
                        <Bookmark  onClick={() => removeSavedPost(post.id)} style={{ color: '#333', cursor: 'pointer' }} />
                    ) : (
                        <BookmarkBorderOutlined  onClick={() => saveUserPost(post.id)} style={{ color: '#333', cursor: 'pointer' }} />
                    )}
                </div>}
            </div>
            {/* likes number */}
            <div className="likes__count">
                <h5  onClick={this.setOpen} style={{ cursor: 'pointer' }} >{post && (likes?.length || 0) } likes</h5>
            </div>
            {/* username + comments */}
            <div className="post__text_area">
                {post.comments !== undefined && !requestedPost && post.comments.length > 5  && (
                    <Link to={`/posts/${post.id}`}>
                        <p className="post_view_comment_number">View all {post.comments.length} comments</p>
                    </Link>
                )}
                {/* <span className="author_post__text"><strong>zaman_hridoy</strong> WOW! Is this really an instagram clone app???</span> */}
                {comments && !requestedPost && comments.map(comment => (
                    <span 
                        className="post_follower_comment"
                        key={comment.commentId}
                    >
                        <Link to={`/accounts/profile/${post.userId}`}>{comment.displayName}</Link> {comment.comment}
                    </span>
                ))}
                {post?.comments && requestedPost && post?.comments.map(comment => (
                    <span 
                        className="post_follower_comment"
                        key={comment.commentId}
                    >
                        <Link to={`/accounts/profile/${post.userId}`}>{comment.displayName}</Link> {comment.comment}
                    </span>
                ))}
            </div>
            <form className="post__input" onSubmit={this.handleCommentSubmit}>
                <input 
                    type="text" 
                    placeholder="Add a comment..."
                    value={this.state.comment}
                    onChange={this.commnetHandler}
                />
                <button disabled={isEmpty} type="submit" className="post_comment_button">
                    <NearMeOutlined style={{ color: '#333', cursor: 'pointer' }} />
                </button>
            </form>
        </div>
    );  
    }
}

const mapStateToProps = state => ({
    user : state.auth.user,
    loggedInUserFollowing: state.auth.loggedInFollowing
})

const actions = {
    addPostLikes,
    removePostLikes,
    commentOnPost,
    saveUserPost,
    removeSavedPost,
    deletePost,
    startFollowing,
    unFollowing
}

export default connect(mapStateToProps, actions)(post);
