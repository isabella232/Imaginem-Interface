import request from 'request';

export default {
    fecthRecentBatches(callback){
        let host = process.env.REACT_APP_SERVICE_HOST;
        let GET = {
            url: `${host}/api/fetchRecentBatches`,
            json: true,
            withCredentials: false
        };

        request(GET, callback);
    },
    fetchBatchImages(offset, limit, selectedTags, callback){
        let host = process.env.REACT_APP_SERVICE_HOST;
        let requestBody = {offset, limit, selectedTags};
        let POST = {
            url: `${host}/api/fetchRecentImages`,
            json: true,
            method: "POST",
            withCredentials: false,
            body: { requestBody }
        };

        request(POST, callback);
    },
    fetchFilterList(callback){
        let host = process.env.REACT_APP_SERVICE_HOST;
        let GET = {
            url: `${host}/api/fetchTagList`,
            json: true,
            withCredentials: false
        };

        request(GET, callback);
    }
};