import axios from 'axios';
import cheerio, { load } from 'cheerio';

export interface Product {
    picUrl: string;
    price: string,
    quantity: string,
    title: string;
    productUrl: string;
    styleJson?: any,
    deleted?: boolean,
    timeStamp?: string
}

export async function scrapeWebsite(url: string): Promise<Product[]> {
    const products: Product[] = [];
    let currentPage = 1;
    let hasMorePages = true;
    let lastIndex : number = 0;
    let currentIndex : number = 0;

    while(hasMorePages){
        let response;
        if(currentPage > 1){
            response = await axios.get(`${url}?page=${currentPage}`);
        } 
        else{
            response = await axios.get(url);
        }
        const html = response.data;
        const $ = load(html);

        $('.listatuote').each((_idx, el) => {

            let productInfoObject: Product = {
                picUrl: "",
                title: "",
                price: "",
                quantity: "",
                productUrl: "",
                deleted: false
            };
            
            let title = $(el).find('.grid-product__title').text().trim();
            if(title){
                productInfoObject['title'] = title;
            }

            let picUrl = $(el).find('img').attr('src');
            if(picUrl){
                productInfoObject['picUrl'] = 'https:' + picUrl;
            }

            let productUrl = $(el).find('a').attr('href');
            if(productUrl){
                productInfoObject['productUrl'] = productUrl;
            }

            products.push(productInfoObject);
        
        });

        const hasNextPage = $('.pagination').find('.next').length > 0; //this checks if the html has button for next page. if true we scrape all the pages
        hasMorePages = hasNextPage;
        currentPage++
    }
    return products;
}