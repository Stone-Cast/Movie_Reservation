import { Route, Switch, useLocation } from "wouter";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import SignInForm from "./components/SignInForm";
import RegisterForm from "./components/RegisterForm";
import { UserDataProvider } from "./contexts/AuthContext";
import MovieReservation from "./components/MovieReservation";
import { ProtectedRoute } from "./contexts/ProtectedRoute";
import NotFoundPage from "./components/NotFoundPage";

const NAVBAR_ROUTES = ["/", "/reserve"];

const App = () => {
    const [location] = useLocation();
    const showNavbar = NAVBAR_ROUTES.includes(location);

    return (
        <UserDataProvider>
            {showNavbar && <Navbar />}
            <main>
                <Switch>
                    <Route path={"/"} component={Home} />
                    <Route path={"/sign-in"} component={SignInForm} />
                    <Route path={"/register"} component={RegisterForm} />
                    <Route path={"/reserve"}>
                        <ProtectedRoute>
                            <MovieReservation />
                        </ProtectedRoute>
                    </Route>
                    <Route component={NotFoundPage} />
                </Switch>
            </main>
        </UserDataProvider>
    );
};

export default App;
