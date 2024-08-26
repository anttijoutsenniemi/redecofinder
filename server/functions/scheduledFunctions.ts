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
        scrapeCategory(`${clientPublic.webStoreUrl}/kaytetyt/?category[]=2`, 'tyotuolit'), //työtuolit
        scrapeCategory(`${clientPublic.webStoreUrl}/kaytetyt/?category[]=196`, 'korkeat_tuolit'), //korkeat tuolit
        scrapeCategory(`${clientPublic.webStoreUrl}/kaytetyt/?category[]=11`, 'neuvottelu-_ja_asiakastuolit'), //neuvottelu- ja asiakastuolit
        scrapeCategory(`${clientPublic.webStoreUrl}/kaytetyt/?category[]=29`, 'sohvat_nojatuolit_ja_rahit'), //sohvat, nojatuolit ja rahit
        scrapeCategory(`${clientPublic.webStoreUrl}/kaytetyt/?category[]=8`, 'sailytyskalusteet'), //säilytyskalusteet
        scrapeCategory(`${clientPublic.webStoreUrl}/kaytetyt/?category[]=5`, 'tyopoydat'), //työpöydät
        scrapeCategory(`${clientPublic.webStoreUrl}/kaytetyt/?category[]=195`, 'korkeat_poydat'), //korkeat pöydät
        scrapeCategory(`${clientPublic.webStoreUrl}/kaytetyt/?category[]=173`, 'neuvottelupoydat'), //neuvottelupöydät
        scrapeCategory(`${clientPublic.webStoreUrl}/kaytetyt/?category[]=54`, 'sahkopoydat'), //sähköpöydät
        scrapeCategory(`${clientPublic.webStoreUrl}/kaytetyt/?category[]=190`, 'sohva-_ja_pikkupoydat'), //sohva- ja pikkupöydät
        scrapeCategory(`${clientPublic.webStoreUrl}/kaytetyt/?category[]=139`, 'neuvotteluryhmat') //neuvotteluryhmät
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
