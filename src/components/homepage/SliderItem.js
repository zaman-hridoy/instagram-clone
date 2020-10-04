import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';

const SliderItem = ({user, startFollowing}) => {
    return (
        <div className="slick__item" key={user.id}>
            <div className="slick__each_user">
                    <Link to={`/accounts/profile/${user.id}`}>
                        <Avatar 
                            style={{ width: 50, height: 50, marginRight: 10 }} 
                            className="post__avatar" alt={user.displayName} 
                            src={user.photoURL || "/assets/images/avatar.png"} 
                        />
                    </Link>
                    <h4>{user.displayName}</h4>
                    <div className="slick_follow" onClick={() => startFollowing(user.id)}>follow</div>
            </div>
        </div>
    );
}

export default SliderItem;
