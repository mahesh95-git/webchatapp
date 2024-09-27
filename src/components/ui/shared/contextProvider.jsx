import { UserProvider } from "@/context/userContext";
export default function ContextProvider({ children}) {
return <UserProvider>{children}</UserProvider>
}
