import * as actionTypes from './actions';
import { updateObject } from './utility';

const initialState = {
    setLoginValue: localStorage.getItem('CRM_Token_Value'),
    userImage: null,
    userName: null,
    orgName: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_LOGIN:
            return updateObject(state, {
                setLoginValue: action.setLoginValue
            });
        case actionTypes.ADD_PROFILE:
            return updateObject(state, {
                userImage: action.userImage,
                userName: action.userName
            });
        case actionTypes.SET_ORGNAME:
            return updateObject(state, {
                orgName: action.orgName,
            })
        default:
            return state;
    }
};

export default reducer;