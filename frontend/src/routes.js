/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "./views/Index";
import Profile from "./views/authViews/Profile";
import Maps from "./views/authViews/Maps";
import Register from "./views/authViews/Register";
import Login from "./views/authViews/Login";
import Tables from "./views/authViews/Tables";
import Icons from "./views/authViews/Icons";
import CreateTaskTest from './views/CreateTaskTest';
import WorkSpace from './views/WorkSpace';
import Users from './views/Users';
import UserInfo from "./views/UserInfo";
import JoinOrCreateOrganization from "./views/authViews/JoinOrCreateOrganization";
import Tasks from "./views/Tasks";
import JoinUser from "./views/JoinUser"

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin",
    showRoute: false,
    exactLink: false
  },
  {
    path: "/workSpace",
    name: "WorkSpace",
    icon: "ni ni-briefcase-24 text-info",
    component: WorkSpace,
    layout: "/admin",
    showRoute: true,
    exactLink: false
  },
  {
    path: "/tasks",
    name: "Tasks",
    icon: "ni ni-briefcase-24 text-info",
    component: Tasks,
    layout: "/admin",
    showRoute: false,
    exactLink: false
  },
  {
    path: "/CreateTaskTest",
    name: "Create Task",
    icon: "ni ni-archive-2 text-red",
    component: CreateTaskTest,
    layout: "/admin",
    showRoute: true,
    exactLink: false
  },
  {
    path: "/users",
    name: "Users",
    icon: "ni ni-single-02 text-primary",
    component: Users,
    layout: "/admin",
    showRoute: true,
    exactLink: false
  },
  {
    path: "/joinUser/:joinLink?",
    name: "JoinUser",
    icon: "ni ni-single-02 text-primary",
    component: JoinUser,
    layout: "/admin",
    showRoute: true,
    exactLink: false
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "ni ni-planet text-blue",
    component: Icons,
    layout: "/admin",
    showRoute: false,
    exactLink: false
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "ni ni-pin-3 text-orange",
    component: Maps,
    layout: "/admin",
    showRoute: false,
    exactLink: false
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/admin",
    showRoute: false,
    exactLink: false
  },
  {
    path: "/tables",
    name: "Tables",
    icon: "ni ni-bullet-list-67 text-red",
    component: Tables,
    layout: "/admin",
    showRoute: false,
    exactLink: false
  },
  {
    path: "/userinfo/:token?",
    name: "UserInfo",
    icon: "ni ni-circle-08 text-pink",
    component: UserInfo,
    layout: "/auth",
    showRoute: false,
    exactLink: true
  },
  {
    path: "/login/:token?",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
    showRoute: false,
    exactLink: false
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth",
    showRoute: false,
    exactLink: false
  },
  {
    path: "/joininviteorg",
    name: "Invite Or Join Organization",
    icon: "ni ni-circle-08 text-pink",
    component: JoinOrCreateOrganization,
    layout: "/auth",
    showRoute: false,
    exactLink: false
  },

];
export default routes;
