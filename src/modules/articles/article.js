
const ArticleQueries = require('./article.query');
const CommonUtils = require('../../common/commonUtils');
const knexnest = require('knexnest');

class ArticleService {


     /**
     * @description : adds article against the author in the db
     */
    static async addArticle(articleDetails) {

        if (!articleDetails.hasOwnProperty('authorid') || !articleDetails.hasOwnProperty('title') || !articleDetails.hasOwnProperty('content')) {
            throw {statusCode: HttpStatus.BAD_REQUEST, msg: "Missing Parameters"};
        }

        let articlesToInsert = [
            {
                author_id: articleDetails.authorid, 
                title: articleDetails.title,
                description: articleDetails.description,
                content: articleDetails.content
            }
        ]

        await ArticleQueries.insertArticles(articlesToInsert);

        return; 
        
    }


     /**
     * @description : returns a list of few latest articles against each user 
     */
    static async getCappedArticles(authorIds, articlesLimit) {

        if (!CommonUtils.checkIfNotEmptyArray(authorIds) || isNaN(articlesLimit) ) {
            throw {statusCode: HttpStatus.BAD_REQUEST, msg: "Missing Parameters"};
        }

        let articles = await ArticleQueries.getCappedArticles(authorIds, articlesLimit);

        articles = articles && CommonUtils.checkIfNotEmptyArray(articles.rows)? articles.rows : [];

        return articles;

    }

}


module.exports = ArticleService;