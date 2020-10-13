const { default: Login } = require("./views/authViews/Login")
const { default: Profile } = require("./views/authViews/Profile")
const { default: Register } = require("./views/authViews/Register")

Sidebar

{/* Heading */ }
<h6 className="navbar-heading text-muted">Documentation</h6>
{/* Navigation */ }
 <Nav className="mb-md-3" navbar>
   <NavItem>
     <NavLink href="https://demos.creative-tim.com/argon-dashboard-react/#/documentation/overview?ref=adr-admin-sidebar">
       <i className="ni ni-spaceship" />
       Getting started
     </NavLink>
   </NavItem>
   <NavItem>
     <NavLink href="https://demos.creative-tim.com/argon-dashboard-react/#/documentation/colors?ref=adr-admin-sidebar">
       <i className="ni ni-palette" />
       Foundation
     </NavLink>
   </NavItem>
   <NavItem>
     <NavLink href="https://demos.creative-tim.com/argon-dashboard-react/#/documentation/alerts?ref=adr-admin-sidebar">
       <i className="ni ni-ui-04" />
       Components
     </NavLink>
   </NavItem>
 </Nav>
 <Nav className="mb-md-3" navbar>
   <NavItem className="active-pro active">
     <NavLink href="https://www.creative-tim.com/product/argon-dashboard-pro-react?ref=adr-admin-sidebar">
       <i className="ni ni-spaceship" />
       Upgrade to PRO
     </NavLink>
   </NavItem>
 </Nav>


WorkSpace

{/* <Col className="d-flex justify-content-around align-items-center" xs="12" md="6" lg="6" xl="6">
                                    <FormControl className="min-wd-120 width-f ">
                                        <InputLabel style={{zIndex:1}} className="text-white" id="demo-simple-select-helper-label">WorkSpace</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-helper-label"
                                            id="demo-simple-select-helper"
                                            value={SelectWorkSpace}
                                            className="text-default font-weight-bold br-sm "
                                            onChange={(event) => this.onWorkSpaceChanged(event.target.value)}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={"Main Project"}>Main Project</MenuItem>
                                            <MenuItem value={"Main Project 1"}>Main Project 1</MenuItem>
                                            <MenuItem value={"Main Project 2"}>Main Project 2</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Col> */}

Login
  < CardFooter className = "bg-transparent pb-5" >
              <div className="text-muted text-center mt-2 mb-3">
                <small>Sign in with</small>
              </div>
              <div className="btn-wrapper text-center">
                <Button
                  className="btn-neutral btn-icon mt-2 mb-2"
                  color="default"
                  
                  onClick={e => e.preventDefault()}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="..."
                      src={require("../../assets/img/icons/common/facebook.svg")}
                    />
                  </span>
                  <span className="btn-inner--text">Facebook</span>
                </Button>

                <Button
                  className="btn-neutral btn-icon  mt-2 mb-2"
                  color="default"
                  
                  onClick={e => e.preventDefault()}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="..."
                      src={require("../../assets/img/icons/common/google.svg")}
                    />
                  </span>
                  <span className="btn-inner--text">Google</span>
                </Button>
              </div>
            </CardFooter >

  Register

  < CardFooter className = "bg-transparent pb-5" >
            <div className="text-muted text-center mt-2 mb-3">
              <small>Sign in with</small>
            </div>
            <div className="btn-wrapper text-center">
              <Button
                className="btn-neutral btn-icon mt-2 mb-2"
                color="default"
                
                onClick={e => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={require("../../assets/img/icons/common/facebook.svg")}
                  />
                </span>
                <span className="btn-inner--text">Facebook</span>
              </Button>

              <Button
                className="btn-neutral btn-icon  mt-2 mb-2"
                color="default"
                
                onClick={e => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={require("../../assets/img/icons/common/google.svg")}
                  />
                </span>
                <span className="btn-inner--text">Google</span>
              </Button>
            </div>
          </CardFooter >


  Profile

  < Col className = "order-xl-2 mb-5 mb-xl-0" xl = "4" >
    <Card className="card-profile shadow">
      <Row className="justify-content-center">
        <Col className="order-lg-2" lg="3">
          <div className="card-profile-image">
            <a onClick={e => e.preventDefault()}>
              <img
                alt="..."
                className="rounded-circle"
                src={require("../../assets/img/theme/team-4-800x800.jpg")}
              />
            </a>
          </div>
        </Col>
      </Row>
      <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
        <div className="d-flex justify-content-between">
          <Button
            className="mr-4"
            color="info"

            onClick={e => e.preventDefault()}
            size="sm"
          >
            Connect
      </Button>
          <Button
            className="float-right"
            color="default"

            onClick={e => e.preventDefault()}
            size="sm"
          >
            Message
      </Button>
        </div>
      </CardHeader>
      <CardBody className="pt-0 pt-md-4">
        <Row>
          <div className="col">
            <div className="card-profile-stats d-flex justify-content-center mt-md-5">
              <div>
                <span className="heading">22</span>
                <span className="description">Friends</span>
              </div>
              <div>
                <span className="heading">10</span>
                <span className="description">Photos</span>
              </div>
              <div>
                <span className="heading">89</span>
                <span className="description">Comments</span>
              </div>
            </div>
          </div>
        </Row>
        <div className="text-center">
          <h3>
            Jessica Jones
        <span className="font-weight-light">, 27</span>
          </h3>
          <div className="h5 font-weight-300">
            <i className="ni location_pin mr-2" />
        Bucharest, Romania
      </div>
          <div className="h5 mt-4">
            <i className="ni business_briefcase-24 mr-2" />
        Solution Manager - Creative Tim Officer
      </div>
          <div>
            <i className="ni education_hat mr-2" />
        University of Computer Science
      </div>
          <hr className="my-4" />
          <p>
            Ryan — the name taken by Melbourne-raised, Brooklyn-based
            Nick Murphy — writes, performs and records all of his own
            music.
      </p>
          <a onClick={e => e.preventDefault()}>
            Show more
      </a>
        </div>
      </CardBody>
    </Card>
</Col >