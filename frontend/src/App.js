import { useState, useEffect, useCallback } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import MoviesList from "./components/MoviesList";
import Movie from "./components/Movie";
import AddReview from "./components/AddReview";
import Favorites from "./components/Favorites";

import './App.css';
import Login from "./components/Login";
import Logout from "./components/Logout";
import { GoogleOAuthProvider } from '@react-oauth/google';
import MovieDataService from "./services/movies";
import FavDataService from "./services/favorites";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;


function App() {

  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [doSaveFaves, setDoSaveFaves] = useState(false);
  const [favMovies, setFavMovies] = useState([]);

  const retrieveFavorites = useCallback(() => {
    FavDataService.getAll(user.googleId)
      .then(response => {
        setFavorites(response.data.favorites);
      })
      .catch(e => {
        console.log(e);
      });
  }, [user]);

  const saveFavorites = useCallback(() => {
    var data = {
      _id: user.googleId,
      favorites: favorites
    }

    FavDataService.updateFavoritesList(data)
      .catch(e => {
        console.log(e);
      });
  }, [favorites, user]);

  const retrieveFavoriteMovies = useCallback(() => {
    MovieDataService.getByIdList(favorites)
      .then(response => {
        let sorted = response.data.sort(
          function(a, b) {
            return favorites.indexOf(a._id) - favorites.indexOf(b._id);
          }
        );
        setFavMovies(
          sorted.map((element) => {
            return ({
              id: element._id,
              title: element.title,
              poster: element.poster
            });
          })
        );
      })
      .catch(e => {
        console.log(e);
      });
  }, [favorites]);


  useEffect(() => {
    if (user && doSaveFaves) {
      saveFavorites();
      setDoSaveFaves(false);
    }
  }, [user, favorites, saveFavorites, doSaveFaves]);

  useEffect(() => {
    if (user) {
      retrieveFavorites();
    }
  }, [user, retrieveFavorites]);



  useEffect(() => {
    let loginData = JSON.parse(localStorage.getItem("login"));
    if(loginData) {
      let loginExp = loginData.exp;
      let now = Date.now()/1000;
      if (now < loginExp) {
        setUser(loginData);
      } else {
        localStorage.setItem("login", null);
      }
    }
  }, []);
  

  const addFavorite = (movieId) => {
    setDoSaveFaves(true);
    setFavorites([...favorites, movieId])
  }

  const deleteFavorite = (movieId) => {
    setDoSaveFaves(true);
    setFavorites(favorites.filter(f => f !== movieId));
  }

  const reorderFavorites = (newFavs) => {
    console.log(newFavs);
    setDoSaveFaves(true);
    setFavorites(newFavs);
  }


  // useEffect(() => {
  //   if (user) {
  //     retrieveFavorites();
  //   }
  // }, [user, retrieveFavorites]);
  useEffect(() => {
    retrieveFavoriteMovies();
  }, [favorites, retrieveFavoriteMovies]);


  return (
    <GoogleOAuthProvider clientId={clientId}>
    <div className="App">
      <Navbar bg="primary" expand="lg" sticky="top" variant="dark" >
        <Container className="container-fluid">
        <Navbar.Brand className="brand" href="/">
          <img src="/images/movies-logo.png" alt="movies logo" className="moviesLogo"/>
          MOVIE TIME
          </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" >
          <Nav className="ml-auto">
            <Nav.Link as={Link}  to={"/movies"}>
              Movies
            </Nav.Link>
            {
              user &&
              <Nav.Link as={Link}  to={"/favorites"}>
                Favorites
              </Nav.Link>
            }
          </Nav>
        </Navbar.Collapse>
        { user ? (
                <Logout setUser={setUser} />
              ) : (
                <Login setUser={setUser} />
              )}
        </Container>
      </Navbar>

      <Routes>
        <Route exact path={"/"} element={
          <MoviesList
            user={ user }
            addFavorite={ addFavorite }
            deleteFavorite={ deleteFavorite }
            favorites={ favorites }
          />}
          />
        <Route exact path={"/movies"} element={
          <MoviesList
            user={ user }
            addFavorite={ addFavorite }
            deleteFavorite={ deleteFavorite }
            favorites={ favorites }
          />}
          />
        <Route path={"/movies/:id/"} element={
          <Movie user={ user } />}
          />
        <Route path={"/movies/:id/review"} element={
          <AddReview user={ user } />}
          />
        <Route path={"/favorites"} element={
          user ?
          <Favorites
            user={ user }
            favorites={ favorites }
            favMovies= { favMovies }
            setFavorites={ setFavorites }
            doSaveFaves={ doSaveFaves }
            setDoSaveFaves={ setDoSaveFaves }
            reorderFavorites={ reorderFavorites }/>
          :
          <MoviesList
            user={ user }
            addFavorite={ addFavorite }
            deleteFavorite={ deleteFavorite }
            favorites={ favorites }/>
        } />
      </Routes>
      </div>
      </GoogleOAuthProvider>
  );
}

export default App;
