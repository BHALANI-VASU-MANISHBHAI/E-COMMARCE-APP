import { useContext } from "react";
import { GlobalContext } from "./GlobalContext";
import { useState } from "react";

const GlobalContextProvider = ({ children }) => {

    const [searchbar, setSearchbar] = useState(false);

    const values = {
        searchbar,
        setSearchbar
    };



    return (
        <GlobalContext.Provider value={values}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalContextProvider;
