

class FollowerQuery {

    static upsertFollowersRaw(followers) {
        return db.raw(followers);
    }

    static getFollowersCount(authorIds) {
        return db.from('public.followers')
            .where('is_active', true)
            .whereIn('author_id', authorIds)
            .select([
                'author_id as authorid', 
                db.raw('COUNT(user_id)::INTEGER as followerscount')
            ])
            .groupBy(['author_id'])
    }

}

module.exports = FollowerQuery;