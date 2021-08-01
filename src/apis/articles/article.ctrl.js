

const UserServices = require('../../modules/users/user');
const ArticleServices = require('../../modules/articles/article');
const SubscriptionServices = require('../../modules/subscriptions/subscription');


class ArticleCtrl {

    /**
     * @description : adds an article against an author 
     */
    static async addArticle(req, res, next) {
        try {
            
            if ( !req.body.hasOwnProperty('authorid') || !req.body.hasOwnProperty('title') || !req.body.hasOwnProperty('content')) {
                throw {statusCode: HttpStatus.BAD_REQUEST, msg: "Missing Parameters"};
            }

            let authorExists = await UserServices.checkIfAuthorExists({id: req.body.authorid});
            
            if (!authorExists) {
                throw {statusCode: HttpStatus.BAD_REQUEST, msg: "Author Does Not Exists"};
            }

            let threshold = await SubscriptionServices.getSubscriptionConstraints();

            let thresholdMap = SubscriptionServices.createThresholdMap(threshold);            

            await ArticleServices.addArticle({authorid: req.body.authorid, title: req.body.title, description: req.body.description, content: req.body.content});

            await SubscriptionServices.updateAuthorSubscription([req.body.authorid], thresholdMap);

            return res.status(HttpStatus.OK).send({success: true, msg: "Successfully Added Article" });

        } catch (err) {
            console.error(err);
            let statusCode = err.statusCode? err.statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
            let msg = err.msg? err.msg : "Oops! Something Went Wrong!";
            return res.status(statusCode).send({success: false, msg: msg});
        }


    }


}


module.exports = ArticleCtrl;