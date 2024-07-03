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

    while(hasMorePages){
        let response;
        if(currentPage > 1){
            response = await axios.get(`${url}&page=${currentPage}`);
        } else {
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

            let title = $(el).find('.nimi a').text().trim();
            if(title){
                productInfoObject['title'] = title;
            }

            let picUrl = $(el).find('img').data('src');
            if(picUrl){
                productInfoObject['picUrl'] = 'https:' + picUrl;
            }

            let productUrl = $(el).find('.kuva a').attr('href');
            if(productUrl){
                productInfoObject['productUrl'] = 'https://www.tavaratrading.com' + productUrl;
            }

            let price = $(el).find('.price_out').text().trim();
            if(price){
                productInfoObject['price'] = price + " €";
            }

            let quantity = $(el).find('.availability .available').text().trim();
            if(quantity){
                productInfoObject['quantity'] = quantity;
            }

            products.push(productInfoObject);
        });

        const hasNextPage = $('.page_navigation a i.icon-seuraava-sivu-icon').length > 0;
        hasMorePages = hasNextPage;
        currentPage++;
    }
    return products;
}
