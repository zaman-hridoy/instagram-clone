import React from 'react';
import Post from '../../posts/post';


const ProfilePosts = ({posts, loading}) => {
    return (
        <div>
            {posts && posts.map(post => <Post key={post.id} post={post} />)}
        </div>
    );
}

export default ProfilePosts;
