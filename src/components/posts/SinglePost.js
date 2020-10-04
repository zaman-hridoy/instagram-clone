import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getRequestedPost } from '../../actions/postsActions';
import Post from './post';
import AppLoader from '../common/loader/Loader';

class SinglePost extends Component {
    componentDidMount() {
        this.props.getRequestedPost(this.props.match.params.id, this.props.history);
    }
    componentDidUpdate(prevProps, prevtSate) {
        // console.log(prevProps)
        // console.log(this.props)
        if(prevProps.match.params.id !== this.props.match.params.id) {
            this.props.getRequestedPost(this.props.match.params.id, this.props.history);
        }

    }
    render() {
        const { loading, requestedPost } = this.props;
        if(loading) return <AppLoader />
        return (
            <div className="app__container single__post_wrapper">
                {requestedPost && <Post 
                    post={requestedPost}
                    requestedPost={true}
                />}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    requestedPost: state.posts.requestedPost,
    loading: state.posts.loading
})
const actions = {
    getRequestedPost
}

export default connect(mapStateToProps, actions)(SinglePost);
