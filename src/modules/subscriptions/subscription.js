
const SubscriptionQuery = require('./subscription.query');
const CommonUtils = require('../../common/commonUtils');
const FollowerServices = require('../followers/follower');
const ArticleServices = require('../articles/article');
const Constants = require('../../common/constants');
const _ = require('lodash');

class SubscriptionService {

     /**
     * @description : returns the list of set thresholds for the premium subscription
     */
    static async getSubscriptionConstraints() {

        let subscriptionCaps = await SubscriptionQuery.getSubscriptionConstraints();

        subscriptionCaps = CommonUtils.checkIfNotEmptyArray(subscriptionCaps) ? subscriptionCaps : [];

        return subscriptionCaps;

    }


     /**
     * @description : returns a map of thresholds for the premium subscription [code => threshold]
     */
    static createThresholdMap(subscriptionCaps) {

        if (!CommonUtils.checkIfNotEmptyArray(subscriptionCaps)) return {};

        let subscriptionMap = {}
        subscriptionCaps.forEach(obj => subscriptionMap[obj.code] = obj.threshold);

        return subscriptionMap;
    }

    
    /**
     * @description : returns a bool if there is a difference in config between new and existing threshold 
     */
    static checkForConstraintDiff(newConfigs=[], oldConfigs=[]) {

        let oldConfigsMap = new Map();

        oldConfigs.forEach(obj => {
            oldConfigsMap.set(obj.code, obj.threshold);
        })

        let configDiffExists = false;

        for (let newconfig of newConfigs) {
            let oldconfigThreshold = oldConfigsMap.get(newconfig.code);

            if (oldconfigThreshold && oldconfigThreshold != newconfig.threshold ) {
                configDiffExists = true;
                break;
            }

        }

        return configDiffExists;
    }


    /**
     * @description : updates threshold for premium subscription in the db 
     */
    static async updateSubscriptionCaps(newConstraints, trx) {

        if (!CommonUtils.checkIfNotEmptyArray(newConstraints)) {
            return ;
        }

        let queries = '';

        for (let tuple of newConstraints) {

            queries += `UPDATE public.subscription_constraints SET is_active = true, threshold = ${tuple.threshold}, updated_at = now() WHERE code = \'${tuple.code}\'; `;

        }

        await SubscriptionQuery.updateSubscriptionCaps(queries, trx);

        return ;

    }


    /**
     * @description : service to update author's eligibility for the premium subscription 
     */
    static async updateAuthorSubscription(authorIds=[], constraints={}, trx) {

        if (Object.keys(constraints).length==0) {
            throw {statusCode: HttpStatus.BAD_REQUEST, msg: "All Subscription Constraints Are Required"};
        } 

        let authorsEligibility = {};
        authorIds.forEach(id => authorsEligibility[id] = {});

        if (constraints.hasOwnProperty(Constants.SUBSCRIPTION_CAP_CODE.followers_count)) {

            let followers = await FollowerServices.getFollowersCount(authorIds);
            followers = followers? followers : [];
            
            let followersMap = {};
            followers.forEach(obj => followersMap[obj.authorid] = obj.followerscount);

            await this.updateEligibilityByFollowers(authorsEligibility, followersMap, constraints[Constants.SUBSCRIPTION_CAP_CODE.followers_count] )

        } else {
            throw {statusCode: HttpStatus.BAD_REQUEST, msg: "All Subscription Constraints Are Required"};
        }

        if (constraints.hasOwnProperty(Constants.SUBSCRIPTION_CAP_CODE.minimum_articles) && constraints.hasOwnProperty(Constants.SUBSCRIPTION_CAP_CODE.publishing_window_hour)) {

            let publishedArticles = await ArticleServices.getCappedArticles(authorIds, constraints[Constants.SUBSCRIPTION_CAP_CODE.minimum_articles] );

            let publishedArticlesMap = _.groupBy(publishedArticles, 'authorid');

            await this.updateEligibilityByArticles(authorsEligibility, publishedArticlesMap, constraints );

        } else {
            throw {statusCode: HttpStatus.BAD_REQUEST, msg: "All Subscription Constraints Are Required"};
        }

        let updateQuery = this.getUpdatedSubscription(authorsEligibility);

        await SubscriptionQuery.updateSubscriptionEligibility(updateQuery, trx);

        return ;

    }


    /**
     * @description : returns a map of author against the flag to indicate if the author passed the popularity threshold 
     */
    static updateEligibilityByFollowers(authorsEligibility, followersMap, followersCap) {

        for (let authorid of Object.keys(authorsEligibility)) {

            authorsEligibility[authorid].popularitypassed = false;

            if (followersMap[authorid] && followersMap[authorid] >= followersCap) {
                authorsEligibility[authorid].popularitypassed = true;
            }

        }
        
        return ;
    }


    /**
     * @description : returns a map of author against the flag to indicate if the author passed activeness test 
     */
    static updateEligibilityByArticles(authorsEligibility, publishedArticlesMap, constraints) {

        let capTimeInMilisec = constraints[Constants.SUBSCRIPTION_CAP_CODE.publishing_window_hour]*60*60*1000;
        let capArticles = constraints[Constants.SUBSCRIPTION_CAP_CODE.minimum_articles];
        let nowInMilisec = (new Date).getTime();

        for (let authorid of Object.keys(authorsEligibility)) {

            authorsEligibility[authorid].activenesspassed = false;

            let articlesInCapTime = [];
            if (publishedArticlesMap[authorid] && publishedArticlesMap[authorid].length) { 
                articlesInCapTime = publishedArticlesMap[authorid].filter(obj => ( nowInMilisec - (obj.articlecreatedat).getTime() ) <= capTimeInMilisec ) ;
            }

            let minArticlesPresent = articlesInCapTime.length >= capArticles? true : false;

            if (minArticlesPresent) {
                authorsEligibility[authorid].activenesspassed = true;
            }

        }
        
        return ;

    }


    /**
     * @description : returns query to update authors eligibility for premium subscription
     */
    static getUpdatedSubscription(authorsEligibility) {

        let updateQueries = '';

        for (let authorid of Object.keys(authorsEligibility)) {

            let isEligibleForPremium = false;

            if (authorsEligibility[authorid]['activenesspassed'] && authorsEligibility[authorid]['popularitypassed']) {
                isEligibleForPremium = true;
            }

            let query = `UPDATE public.authors SET eligible_for_premium = ${isEligibleForPremium}, updated_at = now() WHERE id = ${authorid}; `;

            updateQueries += query;
        }

        return updateQueries;
    }

}

module.exports = SubscriptionService;