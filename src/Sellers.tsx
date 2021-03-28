import React, { Component } from 'react';
import { Accordion, Button, Card, Container, Table } from 'react-bootstrap';
import { MHNavBar } from './NavBar';
import { createDealership } from './Seller';
import { url } from './url';

// import { dealersData } from './SampleData';

export async function getDealersList(
  callback: (dealerData: {
    dealerID : string,
    dealership: string,
    address: string,
    email: string,
  }[]) => void,
): Promise<string[]> {
  console.log(`in getDealersList, url for REST requests = ${url}`);
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
    const address = `${url}allDealers`;
    // console.log(`address for fetch is ${address}`);
    return fetch(address, requestOptions)
      .then(response => response.text())
      .then(result => {
        // console.log("got list of dealers");
        const rows = JSON.parse(result).map((x:any)=>{
          const dealershipData = JSON.parse(x.dealerData);
          return {
            dealerID : x.dealerID,
            dealership: x.dealershipName,
            address: dealershipData.address,
            email: dealershipData.email,
          };
        });
        callback(rows);
        try {
          const parsedResult = JSON.parse(result);
          // console.log(`model names are ${parsedResult}`);
          resolve(parsedResult);
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

interface SellersBoardState {
}
interface SellersBoardProps {
  dealerTableRows: {
    dealerID: string,
    dealership: string,
    address: string,
    email: string,
  }[];
  refreshDealersData: ()=>void,
}

export class SellersBoard extends Component<SellersBoardProps, SellersBoardState>{
  public constructor(props: SellersBoardProps) {
    super(props);
    this.state = {
    }
    // this.props.refreshDealersData();
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

  deleteDealership(
    dealerID: string, 
    dealershipName: string,
  
  ){
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    console.log('go to delete a dealership');
  
    const urlencoded = new URLSearchParams();
    urlencoded.append('dealerID', dealerID);
    urlencoded.append('dealershipName', dealershipName);
  
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
  
    return fetch(`${url}delete`, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .then(() => this.props.refreshDealersData())
      .catch(error => console.log('error', error));
  }  

  render(){
    return (
      <div>
      <MHNavBar
      />
      <Accordion>
      <Card>
        <Card.Header>
          <Accordion.Toggle  as={Card.Header} eventKey="ShowSellers">
            Show all sellers data
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="ShowSellers">
          <Container>
            <Table responsive striped bordered hover>
              <thead>
                <tr key="rowhead">
                  {[(
                    <th key={"0head"}>#</th>
                  ),(
                    <th key={"1head"}>Account ID</th>
                  ),(
                    <th key={"2head"}>Seller name</th>
                  ),(
                    <th key={"3head"}>Seller email</th>
                  ),(
                    <th key={"4head"}>Seller address</th>
                  ),(
                    <th key={"5head"}></th>
                  )]}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: this.props.dealerTableRows.length }).map((_, index) => (
                <tr key={`${this.props.dealerTableRows[index].dealerID}${this.props.dealerTableRows[index].dealership}`}>
                  <td>{index}</td>
                  <td>{this.props.dealerTableRows[index].dealerID}</td>
                  <td>{this.props.dealerTableRows[index].dealership}</td>
                  <td>{this.props.dealerTableRows[index].email}</td>
                  <td>{this.props.dealerTableRows[index].address}</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      onClick={
                        (e)=>{
                          e.preventDefault();
                          this.deleteDealership(
                            this.props.dealerTableRows[index].dealerID,
                            this.props.dealerTableRows[index].dealership,
                          )
                        }
                      }>Delete</Button>
                  </td>
                </tr>
                ))}
              </tbody>
            </Table>
          </Container>
        </Accordion.Collapse>
      </Card>
      <Card>
        <Card.Header>
          <Accordion.Toggle  as={Card.Header} eventKey="AddSeller">
            Add new seller
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="AddSeller">
          <Container>
            <form onSubmit={(e)=>{
              e.preventDefault();
              let id = "create-dealerID";
              const dealerID = document.getElementById(id);
              if(dealerID === null){
                console.log(`didn't find element with ID = ${id}`);
                return;
              }
              id = "create-newDealerID";
              const dealerIDNew = document.getElementById(id);
              if(dealerIDNew === null){
                console.log(`didn't find element with ID = ${id}`);
                return;
              }
              id = "create-dealershipName";
              const dealershipName = document.getElementById(id);
              if(dealershipName === null){
                console.log(`didn't find element with ID = ${id}`);
                return;
              }
              id = "create-dealerAddress";
              const dealerAddress = document.getElementById(id);
              if(dealerAddress === null){
                console.log(`didn't find element with ID = ${id}`);
                return;
              }
              id = "create-dealershipEmail";
              const dealershipEmail = document.getElementById(id);
              if(dealershipEmail === null){
                console.log(`didn't find element with ID = ${id}`);
                return;
              }
              let dealerIDval = (dealerID as HTMLInputElement).value;
              if( dealerIDval === this.selectDefaultText){
                dealerIDval = (dealerIDNew as HTMLInputElement).value;
              }
              createDealership(
                dealerIDval, 
                (dealershipName as HTMLInputElement).value,
                (dealerAddress as HTMLInputElement).value,
                (dealershipEmail as HTMLInputElement).value,
                this.props.refreshDealersData,
              );
            }
            }>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span 
                    className="input-group-text" 
                    id="inputGroup-sizing-default"
                  >AccountID (existing)</span>
                </div>
                {this.getOptionDealerIDs("create-dealerID")}
                <div className="input-group-prepend">
                  <span 
                    className="input-group-text" 
                    id="inputGroup-sizing-default"
                  >AccountID (new)</span>
                </div>
                <input 
                  type="text" 
                  className="form-control" 
                  aria-label="Dealership" 
                  aria-describedby="inputGroup-sizing-default" 
                  id="create-newDealerID">
                </input>
              </div>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span 
                    className="input-group-text" 
                    id="inputGroup-sizing-default"
                  >Seller name</span>
                </div>
                <input 
                  type="text" 
                  className="form-control" 
                  aria-label="Dealership" 
                  aria-describedby="inputGroup-sizing-default" 
                  id="create-dealershipName">
                </input>
              </div>
              <div className="input-group mb-3">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Email address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="create-dealershipEmail" 
                    aria-describedby="emailHelp" 
                    placeholder="Enter email"
                  >
                  </input>
                  <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
              </div>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span 
                    className="input-group-text" 
                    id="inputGroup-sizing-default"
                  >Seller address</span>
                </div>
                <input
                  type="text" 
                  className="form-control" 
                  aria-label="Dealership" 
                  aria-describedby="inputGroup-sizing-default" 
                  id="create-dealerAddress">
                </input>
              </div>
              <button type="submit" className="btn btn-primary">Create new seller</button>
            </form>
          </Container>
        </Accordion.Collapse>
      </Card>
    </Accordion>
    </div>
    );
  }
}
