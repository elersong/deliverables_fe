import './App.css'
import {Route, Routes} from "react-router-dom";
import Feed from "./pages/Feed.tsx";
import Admin from "./pages/Admin.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

function App() {

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={false} />
                <Routes>
                    <Route index element={<Feed/>}/>
                    <Route path="/lissaonly" element={<Admin/>}/>
                </Routes>
            </QueryClientProvider>
        </>
    )
}

export default App
