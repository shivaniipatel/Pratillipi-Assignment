
const UserServices = require('../../modules/users/user');
const FollowerServices = require('../../modules/followers/follower');
const SubscriptionServices = require('../../modules/subscriptions/subscription');


class FollowerCtrl {

    static async followAuthor(req, res, next) {
        try {
            
            //authorid, userid, isactuve=true 

            //check if author exists 
            let authorExists = await UserServices.checkIfAuthorExists({id: req.body.authorid});
            if (!authorExists) {
                throw {statusCode: HttpStatus.BAD_REQUEST, msg: "Invalid Author Id"};
            }
            //check if user exists 
            let userExists = await UserServices.checkIfUserExists({id: req.body.userid});
            if (!userExists) {
                throw {statusCode: HttpStatus.BAD_REQUEST, msg: "Invalid User Id"};
            }

            //service to update premium of author
            let threshold = await SubscriptionServices.getSubscriptionConstraints();
            
            let thresholdMap = SubscriptionServices.createThresholdMap(threshold);     

            //upsert 
            await FollowerServices.upsertFollower({authorid: req.body.authorid, userid: req.body.userid, isactive: true});
            
            await SubscriptionServices.updateAuthorSubscription([req.body.authorid], thresholdMap);

            return res.status(HttpStatus.OK).send({success: true, msg: "Successfully Followed The Author" });

        } catch (err) {
            console.error(err);
            let statusCode = err.statusCode? err.statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
            let msg = err.msg? err.msg : "Oops! Something Went Wrong!";
            return res.status(statusCode).send({success: false, msg: msg});
        }


    }

    
    static async unfollowAuthor(req, res, next) {
        try {
            
            //check if author exists 
            let authorExists = await UserServices.checkIfAuthorExists({id: req.body.authorid});
            if (!authorExists) {
                throw {statusCode: HttpStatus.BAD_REQUEST, msg: "Invalid Author Id"};
            }
            //check if user exists 
            let userExists = await UserServices.checkIfUserExists({id: req.body.userid});
            if (!userExists) {
                throw {statusCode: HttpStatus.BAD_REQUEST, msg: "Invalid User Id"};
            }

            //service to update premium of author
            let threshold = await SubscriptionServices.getSubscriptionConstraints();
            
            let thresholdMap = SubscriptionServices.createThresholdMap(threshold);     

            //upsert 
            await FollowerServices.upsertFollower({authorid: req.body.authorid, userid: req.body.userid, isactive: false});

            //service to update premium of author
            await SubscriptionServices.updateAuthorSubscription([req.body.authorid], thresholdMap);

            return res.status(HttpStatus.OK).send({success: true, msg: "Successfully Unfollowed The Author"  });

        } catch (err) {
            console.error(err);
            let statusCode = err.statusCode? err.statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
            let msg = err.msg? err.msg : "Oops! Something Went Wrong!";
            return res.status(statusCode).send({success: false, msg: msg});
        }


    }


}


module.exports = FollowerCtrl;