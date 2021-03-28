import './App.css';
import { Component } from 'react';
import { AdBrowser } from './AdBrowser';
import { DbBoard } from './DbBoard';

import {
  BrowserRouter as Router, 
  Switch,
  Route,
} from 'react-router-dom';
import { getDealersList, SellersBoard } from './Sellers';
import { AdTable } from './AdsTable';
import { Advert } from './Advert';
import { MHNavBar } from './NavBar';
import { VehicleAdvert } from './interfaces.d';
import { getAdsList } from './getAdverts';


function App() {
  return (
    <AppContent
    >
    </AppContent>
  );
}

export default App;

interface AppState {
  dealerTableRows: {
    dealerID: string,
    dealership: string,
    address: string,
    email: string,
  }[];
  adData: VehicleAdvert[];
  // filteredAdData: VehicleAdvert[]; // canot work as shared data between pages because filters get forgotten when the table page reloads
}
interface AppProps {
}

export class AppContent extends Component<AppProps, AppState> { 
  public constructor(props: AppProps) {
    super(props);
    this.state = {
      dealerTableRows: [],
      adData: [],
      // filteredAdData: [],
    }
    this.refreshDealersData();
    this.refreshAdData();
  }
  
  private async refreshDealersData(){//
    // console.log(`called refreshDealersData for ${this}`);
    await getDealersList(
      (rows: any[]) => {
        return this.setState({
          dealerTableRows: rows,
        });
      }
    );
    return;
  }

  private async refreshAdData(){//
    console.log(`called refreshAdData`);
    await getAdsList(
      (rows: any[]) => {
        this.setState({
          adData: rows,
        });
        console.log(`called setState with ${rows.length} data`);
      }
    );
    return;
  }

  public render() {
    return (
  <Router>  
  <Switch>
    <Route exact path="/" component={(props:any)=>{
      return <Home
      />
    }}/>
    <Route path="/about" component={(props:any)=>{
      return <About
      />
    }}/>
    <Route path="/adverts" component={(props:any)=>{
      return <AdBrowser
      />
    }}/>
    <Route path="/advert/:id" component={(props:any)=>{
      return <Advert 
        adID={props.match.params.id}
        adData={this.state.adData}
        refreshAdData={this.refreshAdData}
        refreshDealersData={this.refreshDealersData}
      />
    }}/>
    <Route path="/advertsTable" component={(props:any)=>{
      return <AdTable
        dealerTableRows={this.state.dealerTableRows}
        adData={this.state.adData}
        // filteredAdData={this.state.filteredAdData}
        refreshDealersData={()=>{this.refreshDealersData()}}
        refreshAdData={()=>{this.refreshAdData()}}
      />
    }}/>
    <Route path="/sellers" component={(props:any)=>{
      return <SellersBoard
        dealerTableRows={this.state.dealerTableRows}
        refreshDealersData={()=>{this.refreshDealersData()}}
      />
    }}/>
    <Route path="/db" component={(props:any)=>{
      return <DbBoard
      />
    }}/>
  </Switch>
  </Router>
    );
  }
}

class Home extends Component<{
}, {}>{
  render(){
  return (
    <div>
    <MHNavBar
    />
      <h2>Home</h2>
      Welcome to the world's best site for buying and selling motorhomes!  Click on the links above to access more interesting pages.
    </div>
  );
  }
}

class About extends Component<{
}, {}>{
  render(){
  return (
    <div>
    <MHNavBar
    />
      <h2>About</h2>
      This is a toy app, with data hosted on the cloud.  It is liable to disruptions of service at any time and loss of data.  Upload data at your peril!
    </div>
  );
  }
}
