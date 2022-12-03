import React, { useState, useEffect } from 'react';
import MovieDataService from "../services/movies";
import { Link, useParams, useNavigate } from "react-router-dom";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import moment from 'moment';

const Movie = ({ user }) => {
    const navigate = useNavigate();
    let params = useParams();

    const [movie, setMovie] = useState({
        id: null,
        title: "",
        rated: "",
        reviews: []
    });

    useEffect(() => {
        const getMovie = id => {
        MovieDataService.findById(id)
        .then(response => {
            setMovie(response.data);
        })
        .catch(e => {
            console.log(e);
        }); 
    }
        getMovie(params.id)
    }, [params.id]);

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                    <div className="poster">
                    <Image
                        className="bigPicture"
                        src={movie.poster+"/100px250"}
                        onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src="/images/NoPosterAvailable.jpeg";}}
                        fluid />
                        </div>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Header as="h5">{movie.title}</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    {movie.plot}
                                    
                                </Card.Text>
                                {user &&
                                    <Link to={"/movies/" + params.id + "/review"}>
                                        Add Review
                                    </Link>}
                            </Card.Body>
                        </Card>
                        <h2>Reviews</h2>
                        
                        <br></br>
                        { movie.reviews.map((review, index) => {
                            return (
                                <div className="d-flex" key={review._id}>
                                    <div className="flex-shrink-0 reviewsText">
                                        <h5>{review.name + " reviewed on "} { moment(review.date).format("Do MMMM YYYY") }</h5>
                                        <p className="review">{review.review}</p >
                                        { user && user.googleId === review.user_id &&
                                            <Row>
                                                <Col>
                                                    <Link to={{
                                                        pathname: "/movies/" + params.id + "/review"
                                                    }}
                                                    state = {{
                                                        currentReview: review
                                                    }}>
                                                        Edit
                                                    </Link>
                                                </Col>
                                                <Col>
                                                    <Button variant="link" onClick={ () => 
                                                    {
                                                        //TODO: Implement delete behavior
                                                        var data = {
                                                            review_id: review._id,
                                                            user_id: user.googleId,
                                                        }    
                                                        
                                                        MovieDataService.deleteReview(data)
                                                        .then(response => {
                                                            navigate("/movies/" + params.id)
                                                        })
                                                        .catch(e => {
                                                            console.log(e)
                                                        });

                                                        setMovie((prevState) => {
                                                            prevState.reviews.splice(index, 1);
                                                            return ({
                                                              ...prevState
                                                            })
                                                          })
                                                    }}>
                                                        Delete
                                                    </Button>
                                                </Col>
                                            </Row>
                                        }
                                    </div>
                                </div>
                            )
                        })}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}


export default Movie;