import * as actionTypes from './actions';
import { updateObject } from './utility';

const initialState = {
    setLoginValue: localStorage.getItem('CRM_Token_Value'),
    userImage: null,
    userName: null
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
            })
        default:
            return state;
    }
};

export default reducer;