import { memo } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes.js";
import Card from 'react-bootstrap/Card';


const style = {
  padding: "10px",
  marginBottom: ".5rem",
  backgroundColor: "white",
  cursor: "move"
};

export const DnDCard = memo(function DnDCard({ id, title, index, poster, moveCard, findCard }) {
  const originalIndex = findCard(id).index;
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.CARD,
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          moveCard(droppedId, originalIndex);
        }
      }
    }),
    [id, originalIndex, moveCard]
  );
  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      hover({ id: draggedId }) {
        if (draggedId !== id) {
          const { index: overIndex } = findCard(id);
          moveCard(draggedId, overIndex);
        }
      }
    }),
    [findCard, moveCard]
  );
  const opacity = isDragging ? 0 : 1;
  return (
    <div ref={(node) => drag(drop(node))} style={{ ...style, opacity }}>
        <Card className="favoritesCard">
          { index < 9 ?
          <div className="favoritesNumber favoritesNumberOneDigit">
            { index + 1 }
          </div>
          :
          <div className="favoritesNumber favoritesNumberTwoDigit">
             { index+1 }
          </div>
          }
        <div>
        <Card.Img
              className="favoritesPoster"
              src={poster+"/100px180"}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src="/images/NoPosterAvailable.jpeg";
              }}/>
        </div>
        <div className="favoritesTitle">
        { title }
        </div>
        </Card>
    </div>
  );
});
