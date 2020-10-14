import * as actionTypes from './actions';
import { updateObject } from './utility';

const initialState = {
    setLoginValue: localStorage.getItem('CRM_Token_Value')
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_LOGIN:
            return updateObject(state, {
                setLoginValue: action.setLoginValue
            });
        default:
            return state;
    }
};

export default reducer;