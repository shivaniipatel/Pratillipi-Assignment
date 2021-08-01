
const UserServices = require('../../modules/users/user');
const FollowerServices = require('../../modules/followers/follower');
const ArticleServices = require('../../modules/articles/article');
const CommonUtils = require('../../common/commonUtils');
const Constants = require('../../common/constants');


class UserCtrl {

    static async addAuthor(req, res, next) {
        try {

            //name, email, phone(o)
            
            let isExistingUser = await UserServices.checkIfAuthorExists({emailid: req.body.emailid});

            if (isExistingUser) {
                throw {statusCode: HttpStatus.BAD_REQUEST, msg: "The Author Already Exists In Our System"}
            }
                        
            let authorId = await UserServices.addAuthor({emailid: req.body.emailid, name: req.body.name, phone: req.body.phone});

            return res.status(HttpStatus.OK).send({success: true, msg: "Successfully Added Author", authorId });

        } catch (err) {
            console.error(err);
            let statusCode = err.statusCode? err.statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
            let msg = err.msg? err.msg : "Oops! Something Went Wrong!";
            return res.status(statusCode).send({success: false, msg: msg});
        }


    }

    static async getAuthorById(req, res, next) {
        try {
            
            let authorId = req.params.id;

            let authorDetails = await UserServices.getAuthor({ids: [authorId]});

            if (!CommonUtils.checkIfNotEmptyArray) {
                throw {statusCode: HttpStatus.BAD_REQUEST, msg: "Author Does Not Exist"};
            }

            authorDetails = authorDetails[0];

            let followersCount = await FollowerServices.getFollowersCount([authorId]);
            authorDetails.followersCount = CommonUtils.checkIfNotEmptyArray(followersCount) ? followersCount[0].followerscount : 0;

            let latestPublishedArticles = await ArticleServices.getCappedArticles([authorId], Constants.ARTICLE_COUNT_TO_SHOW);
            authorDetails.latestPublishedArticles = latestPublishedArticles? latestPublishedArticles : [];

            return res.status(HttpStatus.OK).send({success: true, authorDetails });

        } catch (err) {
            console.error(err);
            let statusCode = err.statusCode? err.statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
            let msg = err.msg? err.msg : "Oops! Something Went Wrong!";
            return res.status(statusCode).send({success: false, msg: msg});
        }


    }


}


module.exports = UserCtrl;