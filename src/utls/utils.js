export const objectToArray = obj => {
    if(obj === undefined || obj === null || obj === {}) return [];
    return Object.keys(obj).length > 0 && Object.keys(obj).map(value => {
        const valueOfObject = {
            id: value,
            ...obj[value]
        }
        return valueOfObject;
    });
}

export const getLastFiveComments = (comments) => {
    let sortedComments = [];
    let reverseSortedCommnets = [];
        if(comments !== undefined && comments.length > 0) {
            let count = 0;
            for(let i = comments.length-1; i >= 0; i--) {
                if(count < 5) {
                    sortedComments.push(comments[i]);
                    count ++;
                } 
        }
        if(sortedComments.length > 0) {
            for(let i = sortedComments.length-1; i>=0;  i--) {
                reverseSortedCommnets.push(sortedComments[i]);
            }
        }
    }
    // console.log({sortedComments})
    // console.log({reverseSortedCommnets})
    return reverseSortedCommnets;
}

export const getAllUnfollowerUsers = (alluser, following) => {
    // console.log({alluser})
    // console.log({following})
    if(following.length === 0) return alluser;
    const arrayContainsOnlyFollowingId = following.map(user => user.followingId);
    // console.log(arrayContainsOnlyFollowingId)
    const users = alluser.filter(val => !arrayContainsOnlyFollowingId.includes(val.id));
    
    return users;
}