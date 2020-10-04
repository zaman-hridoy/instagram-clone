import React from 'react';
import { objectToArray } from '../../../utls/utils';

const ProfilePhotos = ({ profile, selectProfilePhoto }) => {
    const photos = objectToArray(profile?.photos);
    // console.log(photos)
    return (
        <div className="profile__photos">
            {photos?.map(photo => (
                <img 
                    onClick={() => selectProfilePhoto(photo)}
                    key={photo.name}
                    className="profile_photo_image"
                    src={photo.url}
                    alt={photo.name}
                />
            ))}
        </div>
    );
}

export default ProfilePhotos;
