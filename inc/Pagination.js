const getConnection = require('./db');
class Pagination {
    constructor(
        query,
        params = [],
        itemsPerPage = 10
    ){
        this.query = query;
        this.params = params;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
    }

    async getPage(page){

        this.currentPage = page - 1;

        this.params.push(
            this.currentPage * this.itemsPerPage,
            this.itemsPerPage
        );
        const conn = await getConnection();
        const [results] = await conn.query([this.query, "SELECT FOUND_ROWS() AS FOUND_ROWS"].join(";"), this.params);
        
        this.data = results[0];
        this.total = results[1][0].FOUND_ROWS;
        this.totalPages = Math.ceil(this.total / this.itemsPerPage);
        this.currentPage++;

        return this.data;
    }

    getTotal(){
        return this.total;
    }
    
    getCurrentPage(){
        return this.currentPage;
    }

    getTotalPages(){
        return this.totalPages;
    }


}

module.exports = Pagination