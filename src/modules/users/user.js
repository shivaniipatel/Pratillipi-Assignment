
const UserQueries = require('./user.query');
const commonUtils = require('../../common/commonUtils');

class UserService {

    /**
     * @description : using some constraint check if the user against that exists  
     */
    static async checkIfAuthorExists(filters={}) {

        if ( Object.keys(filters).length==0) return false;

        let authorQuery = UserQueries.getAuthors();

        if (filters.id) authorQuery.where('id', filters.id);
        if (filters.emailid) authorQuery.where('email_id', filters.emailid);
        if (filters.name) authorQuery.where('email_id', filters.name);
        if (filters.phone) authorQuery.where('email_id', filters.phone);

        let author = await authorQuery;

        if (commonUtils.checkIfNotEmptyArray(author)) {
            return true ;
        }

        return false;

    }


    /**
     * @description : adds an article against an author in the database 
     */
    static async addAuthor(authorDetails) {

        if (!authorDetails.hasOwnProperty('emailid') || !authorDetails.hasOwnProperty('name')) {
            throw {statusCode: HttpStatus.BAD_REQUEST, msg: "Email/Name is Required"};
        }

        let authorToInsert = [
            {
                email_id: authorDetails.emailid, 
                name: authorDetails.name,
                phone: authorDetails.phone
            }
        ]

        let returnedIds = await UserQueries.insertAuthors(authorToInsert);

        return returnedIds; 
        
    }


    /**
     * @description : returns author details by id
     */
    static async getAuthor(filters={}) {

        let authorQuery = UserQueries.getAuthors();

        if (filters.ids) authorQuery.whereIn('id', filters.ids);

        let authors = await authorQuery;

        authors = commonUtils.checkIfNotEmptyArray(authors) ? authors : [];

        return authors;

    }

    /**
     * @description : check if a author exists against the requested id  
     */
    static async checkIfUserExists(filters={}) {

        let userQuery = UserQueries.getUsers();

        if (filters.id) userQuery.where('id', filters.id);

        let user = await userQuery;

        if (commonUtils.checkIfNotEmptyArray(user)) {
            return true ;
        }

        return false;

    }


    /**
     * @description : returns a list of all author ids 
     */
    static async getAllAuthorIds() {
        
        let authorIds = await UserQueries.getAllAuthorIds();

        authorIds = commonUtils.checkIfNotEmptyArray(authorIds) ? authorIds[0].ids : [];

        return authorIds
    }



}


module.exports = UserService;