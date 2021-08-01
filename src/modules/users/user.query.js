


class UserQuery {

    static getAuthors() {
        return db.from('public.authors')
            .where('is_active', true)
            .select([
                'id',
                'name',
                'email_id as emailid', 
                'phone',
                'eligible_for_premium as isEligibleForPremium'
            ]);
    }

    static insertAuthors(authors) {
        return db.from('public.authors')
            .insert(authors)
            .returning(['id']);
    }

    static getUsers() {
        return db.from('public.users')
            .where('is_active', true)
            .select([
                'id',
                'name',
                'email_id', 
                'phone'
            ]);
    }

    static getAllAuthorIds() {
        return db.from('public.authors')
            .where('is_active', true)
            .select([
                db.raw('array_agg(id) as ids')
            ])
    }

}


module.exports = UserQuery;