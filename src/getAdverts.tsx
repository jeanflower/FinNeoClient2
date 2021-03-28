import { VehicleAdvert } from "./interfaces.d";
import { url } from "./url";

export const maxNumAllAds = 1000;

export function parsedFromDBItem(item: {
  adID: string,
  dealerID: string,
  adData: string,
}):VehicleAdvert{
  try{
    const adDataObj = JSON.parse(item.adData);
    if(adDataObj.description){
      try{
        // console.log(`adDataObj = ${JSON.stringify(adDataObj)}`);
        const parsedDescription = JSON.parse(adDataObj.description);
        return {
          adID: item.adID,
          dealerID: item.dealerID,
          imageID: adDataObj.imageID,
          title: parsedDescription.title,
          subtitle: parsedDescription.subtitle,
          description: adDataObj.description,
          miles: parsedDescription.miles,
          price: parsedDescription.price,
          berth: parsedDescription.berth,
          transmission: parsedDescription.transmission,
          year: parsedDescription.year,
          engine: parsedDescription.engine,
          owners: parsedDescription.owners,
          beltedSeats: parsedDescription.beltedSeats,
          image: parsedDescription.image,
          spec: parsedDescription.spec,
          weblink: parsedDescription.weblink,
          dateScraped: parsedDescription.dateScraped,
          dateUploaded: parsedDescription.dateUploaded,

        };
      } catch (err: any){
        return {
          adID: item.adID,
          dealerID: item.dealerID,
          imageID: adDataObj.imageID,
          title: '',
          subtitle: '',
          description: adDataObj.description,
          miles: '',
          price: '',
          berth: '',
          transmission: '',
          year: '',
          engine: '',
          owners: '',
          beltedSeats: '',
          image: '',
          spec: [],
          weblink: '',
          dateScraped: '',
          dateUploaded: '',
        };
      }
    }
  } catch(err: any){
    console.log(`ERROR parsing adData`);
  }
  return {
    adID: item.adID,
    dealerID: item.dealerID,
    imageID: '',
    title: '',
    subtitle: '',
    description: 'Error getting description data',
    miles: '',
    price: '',
    berth: '',
    transmission: '',
    year: '',
    engine: '',
    owners: '',
    beltedSeats: '',
    image: '',
    spec: [],
    weblink: '',
    dateScraped: '',
    dateUploaded: '',
  };  
}

export function sortFunction(a: VehicleAdvert, b: VehicleAdvert){
  const parsedA = parseInt(a.price);
  const parsedB = parseInt(b.price);
  if(parsedA === parsedB){
    if(a.weblink === b.weblink){
      return a.title.localeCompare(b.title);
    }
    return a.weblink.localeCompare(b.weblink);
  }
  return parseInt(a.price) - parseInt(b.price);
}
/*
function hasMoreInfo(a: VehicleAdvert, b: VehicleAdvert){

  return a.title === b.title
  && a.subtitle === b.subtitle
  && a.beltedSeats === b.beltedSeats
  && a.berth === b.berth
  && a.dealerID === b.dealerID
  // && a.description === b.description
  && a.engine === b.engine
  && a.miles === b.miles
  && a.owners === b.owners
  && a.price === b.price
  && a.transmission === b.transmission
  && a.year === b.year;
  
  
  return a.title.startsWith(b.title)
   && a.subtitle.startsWith(b.subtitle)
   && a.beltedSeats.startsWith(b.beltedSeats)
   && a.berth.startsWith(b.berth)
   && a.dealerID.startsWith(b.dealerID)
   // && a.description.startsWith(b.description)
   && a.engine.startsWith(b.engine)
   && a.miles === b.miles
   && a.owners === b.owners
   && a.price === b.price
   && a.transmission === b.transmission
   && a.year === b.year;
   
}
*/
export async function getAdsList(
  callback: (adData: VehicleAdvert[]) => void,
): Promise<void> {
  // console.log(`url for REST requests = ${url}`);
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  return new Promise((resolve, reject) => {
    const requestOptions: {
      method: string;
      headers: Headers;
      redirect: 'follow' | 'error' | 'manual' | undefined;
    } = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    const address = `${url}allAds`;
    // console.log(`address for fetch is ${address}`);
    return fetch(address, requestOptions)
      .then(response => response.text())
      .then(result => {
        // console.log("got list of ads - check against filter words");

        const dbItems:{
          adID: string,
          dealerID: string,
          adData: string,
        }[] = JSON.parse(result);
        
        //console.log(`dbItems[0] = ${JSON.stringify(dbItems[0])}`);
        //console.log(`dbItems[8] = ${JSON.stringify(dbItems[8])}`);

        const parsedFromDBItems:VehicleAdvert[] = dbItems.map((dbItem)=> {
          return parsedFromDBItem(dbItem);
        }).sort((a:VehicleAdvert,b:VehicleAdvert)=>{
          return sortFunction(a, b);
        }).reverse(          
        ).slice(0, maxNumAllAds);

        // parsedFromDBItems.forEach((x)=>{console.log(`x.price = ${x.price}`)});
        
        let allRows: VehicleAdvert[] = parsedFromDBItems;
/*
        const duplicateAdIDs = new Set<string>();
        for(let i = 0; i < allRows.length - 1; i = i + 1){
          const a = allRows[i];
          const b = allRows[i+1];
          if(a.weblink !== b.weblink){
            continue;
          }
          if(a.weblink === ''){
            continue;
          }
          console.log(`duplicate ads ${a.adID}, ${b.adID} at ${a.weblink}`);
          if(hasMoreInfo(a, b)){
            duplicateAdIDs.add(b.adID);
            duplicateAdIDs.add(a.adID);
            console.log(`remove ${JSON.stringify(b)}, leaving ${JSON.stringify(a)}`);
          } else if(hasMoreInfo(b, a)){
            duplicateAdIDs.add(a.adID);
            duplicateAdIDs.add(b.adID);
            console.log(`remove ${JSON.stringify(a)} leaving ${JSON.stringify(b)}`);
          }
        }

        allRows = allRows.filter((row)=>{
          return duplicateAdIDs.has(row.adID);
        })
*/
        callback(allRows);
                
        try {
          resolve();
        } catch (err) {
          reject('Query failed');
        }
        
      })
      .catch(error => {
        console.log('error', error);
        reject(error);
      });
  });
}
