import { Component } from 'react';
import { Accordion, Button, Card, Container, Table } from 'react-bootstrap';
import { url } from './url';
import { createDealership } from './Seller';
import { MHNavBar } from './NavBar';
import { VehicleAdvert } from './interfaces.d';

function getKeyValueHtml(key:string, value:string){
  if(value === undefined || value === '' || value === 'undefined'){
    return;
  }
  return (
    <p><b>{key}</b> {value}</p>
  );
}

function descriptionIsJSON(description: string){
  try{
    JSON.parse(description);
    return true;
  } catch(err){
    return false;
  }
}

function getDescriptionHtml(obj:VehicleAdvert){
  if(descriptionIsJSON(obj.description)){
    return;
  }
  return obj.description;
}

function getMilesHtml(obj: VehicleAdvert){
  return getKeyValueHtml('Miles', obj.miles);
}
function getPriceHtml(obj: VehicleAdvert){
  if(obj.price === ''){
    return;
  }
  return getKeyValueHtml('Price', `£${obj.price}`);
}
function getBerthHtml(obj: VehicleAdvert){
  return getKeyValueHtml('Berth', obj.berth);
}
function getTransmissionHtml(obj: VehicleAdvert){
  return getKeyValueHtml('Transmission', obj.transmission);
}
function getYearHtml(obj: VehicleAdvert){
  return getKeyValueHtml('Year', obj.year);
}
function getEngineHtml(obj: VehicleAdvert){
  return getKeyValueHtml('Engine', obj.engine);
}
function getOwnersHtml(obj: VehicleAdvert){
  return getKeyValueHtml('Owners', obj.owners);
}
function getBeltedSeatsHtml(obj: VehicleAdvert){
  return getKeyValueHtml('Belted seats', obj.beltedSeats);
}
function getTraderHTML(obj: VehicleAdvert){
  return getKeyValueHtml('Trader', obj.dealerID);
}
function getWeblinkHTML(obj: VehicleAdvert){
  if(obj.weblink === ''){
    return;
  }
  return (<p><b>For full details: </b><a href={obj.weblink}>{obj.weblink}</a></p>);
}
function getDateScrapedHTML(
  obj: VehicleAdvert,
  customerFacingView: boolean,
){
  if(customerFacingView){
    return;
  }
  return getKeyValueHtml('Date scraped', obj.dateScraped);
}
function getDateUploadedHTML(
  obj: VehicleAdvert,
  customerFacingView: boolean,
){
  if(customerFacingView){
    return;
  }
  return getKeyValueHtml('Date uploaded', obj.dateUploaded);
}
function getAdIDHTML(
  obj: VehicleAdvert,
  customerFacingView: boolean,
){
  if(customerFacingView){
    return;
  }
  return getKeyValueHtml('Ad ID', obj.adID);
}
function getSpecHtml(obj: VehicleAdvert){
  return getKeyValueHtml('Other', `${obj.spec}`);
}

export function createHTMLViewOfDescription(
  obj: VehicleAdvert,
  customerFacingView: boolean,
){
  //console.log(`ad is ${JSON.stringify(obj)}`);
  return (
  <>
    <Table responsive bordered hover>
      <thead>
        <tr key="rowhead">
          {[(<th key={"1head"}>Vehicle</th>
          ),(<th key={"2head"}>More info</th>
          )]}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
          <p><b>{obj.title}</b> {obj.subtitle}</p>
            {getDescriptionHtml(obj)}
            {getPriceHtml(obj)}
            {getTransmissionHtml(obj)}
            {getYearHtml(obj)}
            {getEngineHtml(obj)}
          </td>
          <td>
            {getBerthHtml(obj)}
            {getBeltedSeatsHtml(obj)}
            {getOwnersHtml(obj)}
            {getMilesHtml(obj)}
            {getSpecHtml(obj)}
            {getTraderHTML(obj)}
            {getDateScrapedHTML(obj, customerFacingView)}
            {getDateUploadedHTML(obj, customerFacingView)}
            {getAdIDHTML(obj, customerFacingView)}
          </td>
        </tr>
      </tbody>
    </Table>
    {getWeblinkHTML(obj)}
  </>
  );
}

