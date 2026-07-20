import { useContext } from "react";
import AuthContext from "./authContextValue.js";

export default function useAuth() {
    return useContext(AuthContext)
}
