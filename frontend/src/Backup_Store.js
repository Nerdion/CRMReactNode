const { default: Login } = require("./views/authViews/Login")
const { default: Profile } = require("./views/authViews/Profile")
const { default: Register } = require("./views/authViews/Register")
const { default: UserInfo } = require("./views/UserInfo")

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


{/* <DialogBox
                    disableBackdropClick={true}
                    maxWidth={"sm"}
                    fullWidth={true}
                    DialogHeader={"Create New WorkSpace"}
                    DialogContentTextData={""}
                    DialogButtonText1={"Cancel"}
                    DialogButtonText2={"Save"}
                    Variant={"outlined"}
                    onClose={this.handleClose}
                    onOpen={setAddWorkspaceOpenClose}
                    OnClick_Bt1={this.handleClose}
                    OnClick_Bt2={this.handleClose}
                    B2backgroundColor={"#3773b0"}
                    B2color={"#ffffff"}
                >
                    <FormGroup className="mt-4">
                        <FormControl>
                            <FormLabel className="m-0">
                                <span className="text-default">  What would you like to call the WorkSpace? </span>
                            </FormLabel>
                            <TextField
                                autoFocus
                                margin="none"
                                id="name"
                                label="WorkSpace Name"
                                type="text"
                                required={false}
                                value={WorkSpaceName}
                                autocomplete="section-blue shipping"
                                onChange={(e) => this.onChangeText("WorkSpaceName", e.target.value)}
                                fullWidth
                            />
                        </FormControl>
                        <FormControl className="mt-5">
                            <FormLabel className="m-0">
                                <span className="text-default">  Description(Optional) </span>
                            </FormLabel>
                            <TextField
                                margin="dense"
                                id="name"
                                label="Description"
                                type="text"
                                rows={6}
                                rowsMax={6}
                                multiline={true}
                                required={false}
                                value={WorkSpaceDesc}
                                autocomplete="section-blue shipping"
                                onChange={(e) => this.onChangeText("WorkSpaceDesc", e.target.value)}
                                fullWidth
                            />
                        </FormControl>
                    </FormGroup>
                </DialogBox> */}


UserInfo

                 // checkUserAuthResponse = async () => {
    //     let title = "Error";
    //     try {
    //         // let encAuthData = await this.encryptData(authData);
    //         const UserLoginApiCall = await fetch(AuthUserResponse, {
    //             method: "POST",
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //             },
    //             // body: JSON.stringify(encAuthData)
    //         });
    //         const responseData = await UserLoginApiCall.json();
    //         console.log(responseData, 'UserLoginApiCallData')
    //         console.log(UserLoginApiCall, 'UserLoginApiCall');
    //         if (responseData.status === 200) {
    //             console.log("User Loggedin");
    //             title = "Success";
    //             const message = "User is Authorized";
    //             this.setState({ title, message, Alert_open_close: true, setActivityIndicator: false });
    //             //localStorage.setItem('CRM_Token_Value', responseData.token);
    //             setTimeout(() => {
    //                 this.props.history.push("/admin/index");
    //             }, 1000);


    //         }
    //         else {
    //             const message = "Invalid Data";
    //             this.setState({ title, message, Alert_open_close: true, setActivityIndicator: false });
    //         }
    //     } catch (err) {
    //         console.log("Error fetching data-----------", err);
    //         this.setState({ title, message: err, Alert_open_close: true, setActivityIndicator: false });
    //     }
    // }