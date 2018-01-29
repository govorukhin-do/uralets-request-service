import {createAction, handleActions} from 'redux-actions';
import shortid from 'shortid';
import moment from 'moment'

export const toggleLightbox = createAction('TOGGLE_LIGHTBOX', (data) => (data));
export const pupilListSetLoading = createAction('PUPIL_LIST_SET_LOADING', (data) => (data));
export const trainerListSetLoading = createAction('PUPIL_TRAINER_SET_LOADING', (data) => (data));
export const setPupilList = createAction('SET_PUPIL_LIST', (data) => (data));
export const setTrainerList = createAction('SET_TRAINER_LIST', (data) => (data));
export const addSelectedPupils = createAction('ADD_SELECTED_PUPILS', (data) => (data));
export const removeFromSelectedPupils = createAction('REMOVE_SELECTED_PUPILS', (data) => (data));
export const updateSelectedPupils = createAction('UPDATE_SELECTED_PUPILS', (data) => (data));

export const getPupilList = () =>
    (dispatch, s, api) => {
        dispatch(pupilListSetLoading(true));
        return api.appApi.getPupilList().then((responce) => {
            dispatch(pupilListSetLoading(false));
            if (Array.isArray(responce) && responce.length) {
                dispatch(setPupilList(responce));
            }
            return responce;
        });
    };
export const getTrainerList = () =>
    (dispatch, s, api) => {
        dispatch(trainerListSetLoading(true));
        return api.appApi.getTrainerList().then((responce) => {
            dispatch(trainerListSetLoading(false));
            if (Array.isArray(responce) && responce.length) {
                dispatch(setTrainerList(responce));
            }
            return responce;
        });
    };
export const sendRequestToServer = () =>
    (dispatch, s, api) => {
        //dispatch(trainerListSetLoading(true));


        const state = s().request;
        const selectedPupils = state.selectedPupils.map(item => {
            const momemtBirthday = moment(item.birthday);
            const birthday = momemtBirthday.isValid() ? momemtBirthday.format("DD.MM.YYYY") : '';
            return {
                fio: item.fio,
                birthday: birthday,
                level: item.level,
                weight: item.weight,
                trainerFio: item.trainer.fio,
            }
        });
        return api.appApi.sendRequestToServer({selectedPupils}).then((responce) => {
            //    dispatch(trainerListSetLoading(false));
            debugger;
            return responce;
        });
    };


const initialState = {
    isOpenLightboxForAdding: false,
    isPupilListLoading: false,
    isPupilListReady: false,
    pupilList: [],
    isTrainerListLoading: false,
    isTrainerListReady: false,
    trainerList: [],
    selectedPupils: [],
};


const reducer = handleActions({
    [toggleLightbox.toString()]: (state, action) => {
        return {
            ...state, isOpenLightboxForAdding: action.payload,
        };
    },
    [pupilListSetLoading.toString()]: (state, action) => {
        return {
            ...state, isPupilListLoading: action.payload,
        };
    },
    [setPupilList.toString()]: (state, action) => {
        return {
            ...state,
            pupilList: action.payload,
            isPupilListReady: true,
        };
    },
    [trainerListSetLoading.toString()]: (state, action) => {
        return {
            ...state, isTrainerListLoading: action.payload,
        };
    },
    [setTrainerList.toString()]: (state, action) => {
        return {
            ...state,
            trainerList: action.payload,
            isTrainerListReady: true,
        };
    },
    [addSelectedPupils.toString()]: (state, action) => {
        const newItems = action.payload;
        if (!newItems || !newItems.length) return state;

        newItems.map(item => {
            item.frontId = shortid.generate();
            return item
        });

        const selectedPupils = [...state.selectedPupils, ...newItems];
        return {
            ...state,
            selectedPupils,
        };
    },
    [removeFromSelectedPupils.toString()]: (state, action) => {
        if (action.payload === undefined) return state;
        const index = action.payload;
        const selectedPupils = [
            ...state.selectedPupils.slice(0, index),
            ...state.selectedPupils.slice(index + 1)
        ];
        return {
            ...state,
            selectedPupils,
        };
    },
    [updateSelectedPupils.toString()]: (state, action) => {
        if (!action.payload) return state;
        const index = action.payload.index;
        const props = action.payload.props;
        const updatedItem = {...state.selectedPupils[index], ...props};
        const selectedPupils = [
            ...state.selectedPupils.slice(0, index),
            updatedItem,
            ...state.selectedPupils.slice(index + 1)
        ];

        return {
            ...state,
            selectedPupils,
        };

    },

}, initialState);


export default reducer;
