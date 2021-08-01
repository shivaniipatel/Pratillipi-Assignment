
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

            let authorIds = await UserServices.getAllAuthorIds();

            let thresholdMap = SubscriptionServices.createThresholdMap(req.body.constraints);            

            await db.transaction(async function(trx) {

                await SubscriptionServices.updateSubscriptionCaps(req.body.constraints, trx);            
                
                for (let i = 0;i < authorIds.length;i += parseInt(500) ) {

                    let batch = authorIds.slice(i, parseInt(i) + parseInt(500));

                    await SubscriptionServices.updateAuthorSubscription(batch, thresholdMap, trx);

                }
            })

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
            
            let authorIds = await UserServices.getAllAuthorIds();

            let threshold = await SubscriptionServices.getSubscriptionConstraints();

            let thresholdMap = SubscriptionServices.createThresholdMap(threshold);            

            for (let i = 0;i < authorIds.length;i += parseInt(500) ) {

                let batch = authorIds.slice(i, parseInt(i) + parseInt(500));

                await SubscriptionServices.updateAuthorSubscription(batch, thresholdMap);

            }

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