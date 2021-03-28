import { Nav, Navbar } from 'react-bootstrap';
import React, { Component } from 'react';
import VanImage from './van_icon_125866.png';

interface MHNavBarState {
}
interface MHNavBarProps {
}
export class MHNavBar extends Component<MHNavBarProps, MHNavBarState> { 
  public constructor(props: MHNavBarProps) {
    super(props);
    this.state = {
    }
  }
  private allAdvertsLink(){
    return (<Nav.Link href="/advertsTable">All adverts</Nav.Link>);
  }
  public render(){
    return (
    <Navbar bg="primary" variant="dark" expand="lg">
    <img
      src={VanImage}
      alt="Van"
      width={70}
      height={'auto'}
    ></img>
    <Navbar.Brand href="#home">Motor home sales admin page</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link href="/">Home</Nav.Link>
        <Nav.Link href="/about">About</Nav.Link>
        {this.allAdvertsLink()}
        <Nav.Link href="/adverts">Browse adverts</Nav.Link>
        <Nav.Link href="/sellers">Sellers</Nav.Link>
        <Nav.Link href="/db">Database admin</Nav.Link>
      </Nav>
      {/*
      <Form inline>
        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
        <Button variant="outline-success">Search</Button>
      </Form>
      */}
    </Navbar.Collapse>
  </Navbar>      
    );
  }
}