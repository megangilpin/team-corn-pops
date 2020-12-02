import * as React from "react";
import {
    SET_USER,
    LOGOUT,
    SET_IS_LOADING,
    SET_PROFILE_IMAGE,
    UPDATE_CHEF_PROFILE,
    SET_CHEF_PROFILE,
} from "../types";

const initialState = {
    isAuthenticated: false,
    profile: {
        email: "",
        primaryAddress: {},
        allergies: [],
        chefProfile: { _id: "", cuisineSpecialty: [] },
        favoriteCuisine: [],
    },
    isLoading: true,
};

const UserReducer = (state, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: true,
                profile: { ...state.profile, ...action.payload.user },
            };
        case LOGOUT:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: false,
                profile: {},
            };
        case SET_IS_LOADING:
            return {
                ...state,
                isLoading: action.payload,
            };
        case SET_PROFILE_IMAGE:
            return {
                ...state,
                profile: {
                    ...state.profile,
                    profilePicURL: action.payload,
                },
            };
        case SET_CHEF_PROFILE:
            return {
                ...state,
                profile: {
                    ...state.profile,
                    isChef: true,
                    chefProfile: { ...action.payload },
                },
            };
        case UPDATE_CHEF_PROFILE:
            return {
                ...state,
                profile: {
                    ...state.profile,
                    chefProfile: {
                        ...state.profile.chefProfile,
                        cuisineSpecialty: [...action.payload],
                    },
                },
            };
        default:
            return state;
    }
};

const UserContext = React.createContext(initialState);

const UserContextProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(UserReducer, initialState);

    const isLoading = (data) => {
        data = !!data;
        dispatch({ type: SET_IS_LOADING, payload: data });
    };

    const register = async (formValues) => {
        isLoading(true);
        const response = await fetch("/auth/register", {
            method: "post",
            body: JSON.stringify(formValues),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!data.user) {
            return {
                result: false,
                message: data.errors,
            };
        } else {
            dispatch({ type: SET_USER, payload: data });
            return { result: true };
        }
    };

    const login = async (formValues) => {
        isLoading(true);
        const response = await fetch("/auth/login", {
            method: "post",
            body: JSON.stringify(formValues),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!data.user) {
            return {
                result: false,
                message: data.errors,
            };
        } else {
            dispatch({ type: SET_USER, payload: data });
            return { result: true };
        }
    };

    const checkLogin = async () => {
        isLoading(true);
        const response = await fetch("/users", {
            method: "get",
            credentials: "include",
        });

        const data = await response.json();

        if (data.user) {
            dispatch({ type: SET_USER, payload: data });
        } else {
            dispatch({ type: LOGOUT });
        }
    };

    const uploadProfileImage = async (formData) => {
        const response = await fetch("/users/profileImageUpload", {
            method: "post",
            body: formData,
        });

        const data = await response.json();

        if (data.errors) {
            return {
                result: false,
                message: data.errors,
            };
        } else {
            dispatch({ type: SET_PROFILE_IMAGE, payload: data });
            return {
                result: true,
            };
        }
    };
    const logoutUser = async () => {
        dispatch({ type: LOGOUT, payload: null });
    };

    const registerChef = async (formValues) => {
        const response = await fetch("/chefs", {
            method: "post",
            body: JSON.stringify(formValues),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (data.errors) {
            return {
                result: false,
                message: data.errors,
            };
        } else {
            dispatch({ type: SET_CHEF_PROFILE, payload: data });
            return { result: true };
        }
    };

    const updateChefProfile = async (formValues) => {
        const response = await fetch("/chefs", {
            method: "put",
            body: JSON.stringify(formValues),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (data.errors) {
            return {
                result: false,
                message: data.errors,
            };
        } else {
            dispatch({ type: UPDATE_CHEF_PROFILE, payload: data });
            return { result: true };
        }
    };

    const updateUser = async (formValues) => {
        isLoading(true);

        const response = await fetch("/users", {
            method: "put",
            body: JSON.stringify(formValues),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!data.user) {
            return {
                result: false,
                message: data.errors,
            };
        } else {
            dispatch({ type: SET_USER, payload: data });
            return { result: true };
        }
    };

    React.useEffect(() => {
        const checkCookie = async () => await checkLogin();
        checkCookie().catch((error) => {
            console.log(error);
        });
    }, []);

    return (
        <UserContext.Provider
            value={{
                ...state,
                register,
                registerChef,
                login,
                logoutUser,
                updateUser,
                updateChefProfile,
                uploadProfileImage,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserContextProvider };
