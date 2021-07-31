


class ArticleCtrl {

    static async addArticle(req, res, next) {
        try {
            


            return res.status(HttpStatus.OK).send({success: true });

        } catch (err) {
            console.error(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({success: false, msg: "Oops! Something Went Wrong!"});
        }


    }


}


module.exports = ArticleCtrl;