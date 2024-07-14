import * as cron from 'node-cron';
import { scrapeWebsite } from './webScraping';
import { combineScrapingAndAi } from './addStyleDataToScraping';
import clientPublic from './../styleJson/clientPublic.json';

const scrapeCategory = async (url : string, category : string) => {
    try {
        const products = await scrapeWebsite(url);
        await combineScrapingAndAi(products, category);
    } catch (error) {
        console.error(`Error scraping ${category} website:`, error);
    }
};

export const scrapeAndMakeAiData = async () => {
    const scrapePromises = [
        scrapeCategory(`${clientPublic.webStoreUrl}/kaytetyt/?category[]=2&category[]=11`, 'chairs'),
        scrapeCategory(`${clientPublic.webStoreUrl}/kaytetyt/?category[]=29`, 'sofas'),
        scrapeCategory(`${clientPublic.webStoreUrl}/kaytetyt/?category[]=8`, 'storage'),
        scrapeCategory(`${clientPublic.webStoreUrl}/kaytetyt/?category[]=5&category[]=173&category[]=54&category[]=190`, 'tables'),
        scrapeCategory(`${clientPublic.webStoreUrl}/kaytetyt/?category[]=139`, 'conference')
    ];

    try {
        await Promise.all(scrapePromises);
        console.log('All categories have been scraped and processed.');
    } catch (error) {
        console.error('Error in scraping one or more categories:', error);
    }
};

export const setupCronJobs = (): void => {
    //here first number is the starting minute and the other is hours, so this runs on the first minute of every 12 hours
    cron.schedule('0 */12 * * *', scrapeAndMakeAiData, {
        scheduled: true,
        timezone: "Europe/Helsinki"
    });
};
