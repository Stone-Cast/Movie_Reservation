import { useEffect } from "react";
import { useLocation, useSearch } from "wouter";

const MovieReservation = () => {
    const search = useSearch();
    const [, setLocation] = useLocation();
    const params = new URLSearchParams(search);
    const movie_id = params.get("movie");

    useEffect(() => {
        if (!movie_id) setLocation("/");
    }, [movie_id]);

    if (!movie_id) return null;
    // rest of component
};

export default MovieReservation;
