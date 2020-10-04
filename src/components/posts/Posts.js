import React, { Component } from 'react';
import Post from './post';
import { connect } from 'react-redux';
import { getLoggedInUser } from '../../actions/authActions';
import { fetchPosts } from '../../actions/postsActions';

class Posts extends Component {

    componentDidMount() {
        this.props.fetchPosts();
    }

    render() {
        const { posts } = this.props;
        return (
            <div className="app_col_7">
                {posts && posts.map(post => (
                    <Post 
                        key={post.id}
                        post={post}
                    />
                ))}
            </div>
        )
    }
}

const mapStateToProps = state =>({
    posts: state.posts.posts,
    loading: state.posts.loading,
    profile: state.auth.profile
});

const actions = {
    fetchPosts
}

export default connect(mapStateToProps, actions)(Posts);

