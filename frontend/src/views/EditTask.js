
import React from "react";

// Editor
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';


// reactstrap components
import {
    Container,
    Row,
    Col,
    Form,
    FormGroup,
    Label,
    Input,
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Alert,
    Card,


} from "reactstrap";

import {
    FiberManualRecord,
    ExpandMore,
    Telegram,
    PeopleAlt,
    SaveAlt,
    Edit,
    Add,
    Clear
} from '@material-ui/icons';

import {
    Tooltip,
    Button,
    FormControl,
    Avatar,
    FormLabel,
    Input as Input1
} from '@material-ui/core';

//Api

import { saveEditTaskDataApi, getTaskData, getUserTaskDataApi } from '../views/CRM_Apis';

// core components

import Header from "../components/Headers/Header.js";
import DialogBox from '../components/DialogBox/DialogBox';
import UserTaskCard from '../components/Cards/UserTaskCard';

let linkTaskId = null;
class EditTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            openMenu: null,
            options: [
                { "option": "Draft", "icon": FiberManualRecord, "color": "#bac7d4" },
                { "option": "Pending", "icon": FiberManualRecord, "color": "#e8cd82" },
                { "option": "Finished", "icon": FiberManualRecord, "color": "#83e67e" },
            ],
            statusName: "Draft",
            statusColor: "#bac7d4",
            statusData: null,
            users: [
                {
                    "userName": "Nishad Patil",
                    "userImage": "data:image/jpeg;base64,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",
                    "userId": 1
                },
                {
                    "userName": "Neel Khalade",
                    "userImage": "https://storage.pixteller.com/designs/designs-images/2016-11-19/02/thumbs/img_page_1_58305b35ebf5e.png",
                    "userId": 2
                },
                {
                    "userName": "Molly Kal",
                    "userImage": "https://i.pinimg.com/originals/be/ac/96/beac96b8e13d2198fd4bb1d5ef56cdcf.jpg",
                    "userId": 3
                },

            ],
            enableEditor: false,
            setAddUsersBol: false,
            userSearch: '',
            userObj: [],
            topicName: '',
            stepTitle: '',
            editData: [
                {
                    taskId: 1,
                    topicName: "This is new Topic",
                    stepTitle: "I Know this is some Task",
                    statusData: {
                        statusColor: "#e8cd82",
                        statusName: "Pending"
                    },
                    users: [
                        {
                            "userName": "Nishad Patil",
                            "userImage": "data:image/jpeg;base64,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",
                            "userId": 1
                        },
                        {
                            "userName": "Neel Khalade",
                            "userImage": "https://storage.pixteller.com/designs/designs-images/2016-11-19/02/thumbs/img_page_1_58305b35ebf5e.png",
                            "userId": 2
                        },
                        {
                            "userName": "Molly Kal",
                            "userImage": "https://i.pinimg.com/originals/be/ac/96/beac96b8e13d2198fd4bb1d5ef56cdcf.jpg",
                            "userId": 3
                        },

                    ]

                },
                {
                    taskId: 2,
                    topicName: "This is new Topic",
                    stepTitle: "I Know this is some Task",
                    statusData: {
                        statusColor: "#e8cd82",
                        statusName: "Pending"
                    },
                    users: [
                        {
                            "userName": "Nishad Patil",
                            "userImage": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAPEBAQEBAWEBANDRIbEBUVDRAQEA4SIB0iIiAdHx8kKDQsJCYxJx8fLTItMSwuMDAwIys1QD9AQDQ5MC4BCgoKDg0NFg8QFSsZFhkrKys3NzcrNzc3Nzc3Nys3NzIrNysrLS03Kzc3KysrNysrKys3Ky0rLSsrKysrKysrK//AABEIAMgAyAMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAADBAUGAAIHAQj/xAA+EAACAgEDAgQDBgUBBQkAAAABAgADEQQSIQUxBhNBUSJhcQcjMoGRoRRSscHw0UJDYpLhFhckcoKTosLx/8QAGQEBAAMBAQAAAAAAAAAAAAAAAAECBAMF/8QAJREBAQACAgICAgEFAAAAAAAAAAECEQMSITEEQSJREwUygbHh/9oADAMBAAIRAxEAPwDZEh0SYiQ6JAxEhlSeokMiQNVSFVJuqQqpA0VIQJCKkW6xqxp6LLS61hF4ZwxRT2GQOYDASD1WorpUva61oO7MwUThnV/GWt1TAteyKp4Wsmpf25P5yG1mre0g2Ozkdtzs+P1gdq6h4+6fSVAtN27v5Shwn1yRFl+0rp+QCLVB9TUuB++ZxitsQhGfX8o0O1/94fTu+9//AGHjGl8cdNs7akKfZ0sTH6jE4UFPcHtNS/5SdUfSGi19F4zTclnGfhdWOPpGCk+a6tQRghipHqCQZf8Aw99pltKLXqa/PVQAHDYtx8/Q/tIRt1MpNGSZ0zX06qpbqHDo44I7j5EehjDJCSbJBMkdZIJkgJMkEyR1kgXSAk6QDpHnSAdICLrPYZ0mQDosOiTxFh0WB6iwyJMRIdFgeIkMqz1UhlSAh1XqFekqa63OxO+1CxnG/Gnjy3X7qax5Wm4+HgvZg92P9hL79q/W0o0jabaWs1KjH4gqID3z68jtOHEyEvcH0mbTPQ3P9YYFSD8paIBHEKjj1nmPpj8pirjkc/lJG+358QVi88Quffj8oKySjTXcZ5unkyVokuk9Yv0rb6LmqPrtb8X1HYzq/gLx6NWRp9UQt5/A4wq3H2I9D/WcWBxNkYggjg5kD6jZIJllP+zDxNZq6zp7zutpTKvx8deQOfmOJd2SEknSBdI6yQLrASdYB0jrpAOsBJ1mQzrPIBkWMIs0rWMIsDZFh0WeIsOiwPUWGVZiLDKsDiH206rOuSsZ+60qZ54yST/TE50ZdfteuVuqXBTnYlSt8m2g/wB5S+IWeARik+mBBgZ4Ah6aTx8JyflI35Jjazj1HMCeO3Ek69CxOCCP2nlnS2PYH9DzLWpmF/SN3Ezw/SWHS9Bdv92eByZtf4YuyMJ/8hxK3KL/AMWX6VskGYq/vLH/ANlLsgbcZ79o/pfCJA3PnP8ALzK3OJnBlVLZSODNRLF1joj1Dc3GRx64+plfI/aWxu3PPC43Vdx+yDpWmGk/iqtzXWlksLcBMYJVR7djL4yzl32GdTJ/idIWJAUWIPQc4b+qzq7LChNlgHWOusA6yQk6wDrHXWLusBJ1mQtizIBaxGEWDrEYQQCIsOizRBDoIG6LDIs1RYdFgfLnjck9R1xJz/46/n6ORIOWHx/Rs6nrh76u0/8AMxb+8r5XmErN4a6etmCR6y5UdDr9hyJDeDNERWGPqePpLzp07TDy8l34enw4fijNN4fUHO3JPvJrQ9DqU7igJ+YjWlqJklRUfaVx5L9rZYwJem1Yxt/pNH6VV/L27SQCmDtRvaX7q6RluiQcgD9BENXp/b0+kmbUaI3r78ynZaRUvE+lU0tkek5VcmM47Cdn67p/MqdR3KnE5Fq6GrdkYYIPrNXBdxm+Tj9rV9jeo2dUqXn76q1eP/Lu5/5Z39lnAfsd0xbqtBxkVpcT8vgI/uJ9Bus7MRR1gHWNuIBxAUdYu6xxxF3EBOwTyFsEyBvWIxWIGsRmsQCoIwggkEYQQCIIdBBoIdBA4h9uvRBVqKdWq4XUoVsPp5i+v5j+k5/4Y0Yu1CI3I74951j7TLbdd5lB+Guok0YxhnHHP1nOPAunb+MAx+BGzxOdzll00ziyxuNq7X216VN9hCIPkf0Ehj4/UP8ADUdg7E43NLFrelJcVaxd615wp7ZPrIpbq1tNFOlV7AOESne5GPyA/WZZ1vubbcplrcujmh+0SsDmlz78quP1lj6V470lxCjIYjODOYV206+5KKdB99dZhdtmwn3JAAH7ye6V4eOmcs1LKU/FknK8+o9pbLHGTenLj7ZX26vV1ao8diVyM+olf6r4zqoW3KktW4AH82YbRaVLAjey9+eJCdc0AdrCE8zOA3Bx+WOZTG4u3RXdd9pdtmRXWEy3qu7j/MwdXUer3/eV1hQeRlNox9D3muuou6U1NlmmVV1G4oThcY98An2+cktP1nXtp69W1BWi1mAYFX7HHK4BxO11renHV7a2zp3U9U1i06mg1s2cOPwMf7Sr/aJSFtqwMEqefznSdOfMUMRzwfUSleP9E1up0yIMs6ED65jjs3uHLL10sX2EdIYfxOrOdpArTtye7f8A1nWXE534DS3Q+Tp/MLVFvjByRub1HtzOjuJ2wzmXphz47hfJVxAOI04gHEuoUcRewRtxF7BAUsEybWCZA2rEZrEXrjNcA6CMIIBIwkAyCGA9u/pBpDJA5zrtPudgR/uzu+RyZR+gabb1Cz4SoNL44HPIGZ0rrSrVqbgezqrD5j1lP17outpZCMWKw/I8/wBpj3q2PY8ZYSp+ircNv80303QxUwsqG1/cHme9Pswef7Swacg4nDdlTb4RfS+keTa1yV1pbbnc4rAfnvz6Z+UL1eobOcs4B+JmY4z3xzJ3HEhuqH0k3O1GM87C6Lp8VH88TNNUA53DcM8d+D7iPdNrxWcRZRh/rI9LW7ea3pHnp5bFbaw2QtihwP8ASCfpDFVVyNla4RQMIo9gJN1KRzN7XGOZft4c9K++mCjAHb5SsdW0pfX6LAzhLs/oJcNY45+khECnW1uWC+Rp7CckepxJwqLEjRUTYuOCdoX65l0eVnoJFmoU44VGYD27ASzvNPDPG2P5OX5SF3EA4jLxd52ZiziL2CMvF7ICtgmT2yewMrjCRauM1wGa4wkWSMJAYSHSASGSBBeLOmGwLaoyUGG+S+/9ZzzxbogiV3KoD0sp3YHPM7MBng8g94sejaY96EOfdQROOfFu7jXxfJ649bHMNFf2Pv7yzaC/gGU3Uv5d1lfby7WBHPGDJ3puoxj2mXkx1W3C9sVuqcYwZXup9Spqew2nbtOPwM2B78Dt85mp65VSCWYfCOeRKV4l8bjzBXXWCwJ3M2Mj5SuONqZ4dM6ZZWashgcrkEHiR6aul2ISwMytyBk4PtKJpus+UjWFXUA18byKyW7j8sR7o3jSt7vLdNvwjYcDavv2lutPTpHpI/VXcH5QCdWrsGFcEjGcGA1V3rKohPV3yO6SostuuI3BnKqTg42/9ZvqXLstY/FY2B+c6TR0umtETy1PloACUXJxNGHHuOHLzTCojwzoNga0jG/hfmPf/PaTLwhAHA4A7QTzRjj1mmDPLtdgvAPDvF3llQLIs8YeL2QF7Jk8snsDWsxmsxSsxmswGkMYQxVDGEMBlDDpFkMOhgMKYVTF1MMpgcs+0TR+Trd4UBb1DZAHxN2P+v5xbSXEJkcnbx9Zb/tL0ivpq7D+Kq3A49COf6CUbSWgED2mflj0fj5bxKU+GL7VD22jer5UFd6gjtxnmFq8MtqHDNd97n4sVIi5/wA+ctegsBAE16n0cWDzK3eqxRkFMZ/Q8TjMmqaat0zWKuzzEbI4OF3CV63wy9L+YXrdgchWr/uIx03pXWXcm3V7Ks/D91S7OP04k7X0Yp8VlzWt81Vf2Et20ntKoy6DWV27hhQ3orFx3yMZ7YlwW8tWpbhivxDPrGblCjEi9dfxgd/ylfdc6k/CWjN2rDkZWr4j29O37zojGVrwHo9mnNp73tx2/AOB++ZY2M14TUeZzZds60YwLzdjBOZdyCcwDmFcwDmAFzF7DDOYvYYALDMmthmQNazGKzFKzGEMBtDGEMUQw6GA2hh0MURodGgMqYUN+0WUwHVXxRZxnKEAZ/F8oTJu6cq8X+I21PVBSHIrrrsQV5BUHGd3HqcD8pB9RssqIIOPbvNeq6TyuqO1mFc6keWoPLIynBHyAEtOt6YLq8Y59Jl5MtXT1OPCSaiH6P4trQqlp2k+ssj+J6gmQ4xsb/aGZzbrHh6wMcDkHjgyD1XTbk/2WA9TyV/aVmON+05dp9O2HxYgzkj4FXHxAbj7Q1niCphncM/WcGu3oAqsThsnuOcQ2m/iGXaN5LccBu0t/HP2pM7brTq+t8RVE4U5wecQKubsY9Tz8hKp0DoF+RuBGfTnH5y/abRClB7gcn3MruT06WWuj9GrCaahVxhaU7fSMsZE+G7fuEUnLBAW57E89pJM01Y3ceVnNZV4xgnM9YwTtLKtHMA5m7mAcwBuYvYYVzF3MAVhmTSwzIA6zGEaJVtGEaA6jQ6NE0aHRoDiNDI0URpubcDOCT7DGTAeVpG9RuzZ5QbBehgP+H5zZtS2ARhT32nDMw9u8i9dezWJYuAGVCOeSPX8sSK68WN2qfjnpYYdP1ta/hs8u1iBuK4O0/rn9RJfpxBAk4mmW6u+h8Mr81KMfCvoR+cgdCpT4WGCvBHbEzc89Vs4svcba/QBuccj5RfTaBfVc+/AxJtQCICtMHHpM7RMwV6dpyMlFP8A6RBW9Pq/2awMdvhEl66uP/yB1CjtJR2IafTAdhNOp2BK2Y9lUk/pHwABIfrKm416dT8WptVR3/DnLH9AZOM8lq19Hc11qbBtsZaywHO1cAAH5yb35kW9Pl1OAxsJOWJPPf8AtNatQwOAwOSCQRyF7H95unh5mf5XcSLNBM0H/EKTtyN2M49ce88ZpZyeO0A7TZ2gHaBq7Rd2m7tF3aBpYZ5B2NMgCRowjRDzQoyTgTWzWkOihMhu7FgMQmS1MK4HczDrkXPP4fxY5xIivUOLiG27SvwgtzM0If74FVUEnHbnv3kOkw/aTPUCRvVlFY7k/iP+k9eza1RQM/mMCx8z6f5iJabnTsPKU4zwGBB5hnJ8mon7pUYZHGQIWkkO6QINRZhSSyDJJJA+Q/WemoB6gEJLJtJB4Rfimlt222siwAHgggZaE1LjdRlictwAPxfWQb8haC3YyMAfgc05P8o7GD6vpz5rMOQFXJ4z6wXUtatK6uyx9qV7CSATs+Q+ZkXrRryU1h1GNNaADVWq/cIezEn8X/F7SMsdzTrj/dKlqLMd4SxecxBGetFNowTwSAP14yMfOP7sgTJljZWlujkQTjJ5m6gzDKo2VvtwD7Sv9DvOq6guGxXWtgB7emCQfqY/1MPZmmr8dnr/ACL6mB13htKKfLTGbFwzswJH0+vsJ248LlXSZY442X3VyFS1VOqPkhTgk5i5s/A5GdlrDIzlAfQ/tOYarp/Uej2oumtOqqvQ762B2YH58fUS7dB69Rraz5beXaV+8TPx12L349fTmaNWe3n2Jpb3811K7lABVsjiAp6kQGN3whXI5A+H8x3niWbtths/Cu1xgrluPT/O8jVYMNQKzvAfJV88cwrMZfacOpUjcDlcdxBLerjKkEe4MitU1gprYKpZcZ+IrM1V77qxkKj9xk5Y/IydqdEg7QDtFv4ty5TaMBc53kn+k8TUBsjBBU85jaumztMgnaeSUIPXuzICzBNr9+Gb24hdYyYqc7rMEYxk49YtWwK2gV8q79/X1hUexqRtAQr6GVaJ9Hr2rF1J2kk5A74/zmMaUL5toLHtypPbPtE9VZZsrYKCRjPPbiNVuRcMgENV39QcyT6baB6zTYE3IFJyQDGWZDpskmwLz65JzAaG1z5wxtAc7c+sLQ9nkuCFDDdjBOPrBvyZ6jqStddm0YGC3GSv5RbqPWdrUlarCTnau1UBPzJ7TL036ZQ9m0gDJBH0nvUtPUVqd24UjBz34/6QnHr42CenF7w2ssDV2qQtQOERj+5PzjdVjV37KzupRcMh7rxkETfXvSrVOwyd3wnnjtDamzbdWAud+QT/AC4/wSU9xen3VvWQi7qyzkgkYqPtg8iIG8BtqqVVl3ICCMD1X8v7xLxVQ1a2W02FH2qxAx6cH9v6Ss0+JL2ekW2hq0sHdQDg8HJ+hnDls15afj8FyxueN8L3VeILU6jAP0mqKCMjse09r05ZhwCqnn/i+U4Y423StymJTREIhssDM13LAAjaoPwqf7/Ux/qxqNKeYpO8g8ZBzibamyxas7AXdhkZ7TbX32BasJklhn5TZj+M1HC5bspfWUVnUId5VvKI2+/eVrXeF9PZQLqnbSv5ucqxBBzj3+UtWrtHnoPLydvDYHHeLXun8MpdM5wcAeuZa1Ha6hCmjWVPQF1BuqatQ5Yje/zzzG9pBtW0ZU1nB3Et+c2s2lqCr7PhHw+44mjj784syTX+EkYMhHYL7k6Y8kqM8857zW9lxQVG8g8Z7AY5M3ptbyXBrAI3cZ4MUud2Sk8V4c5Hv7CQgZbENz5BBCgEc4xFtPaoNpVm79v17Q9Tv5lmQMehzF6XcmwEADPBHcwrR9LcWQEnOfXbtMyAFo3bQCML+UyWc6TrLb3wcAgY+vOZpQpNLB35BOcY4mTJDrBnVjSgWw8Y5z3jFLjzkxZ8Qq5Ge8yZIW+jOlDeZbubg9gJ7oGr8qxQ5x8QPJ44nsyD/glFtf8ADnALqM54znmFs1FZoVtpIXGBgEj0nkySa/2Y1Gr+6R1QnO3Ax2hNdqH21sq5O4Z78TJkhEjTqOn8yxCQCNpB5wSD3H7znfUuniq2yvkFHwDkjcPSZMlOWeHof0/O9uv1pP8AhbqJ2tSzFvLXNZPfb7flLHb5irhGAbyvX0YnvMmSvFHL5mMnNqehtaLNiKrAEd8/Se61n3V7SAN3xfMT2ZOzFPr/ACFdY5ezsFSv4T6sSIHV3WLSm1dzfCCMjjiZMgn0HrHXfVuU7uMEenME9ieeAUwdnBxMmSEh6YnFoWzOGbGcfDE7PwJvbdizjHvMmQfbagDzLDvySe2RxA6Tu/x7jv8A0mTJKK8rLbmLEYHbHcz2ZMhzvt//2Q==",
                            "userId": 1
                        },
                        {
                            "userName": "Neel Khalade",
                            "userImage": "https://storage.pixteller.com/designs/designs-images/2016-11-19/02/thumbs/img_page_1_58305b35ebf5e.png",
                            "userId": 2
                        }
                    ]

                }
            ],
            taskEditBol: false,
            taskIdToEdit: null,
            taskEditable: false,
            reload: true,
            title: '',
            message: '',
            Alert_open_close: false,
        };
    }

    componentDidMount() {
        linkTaskId = this.props.match.params.tasks;
        console.log("linkTaskId---->", linkTaskId)
        if (linkTaskId) {
            this.setState({ taskEditBol: true, taskIdToEdit: linkTaskId, taskEditable: true })
            this.getTaskData();
        }
        this.getUserProfile();

    }

    handleopen = () => {
        this.setState((prevState) => ({ openMenu: !prevState.openMenu }))
    }

    changeStatus = (color, status) => {
        this.setState({ statusName: status, statusColor: color, statusData: { statusColor: color, statusName: status } });
    }

    onChangeTextData = (state, text) => {
        this.setState({ [`${state}`]: text })
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    onClickEditTask = () => {
        this.setState((prevState) => ({ taskEditable: !prevState.taskEditable }));
    }

    onClickOpenAddUsers = () => {
        this.setState({ setAddUsersBol: true });
    }

    onClickCloseAddUsers = () => {
        this.setState({ setAddUsersBol: false });
    };

    onDismissAlert = () => {
        this.setState({ Alert_open_close: false });
    }

    handleInputChange = event => {
        const query = event.target.value;

        this.setState(prevState => {
            const filteredData = prevState.data.filter(element => {
                return element.name.toLowerCase().includes(query.toLowerCase());
            });

            return {
                query,
                filteredData
            };
        });
    };

    selectUsers = (UserName, UserImage) => {
        //   event.preventDefault();
        this.setState({ userObj: [...this.state.userObj, { userName: UserName, userImage: UserImage }] });
    }

    deleteSelectedUsers = (userName) => {
        let array = [...this.state.userObj]
        let filteredArray = array.filter(item => item.userName !== userName)
        this.setState({ userObj: filteredArray });
    }


    getUserProfile = async () => {
        let title = "Error";
        let crmToken = localStorage.getItem('CRM_Token_Value');
        try {
            const getUserProfileTaskData = await fetch(getTaskData, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `${crmToken}`
                },
                body: JSON.stringify({
                    taskId: this.state.taskIdToEdit
                })
            });
            const responseData = await getUserProfileTaskData.json();
            console.log('getUserProfileTaskData--->', JSON.stringify(responseData, null, 2))
            console.log(getUserProfileTaskData, 'getUserProfileTaskData');
            this.setState({
                users: responseData.userData
            })

        }
        catch (err) {
            console.log("Error fetching data-----------", JSON.stringify(err));
            this.setState({ title, message: JSON.stringify(err), Alert_open_close: true });
        }
    }


    getTaskData = async () => {
        let title = "Error";
        let crmToken = localStorage.getItem('CRM_Token_Value');
        try {
            const getWorkSpaceTaskData = await fetch(getUserTaskDataApi, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `${crmToken}`
                },
                // body: JSON.stringify({
                //     action: 4
                // })
            });
            const responseData = await getWorkSpaceTaskData.json();
            console.log('getWorkSpaceTaskData--->', JSON.stringify(responseData, null, 2))
            console.log(getWorkSpaceTaskData, 'getWorkSpaceTaskData');
            let editorRawData = htmlToDraft(responseData.task.editorRawData);
            this.setState({
                topicName: responseData.task.topicName,
                stepTitle: responseData.task.stepTitle,
                userObj: responseData.task.userObj,
                statusData: responseData.task.statusData,
                editorState: editorRawData
            })

        }
        catch (err) {
            console.log("Error fetching data-----------", JSON.stringify(err));
            this.setState({ title, message: JSON.stringify(err), Alert_open_close: true });
        }
    }


    onClickSaveEditWorkSpaceTask = async () => {
        const { topicName, stepTitle, userObj, statusData, editorState, taskIdToEdit } = this.state;
        let crm_token = localStorage.getItem('CRM_Token_Value');
        let title = "Error";
        let message = '';
        let editorRawData = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        console.log("data---->", { topicName, stepTitle, userObj, statusData });
        console.log("Editor Data--->", editorRawData);

        try {
            if (topicName === "" && stepTitle === "") {
                message = "Please Enter Topic Name and Step Title";
                this.setState({ title, message, Alert_open_close: true });
            }
            else if (topicName !== "" && stepTitle === "") {
                message = "Please Enter Step Title";
                this.setState({ title, message, Alert_open_close: true });
            }
            else if (topicName === "" && stepTitle !== "") {
                message = "Please Enter Topic Name";
                this.setState({ title, message, Alert_open_close: true });
            }
            else if (topicName !== "" && stepTitle !== "") {
                const UserRegisterApiCall = await fetch(saveEditTaskDataApi, {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authentication': `${crm_token}`
                    },
                    body: JSON.stringify({
                        topicName,
                        stepTitle,
                        userObj,
                        statusData,
                        editorRawData
                    })
                });
                const responseData = await UserRegisterApiCall.json();
                console.log(responseData, 'UserRegisterApiCallData')
                console.log(UserRegisterApiCall, 'UserRegisterApiCall');

                if (responseData.success === true) {
                    console.log("Task Added!");
                    const title = "Success"
                    message = "Task Created!";
                    this.setState({ title, message, Alert_open_close: true });
                    this.props.history.push(`/admin/editTask/${taskIdToEdit}`);
                }
                else {
                    message = "Invalid data";
                    this.setState({ title, message, Alert_open_close: true });
                }
            }
        }
        catch (err) {
            console.log("Error fetching data-----------", err);
            this.setState({ title, message: err, Alert_open_close: true });
        }
    }


    render() {
        let { editorState,
            options,
            openMenu,
            statusName,
            statusColor,
            users,
            userObj,
            userSearch,
            enableEditor,
            setAddUsersBol,
            topicName,
            stepTitle,
            statusData,
            taskEditable,
            Alert_open_close,
            title,
            message
        } = this.state;

        const AlertError =
            (
                <div>
                    <Alert isOpen={Alert_open_close} toggle={() => this.onDismissAlert()} color="danger" >
                        <h4 className="alert-heading">
                            {title}
                        </h4>
                        {message}
                    </Alert>
                </div>
            );


        let filtereContacts = users !== null ? users.filter(
            (item) => {
                return item.userName.toLowerCase().indexOf(userSearch.toLowerCase()) !== -1;
            }
        ) : '';
        return (
            <>
                <Header />
                {/* Page content */}
                <Container className="mt--7" fluid>
                    {AlertError}
                    <Row className="d-flex align-items-center justify-content-between">
                        <Col className="" xs="12" md="6" lg="8" xl="8">
                            <Form>
                                <FormGroup>
                                    <Label className="text-white" for="Topic">Topic Name</Label>
                                    <Input
                                        type="text"
                                        className="txt-lt-dark"
                                        name="TopicName"
                                        disabled={taskEditable}
                                        id="Topic"
                                        value={topicName}
                                        onChange={(event) => { this.onChangeTextData("topicName", event.target.value, event) }}
                                        placeholder="with a placeholder" />
                                </FormGroup>
                            </Form>
                        </Col>
                        <Col className="text-center mb-4" xs="6" md="3" lg="2" xl="2">
                            <Tooltip title="Status" arrow>
                                <ButtonDropdown disabled={taskEditable} className="" direction="left" isOpen={openMenu} toggle={() => this.handleopen()}>
                                    <Col className="mb-1">
                                        <span className="text-left text-defalut text-white-to-default mr-5">
                                            Status
                                        </span>
                                    </Col>
                                    <DropdownToggle size="md" className="br-sm outline-border">
                                        <FiberManualRecord style={{ color: statusColor }} />
                                        <ExpandMore style={{ color: "#d0d4d9" }} />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        {
                                            options.map((options, index) => (
                                                <DropdownItem key={index} onClick={() => this.changeStatus(options.color, options.option)} key={index}>< options.icon style={{ color: options.color }} />{options.option}</DropdownItem>
                                            ))
                                        }
                                    </DropdownMenu>
                                </ButtonDropdown>
                            </Tooltip>
                        </Col>
                        <Col className="text-center mt-1" xs="6" md="3" lg="2" xl="2">
                            <Button
                                variant="contained"
                                color="primary"
                                size="medium"
                                disabled={taskEditable}
                                startIcon={<Telegram />}
                                onClick={this.onClickOpenAddWorkSpace}
                            >
                                Notify Team
                            </Button>
                        </Col>
                    </Row>
                    <Row >
                        <Col xs="12" sm="12" md="12" lg="3" xl="3">
                            <Col className=" br-sm  bg-white card-shadow-lt-white p-2">
                                <div className="pt-2 pr-2 pl-2 pb-1 text-center ">
                                    <PeopleAlt style={{ fontSize: 60 }} />
                                </div>
                                <div className="text-center">
                                    <span className="txt-lt-dark font-weight-400">
                                        Team Members
                                    </span>
                                </div>
                                <Col className="mb-2 min-dn-ht hide-scroll-ind">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="medium"
                                        disabled={taskEditable}
                                        className="wd-100p mt-2"
                                        startIcon={<Add />}
                                        onClick={this.onClickOpenAddUsers}
                                    >
                                        Add Users
                                        </Button>
                                    {
                                        userObj.map((item, index) => (
                                            <UserTaskCard
                                                userName={item.userName}
                                                imageUrl={item.userImage}
                                            />
                                        ))
                                    }

                                </Col>
                            </Col>
                        </Col>
                        <Col className="mb-5 mb-xl-0" xs="12" sm="12" lg="9" xl="9">
                            <Col>
                                <Form>
                                    <FormGroup>
                                        <Label for="StepTitle">Step Title</Label>
                                        <Input
                                            type="text"
                                            className="txt-lt-dark"
                                            name="StepTitle"
                                            disabled={taskEditable}
                                            id="StepTitle"
                                            value={stepTitle}
                                            onChange={(event) => { this.onChangeTextData("stepTitle", event.target.value, event) }}
                                            placeholder="Step Title"
                                        />
                                    </FormGroup>
                                </Form>
                            </Col>
                            <div>
                                <div className="br-xs bg-white mb-4 align-items-center card-shadow-lt-white">
                                    <Editor
                                        readOnly={taskEditable}
                                        editorState={editorState}
                                        wrapperClassName="br-sm text-dark"
                                        editorClassName="p-3 ht-l"
                                        onEditorStateChange={this.onEditorStateChange}

                                    />
                                </div>
                                {/* <div className="bg-white align-items-centeer">
                                    <textarea
                                        disabled
                                        className="col-md-12 ht-m"
                                        value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                                    />
                                </div> */}
                            </div>
                            <Col className="mb-5 mb-xl-0" xl="12">
                                <Row className="d-flex align-items-center justify-content-center">
                                    <Col className="text-center p-1" xs="12" sm="12" lg="6" xl="6">
                                        <Button
                                            variant="contained"
                                            color={taskEditable ? "primary" : "secondary"}
                                            size="medium"
                                            className="wd-150"
                                            startIcon={<Edit />}
                                            onClick={this.onClickEditTask}
                                        >
                                            Edit
                                        </Button>
                                    </Col>
                                    <Col className="text-center  p-1" xs="12" sm="12" lg="6" xl="6">
                                        <Button
                                            variant="contained"
                                            disabled={taskEditable}
                                            color="primary"
                                            className="wd-150"
                                            size="medium"
                                            startIcon={<SaveAlt />}
                                            onClick={this.onClickSaveEditWorkSpaceTask}
                                        >
                                            Save
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Col>
                    </Row>
                </Container>
                <DialogBox
                    disableBackdropClick={true}
                    maxWidth={"sm"}
                    fullWidth={true}
                    DialogHeader={"Manage Users and Roals"}
                    DialogContentTextData={"Configure Users assignments, Roals, Completions and Content Access for this Subjects"}
                    DialogButtonText1={"Cancel"}
                    DialogButtonText2={"Confirm"}
                    Variant={"outlined"}
                    onClose={this.onClickCloseAddUsers}
                    onOpen={setAddUsersBol}
                    OnClick_Bt1={this.onClickCloseAddUsers}
                    OnClick_Bt2={this.onClickCloseAddUsers}
                    B2backgroundColor={"#3773b0"}
                    B2color={"#ffffff"}
                >

                    <Col className="shadow br-sm p-4" lg="12">
                        <FormControl className="col-md-12 col-lg-12 mt-4 mb-2 wd-100p">
                            <FormLabel className="m-0">
                                <span for="UserName" className="text-default">  Add Users  </span>
                            </FormLabel>
                            <Input1
                                type="text"
                                className="txt-lt-dark "
                                name="UserName"
                                id="UserName"
                                value={userSearch}
                                onChange={(event) => { this.setState({ userSearch: event.target.value }) }}
                                placeholder="Search for Users"

                            />
                        </FormControl>
                        <Col className="p-1 max-dn-ht-250  hide-scroll-ind" lg="12">
                            {
                                filtereContacts.map((users, index) => (
                                    <Card onClick={(event) => { this.selectUsers(users.userName, users.userImage, event) }} key={index} className="p-2 pl-3 pr-3 mt-1 cursor-point card-hover-view">
                                        <Row className="d-flex align-items-center justify-content-around d-fr-direction">
                                            <Col lg="3" className="d-flex align-items-center justify-content-center">
                                                <Avatar alt={users.userName} src={users.userImage} />
                                            </Col>
                                            <Col lg="9" className="d-flex align-items-center justify-content-center">
                                                <span className="text-clamp">{users.userName}</span>
                                            </Col>
                                        </Row>
                                    </Card>
                                ))
                            }
                        </Col>
                        {
                            userObj.length != 0 ?
                                <Col className="p-1 max-dn-ht-250 hide-scroll-ind" lg="12">
                                    <h3 className="txt-lt-dark"> Selected Users </h3>
                                    {
                                        userObj.map((users, index) => (
                                            <Card key={index} className="p-2 pl-3 pr-3 mt-1 cursor-point card-hover-view">
                                                <Row className="d-flex align-items-center justify-content-around d-fr-direction">
                                                    <Col lg="3" className="d-flex align-items-center justify-content-center">
                                                        <Avatar alt={users.userName} src={users.userImage} />
                                                    </Col>
                                                    <Col lg="8" className="d-flex align-items-center justify-content-center">
                                                        <span className="text-clamp">{users.userName}</span>
                                                    </Col>
                                                    <Col lg="1" className="d-flex align-items-center justify-content-center">
                                                        <span
                                                            className="txt-lt-dark cursor-point p-2"
                                                            onClick={() => { this.deleteSelectedUsers(users.userName) }}
                                                        >
                                                            <Clear className="text-red" />
                                                        </span>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        ))
                                    }
                                </Col> : null
                        }
                    </Col>
                </DialogBox>
            </>
        );
    }
}

export default EditTask;