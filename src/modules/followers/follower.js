
const FollowerQueries = require('./follower.query');
const CommonUtils = require('../../common/commonUtils');

class FollowerService {

     /**
     * @description : upserts a follower againt an author
     */
    static async upsertFollower(followDetails) {

        if (!followDetails.hasOwnProperty('authorid') || !followDetails.hasOwnProperty('userid') || !followDetails.hasOwnProperty('isactive')) {
            throw {statusCode: HttpStatus.BAD_REQUEST, msg: "Missing Parameters"};
        }

        let followers = `INSERT INTO public.followers (author_id, user_id, is_active) VALUES (${followDetails.authorid}, ${followDetails.userid}, ${followDetails.isactive}) ON CONFLICT (author_id, user_id) DO UPDATE SET is_active=${followDetails.isactive}, updated_at=now();`
        
        await FollowerQueries.upsertFollowersRaw(followers);

        return ;

    }


     /**
     * @description : removes a follower againt an author
     */
    static async getFollowersCount(authorIds) {

        if (!CommonUtils.checkIfNotEmptyArray(authorIds)) {
            throw {statusCode: HttpStatus.BAD_REQUEST, msg: "Missing Parameters"};
        }

        let followers = await FollowerQueries.getFollowersCount(authorIds);

        followers = CommonUtils.checkIfNotEmptyArray(followers)? followers : [];

        return followers;

    }

}

module.exports = FollowerService;