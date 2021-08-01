


class SubscriptionQuery {

    static getSubscriptionConstraints() {
        return db.from('public.subscription_constraints')
            .where('is_active', true)
            .select([
                'id',
                'name',
                'threshold',
                'code'
            ])
    }


    static updateSubscriptionEligibility(updateQuery) {
        return db.raw(updateQuery);
    }


    static updateSubscriptionCaps(updateQuery) {
        return db.raw(updateQuery);
    }

    

}

module.exports = SubscriptionQuery;