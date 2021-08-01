

class CommonUtils {


    static checkIfNotEmptyArray(input) {

        if (input && Array.isArray(input) && input.length>0) {
            return true;
        }
    
        return false;
    
    } 



}


module.exports = CommonUtils;