function deleteAdNoRefresh(
  adID: string,
  callback: ()=>void,
){
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
  console.log('go to delete an ad');

  const urlencoded = new URLSearchParams();
  urlencoded.append('adID', adID);

  const requestOptions: {
    method: string;
    headers: Headers;
    body: URLSearchParams;
    redirect: 'follow' | 'error' | 'manual' | undefined;
  } = {
    method: 'DELETE',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow',
  };

  // console.log('go to fetch for delete');

  return fetch(`${url}deleteAd`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .then(callback)
    .catch(error => console.log('error', error));
}

export function createAd(
  adID: string, 
  dealerID: string,
  description: string,
  imageID: string,
  refreshAdData: ()=>void,
) {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

//  console.log(`go to add an advert with 
//    '${adID}', 
//    '${dealerID}', 
//    '${description}', 
//    '${imageID}'`
//    );

  const urlencoded = new URLSearchParams();
  urlencoded.append('adID', adID);
  urlencoded.append('dealerID', dealerID);
  urlencoded.append('adData', JSON.stringify({
    description: description,
    imageID: imageID,
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

  return fetch(`${url}createAd`, requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log(`createAd result = ${result}`);
    })
    .then(function(){
      refreshAdData();
    })
    .catch(error => console.log('error', error));
  //throw new Error("Method not implemented.");
}

function deleteFromTraderButton(
  ads: VehicleAdvert[],
  index: number,
  refreshAdData: ()=>void,
){
  if(ads[index].dealerID === ''){
    return;
  }
  return (
    <Button
      variant="outline-danger"
      onClick={
        async function(){
          const thisTrader = ads[index].dealerID;
          for(let i = 0; i < ads.length; i = i + 1){
            const thisAd = ads[i];
            if(thisAd.dealerID === thisTrader){
              //if(window.confirm(`delete ${JSON.stringify(thisAd)}?`)){
                console.log(`deleting ${JSON.stringify(thisAd)}`)
                await deleteAdNoRefresh(thisAd.adID, ()=>{});
              //}
            }
          }
          refreshAdData();
        }
      }>
      Delete all from this trader
    </Button>
  );
}


function deleteFromUploadDateButton(
  ads: VehicleAdvert[],
  index: number,
  refreshAdData: ()=>void,
){
  if(ads[index].dateUploaded === ''){
    return;
  }
  return (
    <Button
      variant="outline-danger"
      onClick={
        async function(){
          const thisUploadDate = ads[index].dateUploaded;
          for(let i = 0; i < ads.length; i = i + 1){
            const thisAd = ads[i];
            if(thisAd.dateUploaded === thisUploadDate){
              //if(window.confirm(`delete ${JSON.stringify(thisAd)}?`)){
                console.log(`deleting ${JSON.stringify(thisAd)}`)
                await deleteAdNoRefresh(thisAd.adID, ()=>{});
              //}
            }
          }
          refreshAdData();
        }
      }>Delete all uploaded on this date</Button>
  );
}


function makeDeleteRow(
  ads: VehicleAdvert[],
  customerFacingView: boolean,
  index: number,
  refreshAdData: ()=>void,
  refreshDealersData: ()=>void,
){
  if(customerFacingView){
    return;
  }

  return (
    <td>
    <Button
      variant="outline-danger"
      onClick={
        function(){
          deleteAdNoRefresh(
            ads[index].adID,
            refreshAdData,
          );
        }
      }>Delete</Button>
    {deleteFromTraderButton(ads, index, refreshAdData)}
    {deleteFromUploadDateButton(ads, index, refreshAdData)}
  </td>
  );
}

function makeIDRow(
  ads: VehicleAdvert[],
  customerFacingView: boolean,
  index: number,
){
  if(customerFacingView){
    return;
  }
  return (<td>{index}<br></br>{ads[index].adID}</td>);
}

export function makeTableFromAds(
  ads: VehicleAdvert[],
  customerFacingView: boolean,
  refreshAdData: ()=>void, 
  refreshDealersData: ()=>void,
){
  let cols: {
    key: string,
    text: String,
  }[] = [];
  if(customerFacingView){
    cols = [{
      key: "1head",
      text: "Image",
    },{
      key: "2head",
      text: "Description",
    }];
  } else {
    cols = [{
      key: "1head",
      text: "Image",
    },{
      key: "2head",
      text: "Description",
    },{
      key: "3head",
      text: "Delete",
    },{
      key: "4head",
      text: "Ad ID",
    }];
  }
  return (
    <Table responsive striped bordered hover>
    <thead>
      <tr key="rowhead">
        {cols.map((col)=>{
          return (<th key = {col.key}>{col.text}</th>);
        })}
      </tr>
    </thead>
    <tbody>
      {Array.from({ length: ads.length })
        .map((_, index) => {
          return (
            <tr key={`${index}_adID${ads[index].adID}`}>
              <td>
                <img 
                  alt={'a vehicle'}
                  src={`${url}image?${new URLSearchParams({
                    id: ads[index].imageID,
                  })}`}
                  height={200}
                ></img>
              </td>
              <td>{createHTMLViewOfDescription(ads[index], customerFacingView)}</td>
              {makeDeleteRow(ads, customerFacingView, index, refreshAdData, refreshDealersData)}
              {makeIDRow(ads, customerFacingView, index)}
            </tr>
          );
        }
      )}
    </tbody>
  </Table>    
  );
}

interface AdTableState {
  adCountMessage: string,
}
interface AdTableProps {
  dealerTableRows: {
    dealerID: string,
    dealership: string,
    address: string,
    email: string,
  }[];
  adData: VehicleAdvert[],
  // filteredAdData: VehicleAdvert[]; // cannot work while routers reload pages
  refreshDealersData: ()=>void,
  refreshAdData: ()=>void,
}

export class AdTable extends Component<AdTableProps, AdTableState>{
  public constructor(props: AdTableProps) {
    super(props);
    this.state = {
      adCountMessage: "Loading ads...",
    }
  }

  selectDefaultText = "Select AccountID";

  private getDealerIDList(){
    const allIDs:string[] = this.props.dealerTableRows.map((row)=>row.dealerID);
    const unique = allIDs.filter((v, i, a) => a.indexOf(v) === i);
    // console.log(`dealerIDList ${JSON.stringify(unique)}`);
    return unique;
  }

  private getOptionDealerIDs(id: string){
    return (
      <select 
        id={id} 
        className="form-select" 
        aria-label="Default select example"
        defaultValue={this.selectDefaultText}
      >
      <option>{this.selectDefaultText}</option>
      {(this.getDealerIDList()
      .map((id)=>{ return (
        <option 
          value={id}
          key={id}
        >
          {id}
        </option>) })
      )}
      </select>);
  }
  adIDExists(id: string){
    return this.props.adData.find((row)=>{
      return row.adID === id;
    }) !== undefined;
  }

  render(){
    const refreshAdData = this.props.refreshAdData;
    const today = new Date().toDateString();
    return (
      <div>
      <MHNavBar
      ></MHNavBar>
      <Accordion>
      <Card>
        <Card.Header>
          <Accordion.Toggle  as={Card.Header} eventKey="ShowTodaysAds">
            Show today's advertisements
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="ShowTodaysAds">
          <Container>
            {makeTableFromAds(
              this.props.adData.filter((ad)=>{
                return ad.dateScraped === today;
              }), 
              false,
              this.props.refreshAdData,
              this.props.refreshDealersData,
              )}
          </Container>
        </Accordion.Collapse>
      </Card>
      <Card>
        <Card.Header>
          <Accordion.Toggle  as={Card.Header} eventKey="ShowAds">
            Show all advertisements
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="ShowAds">
          <Container>
            {makeTableFromAds(
              this.props.adData, 
              false,
              this.props.refreshAdData,
              this.props.refreshDealersData,
              )}
          </Container>
        </Accordion.Collapse>
      </Card>
      {/*
      <Card>
        <Card.Header>
          <Accordion.Toggle  as={Card.Header} eventKey="ShowFilteredAds">
            Show filtered advertisements
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="ShowFilteredAds">
          <Container>
            {makeTableFromAds(
              this.props.filteredAdData, 
              false,
              this.props.refreshAdData,
              this.props.refreshDealersData,
              )}
          </Container>
        </Accordion.Collapse>
      </Card>
      */}
      <Card>
        <Card.Header>
          <Accordion.Toggle  as={Card.Header} eventKey="AddAd">
            Add new ad
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="AddAd">
          <Container>
            {/*create advert*/}
            <form id="addAdForm" onSubmit={(e)=>{
              e.preventDefault();
              let id = "create-adID";
              const adID = document.getElementById(id);
              if(adID === null){
                console.log(`didn't find element with ID = ${id}`);
                return;
              }
              let adIDVal = (adID as HTMLInputElement).value;
              if( adIDVal === ''){
                console.log(`no adID provided`);
                alert('Please provide an adID');
                return;
              }
              if(this.adIDExists( adIDVal )){
                console.log(`no adID provided`);
                alert(`The adID ${adIDVal} already exists, please provide a unique one`);
                return;
              }
              id = "createAd-dealerID";
              const dealerID = document.getElementById(id);
              if(dealerID === null){
                console.log(`didn't find element with ID = ${id}`);
                return;
              }
              id = "create-description";
              const description = document.getElementById(id);
              if(description === null){
                console.log(`didn't find element with ID = ${id}`);
                return;
              }
              let dealerIDval = (dealerID as HTMLInputElement).value;
              if( dealerIDval === this.selectDefaultText){
                console.log(`no dealerID selected`);
                alert('Please select a dealerID from the list');
                return;
              }
  
              id = "input-adImage";
              const fileInput = document.getElementById(id);
              if(fileInput === null){
                console.log(`didn't find element with ID = ${id}`);
                return;
              }
              const fileArray = (fileInput as HTMLInputElement).files;
              if(fileArray === null){
                console.log(`no files found for input ${id}`);
                return;
              }
              const selectedFile = fileArray[0];
              console.log(`selectedFile = ${selectedFile}`);
              if(selectedFile === undefined){
                createAd(
                  (adID as HTMLInputElement).value,
                  dealerIDval, 
                  (description as HTMLInputElement).value,
                  '',
                  this.props.refreshAdData,
                );
                return
              }
  
              let reader = new FileReader();
              reader.onload = () => {
                console.log(`read and display file`);
                var response = reader.result;
                const id = 'preview-images';
                const div = document.getElementById(id);
                if(div === null){
                  console.log(`no div for id ${id}`);
                  return;
                }
                // console.log(`response for image is ${response}`);
                div.innerHTML = `<img alt="advert image" src=${response} width=200></img>`              
              };
              reader.readAsDataURL(selectedFile);
  
              console.log(`uploading file`);
              var myHeaders = new Headers();
              //myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            
              var formdata = new FormData();
              formdata.append("file", selectedFile, selectedFile.name);
            
              const requestOptions: {
                method: string;
                headers: Headers;
                body: any;
                redirect: 'follow' | 'error' | 'manual' | undefined;
              } = {
                method: 'POST',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow'
              };
            
              fetch(`${url}upload`, requestOptions)
                .then(response => response.text())
                .then(result => {
                  console.log(`result from upload is ${result}`);
                  const id = JSON.parse(result).id;
                  const filename = JSON.parse(result).filename;
                  createDealership(
                    filename, 
                    id, 
                    '', 
                    '',
                    this.props.refreshDealersData);
                  return id;
                })
                .then(id => {
                  createAd(
                    (adID as HTMLInputElement).value,
                    dealerIDval, 
                    (description as HTMLInputElement).value,
                    id,
                    this.props.refreshAdData,
                  );                  
                })
                /*
                .then(() => {
                  const form = document.getElementById("addAdForm");
                  console.log(`reset form`);
                  (form as HTMLFormElement).reset();
                })
                */
                .then(() => refreshAdData())
                .catch(error => console.log('error', error));
            }
            }>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span 
                    className="input-group-text" 
                    id="inputGroup-sizing-default"
                  >Ad ID</span>
                </div>
                <input 
                  type="text" 
                  className="form-control" 
                  aria-label="Dealership" 
                  aria-describedby="inputGroup-sizing-default" 
                  id="create-adID">
                </input>
              </div>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span 
                    className="input-group-text" 
                    id="inputGroup-sizing-default"
                  >AccountID (existing)</span>
                </div>
                {this.getOptionDealerIDs("createAd-dealerID")}
              </div>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span 
                    className="input-group-text" 
                    id="inputGroup-sizing-default"
                  >description</span>
                </div>
                <textarea 
                  className="form-control" 
                  aria-label="Dealership" 
                  aria-describedby="inputGroup-sizing-default" 
                  id="create-description">
                </textarea>
              </div>
              <div className="form-group">
                <input
                  type="file"
                  name="file"
                  id="input-adImage"
                  className="form-control-file border"
                />
              </div>
              <button type="submit" className="btn btn-primary">Create new advertisement</button>
            </form>
          </Container>
        </Accordion.Collapse>
      </Card>
    </Accordion>

    </div>
    );
  }
}
