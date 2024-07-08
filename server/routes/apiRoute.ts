import express from 'express';
import { scrapeWebsite } from '../functions/webScraping';
import furnitureModel from '../dbModels/furnitureModel';

const apiRoute : express.Router = express.Router();

const chairModule = furnitureModel('chairs');
const sofaModule = furnitureModel('sofas');
const storageModule = furnitureModel('storage');
const tableModule = furnitureModel('tables');
const conferenceModule = furnitureModel('conference');

apiRoute.get("/", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        res.status(200).json({ "message" : "apiroute initialized"});
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

apiRoute.get("/testScraping", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
                   /* 
            Here we start with categories: 
            1. Chairs = työtuolit + neuvottelu-asiakastauolit
            2. Sofas, armchairs and stools = sohvat, nojatuolit ja rahit
            3. Storage furniture = säilytyskalusteet
            4. Tables = sohva ja pikkupöydät + sähköpöydät + työpöydät + neuvottelupöydät
            5. Conference sets = neuvotteluryhmät
            */
        /* these urls are ready for scraping
        1. https://www.tavaratrading.com/kaytetyt/?category[]=2&category[]=11
        2. https://www.tavaratrading.com/kaytetyt/?category[]=29
        3. https://www.tavaratrading.com/kaytetyt/?category[]=8
        4. https://www.tavaratrading.com/kaytetyt/?category[]=5&category[]=173&category[]=54&category[]=190
        5. https://www.tavaratrading.com/kaytetyt/?category[]=139
        */
        let scraping = scrapeWebsite('https://www.tavaratrading.com/kaytetyt/?category[]=2&category[]=11')
        .then(products => console.log(products));
        res.status(200).json({ "message" : "apiroute initialized"});
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

export default apiRoute;