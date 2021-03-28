import { Component } from 'react';
import { MHNavBar } from './NavBar';
import { makeTableFromAds } from './AdsTable';
import { VehicleAdvert } from './interfaces.d';

interface AdvertState {
}
interface AdvertProps {
  adID: string,
  adData: VehicleAdvert[],
  refreshAdData: ()=>void,
  refreshDealersData: ()=>void,
}

export class Advert extends Component<AdvertProps, AdvertState>{
  public constructor(props: AdvertProps) {
    super(props);
    this.state = {
    }
  }

  render(){
    // console.log(`this.props.adID = ${this.props.adID}`);
    // console.log(`this.state.adTableRows.length = ${this.state.adTableRows.length}`);
    const ad = this.props.adData.filter((row)=>{
      return row.adID === this.props.adID;
    })[0];

    if(ad===undefined){
      // console.log(`this.state.adTableRows adIDs = ${this.state.adTableRows.map((row)=>{return row.adID})}`);
      return (
        <div>
        <MHNavBar
        /><div>Ad loading...</div>
        </div>);
    }

    return (
      <div>
      <MHNavBar
      />
      {makeTableFromAds(
        [ad], 
        true,
        this.props.refreshAdData,
        this.props.refreshDealersData)}
      </div>
    );
  }
}
