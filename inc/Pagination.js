const { text } = require('express');
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
        page = parseInt(page)
        this.currentPage = page - 1;

        const queryParams = [
            ...this.params,
            this.currentPage * this.itemsPerPage,
            this.itemsPerPage
        ];
        const conn = await getConnection();
        const [results] = await conn.query([this.query, "SELECT FOUND_ROWS() AS FOUND_ROWS"].join(";"), queryParams);
        
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
    getNavigation(params){
        let limitPagesNav = 5;
        const links = [];
        let nrStart = 0;
        let nrEnd = 0;

        if(this.getTotalPages() < limitPagesNav){
            limitPagesNav = this.getTotalPages(); 
        }

        //Primeiras páginas
        if((this.getCurrentPage() - parseInt(limitPagesNav/2)) < 1){
            nrStart = 1;
            nrEnd = limitPagesNav;
        //Ultimas páginas
        } else if ((this.getCurrentPage() + parseInt(limitPagesNav/2)) > this.getTotalPages()) {
            nrStart = this.getTotalPages() - limitPagesNav;
            nrEnd = this.getTotalPages();
        //Meio do caminho   
        } else {
            nrStart = this.getCurrentPage() -  parseInt(limitPagesNav/2);
            nrEnd = this.getCurrentPage() +  parseInt(limitPagesNav/2);
        }

        for(let x = nrStart; x <= nrEnd; x++){

            links.push({
                text: x,
                href: `?${this.getQueryString(Object.assign({}, params, {page: x}))}`,
                active: (x === this.getCurrentPage())
            });
        }
        return links;
    }

    getQueryString(params){
        const queryString = [];
        for(let name in params){
            queryString.push(`${name}=${params[name]}`);
        }
        return queryString.join("&");
    }
}

module.exports = Pagination