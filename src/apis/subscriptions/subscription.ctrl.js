
const SubscriptionServices = require('../../modules/subscriptions/subscription');
const UserServices = require('../../modules/users/user');
const CommonUtils = require('../../common/commonUtils');
class SubscriptionCtrl {

    /**
     * @description : updates the threshold for premium subscription and the eligibility for the same of every author
     */
    static async updateSubscriptionCap(req, res, next) {
        try {
            
            let currentSubscriptionCaps = await SubscriptionServices.getSubscriptionConstraints();

            let configDiffExists = SubscriptionServices.checkForConstraintDiff(currentSubscriptionCaps, req.body.constraints);
            if ( !configDiffExists ) {
                return res.status(HttpStatus.OK).send({success: true, msg: "No changes in configuration" });   
            }

            //in trx (call in batches) -------------------

            let authorIds = await UserServices.getAllAuthorIds();

            let thresholdMap = SubscriptionServices.createThresholdMap(req.body.constraints);            

            await SubscriptionServices.updateSubscriptionCaps(req.body.constraints);            
            await SubscriptionServices.updateAuthorSubscription(authorIds, thresholdMap);

            return res.status(HttpStatus.OK).send({success: true, msg: "Successfully Updated Threshold and Premium Subscription Eligibility of Authors" });

        } catch (err) {
            console.error(err);
            let statusCode = err.statusCode? err.statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
            let msg = err.msg? err.msg : "Oops! Something Went Wrong!";
            return res.status(statusCode).send({success: false, msg: msg});
        }


    }


     /**
     * @description : updates the eligibility of every author based on thresholds in the db
     */
    static async updateAuthorSubscription(req, res, next) {
        try {
            
            //(call in batches) ------------------------------

            let authorIds = await UserServices.getAllAuthorIds();

            let threshold = await SubscriptionServices.getSubscriptionConstraints();

            let thresholdMap = SubscriptionServices.createThresholdMap(threshold);            

            await SubscriptionServices.updateAuthorSubscription(authorIds, thresholdMap);

            return res.status(HttpStatus.OK).send({success: true, msg: "Successfully Updated Premium Subscription Eligibility of Authors", date: new Date() });

        } catch (err) {
            console.error(err);
            let statusCode = err.statusCode? err.statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
            let msg = err.msg? err.msg : "Oops! Something Went Wrong!";
            return res.status(statusCode).send({success: false, msg: msg});
        }


    }


}


module.exports = SubscriptionCtrl;