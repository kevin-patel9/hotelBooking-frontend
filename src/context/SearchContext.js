import { configureStore, createSlice, getDefaultMiddleware } from '@reduxjs/toolkit'
import { getNextDate } from '../common/DateDetail';

const initialState = {
    city: undefined,
    dates: [{ startDate: new Date(), endDate: getNextDate() }],
    options: {
        adult: 1,
        children: 0,
        room: 1
    }
}

const slice = createSlice({
    initialState,
    name: "hotel-booking",
    reducers: {
        newSearch: (state, action) =>{
            return action.payload
        },
        resetSearch: (state, action)=> {
            return state
        }
    }
});

export const { newSearch, resetSearch } = slice.actions;

const authSlice = createSlice({
    initialState: {
        user: JSON.parse(localStorage.getItem("user")) || null ,
        loading: false,
        error: null
    },
    name: "auth",
    reducers: {
      loginStart: (state, action) => {
        return {
            user: null,
            loading: true,
            error: null
        };
    },
      loginSuccess: (state, action) => {
        return {
            user: action.payload,
            loading: false,
            error: null
        };
    },
      loginFail: (state, action) => {
        return {
            user: null,
            loading: false,
            error: action.payload
        };
    },
      logout: (state, action) => {
        return {
            user: localStorage.clear(),
            loading: false,
            error: null
        };
        
    }
}
});

export const { loginStart, loginSuccess, loginFail, logout } = authSlice.actions;

export const store = configureStore({
    reducer: {
        booking: slice.reducer,
        auth: authSlice.reducer
    },
    middleware: getDefaultMiddleware({
        serializableCheck: false
    })
});
