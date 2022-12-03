import React from 'react';
import Container from 'react-bootstrap/Container';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FavoritesList from './FavoritesList'

import "./Favorites.css";

const Favorites = ({
  setFavorites,
  doSaveFaves,
  setDoSaveFaves,
  favMovies,
  reorderFavorites }) => {

  return (
    <div>
      <Container className="favoritesContainer">
        <div className="favoritesPanel">
          {
            favMovies.length < 1 ?
              "You haven't chosen any favorites yet"
              :
              "Drag your favorites to rank them"
          }
        </div>
        <DndProvider backend={HTML5Backend}>
          <FavoritesList
            favMovies={ favMovies }
            setFavorites={ setFavorites }
            doSaveFaves={ doSaveFaves }
            setDoSaveFaves={ setDoSaveFaves }
            reorderFavorites={ reorderFavorites }/>
        </DndProvider>
      </Container>
    </div>
  )
}

export default Favorites;