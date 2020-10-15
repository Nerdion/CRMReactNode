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
import Profile from "./views/authViews/Profile";
import Register from "./views/authViews/Register";
import Login from "./views/authViews/Login";
import CreateTaskTest from './views/CreateTaskTest';
import WorkSpace from './views/WorkSpace';
import Users from './views/Users';
import UserInfo from "./views/UserInfo";
import JoinOrCreateOrganization from "./views/authViews/JoinOrCreateOrganization";
import ForgotPass from './views/authViews/ForgotPass';
import Tasks from "./views/Tasks";
import JoinUser from "./views/JoinUser";
import EditTask from "./views/EditTask";

var routes = [
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
    path: "/CreateTaskTest/:workspaceId",
    name: "Create Task",
    icon: "ni ni-archive-2 text-red",
    component: CreateTaskTest,
    layout: "/admin",
    showRoute: false,
    exactLink: false
  },
  {
    path: "/editTask/:tasks",
    name: "Edit Task",
    icon: "ni ni-archive-2 text-red",
    component: EditTask,
    layout: "/admin",
    showRoute: false,
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
    layout: "/auth",
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
    path: "/forgotpass/:token?",
    name: "Forgot Password",
    icon: "ni ni-key-25 text-info",
    component: ForgotPass,
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
