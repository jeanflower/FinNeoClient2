import { Component } from 'react';
import { MHNavBar } from './NavBar';

// import { dealersData } from './SampleData';

interface DbBoardState {
}
interface DbBoardProps {
}

export class DbBoard extends Component<DbBoardProps, DbBoardState>{
  public constructor(props: DbBoardProps) {
    super(props);
    this.state = {
    }
  }

  render(){
    
    return (
      <div>
      <MHNavBar
      />
      <h1>Database admin</h1>
      </div>
    );
  }
}
