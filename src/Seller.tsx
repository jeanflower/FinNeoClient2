import { url } from "./url";

export function createDealership(
  dealerID: string, 
  dealershipName: string,
  dealerAddress: string,
  dealershipEmail: string,
  refreshDealerData: ()=>void
) {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  console.log(`go to add a dealership with 
    '${dealerID}', 
    '${dealershipName}', 
    '${dealerAddress}', 
    '${dealershipEmail}'`);

  const urlencoded = new URLSearchParams();
  urlencoded.append('dealerID', dealerID);
  urlencoded.append('dealershipName', dealershipName);
  urlencoded.append('dealerData', JSON.stringify({
    address: dealerAddress,
    email: dealershipEmail,
  }));

  const requestOptions: {
    method: string;
    headers: Headers;
    body: URLSearchParams;
    redirect: 'follow' | 'error' | 'manual' | undefined;
  } = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow',
  };
  // console.log(`go to fetch for create for ${modelName}`);

  return fetch(`${url}create`, requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log(`create result = ${result}`);
    })
    .then(()=>{refreshDealerData()})
    .catch(error => console.log('error', error));
  //throw new Error("Method not implemented.");
}