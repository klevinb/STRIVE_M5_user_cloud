import React, { Component } from 'react';
import './App.css';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  ListGroup,
  Alert,
  Form
} from 'react-bootstrap'

class App extends Component {

  state = {
    books: [],
    comments: [],
    showModal: false,
    addComment: false,
    newComment: {
      bookID: "",
      username: "",
      text: ""
    }
  }

  fetchBookComments = async (id) => {
    const apiUrl = process.env.REACT_APP_API_URL
    const resp = await fetch(apiUrl + "/books/" + id + "/comments")
    if (resp.ok) {
      const comments = await resp.json()
      console.log(comments)
      this.setState({
        showModal: true,
        comments
      });
    } else {
      this.setState({
        showModal: true
      });
    }
  }

  deleteComment = async (id) => {
    const apiUrl = process.env.REACT_APP_API_URL
    const resp = await fetch(apiUrl + "/books/comments/" + id, {
      method: "DELETE"
    })
    if (resp.ok) {
      this.setState({
        showModal: false,
        comments: []
      });
    }
  }

  handleChange = (e) => {
    const newComment = this.state.newComment
    newComment[e.currentTarget.id] = e.currentTarget.value

    this.setState({
      newComment
    });
  }

  addComment = async (id) => {
    const newComment = this.state.newComment
    newComment.bookID = id
    this.setState({
      newComment,
      addComment: true
    });
  }

  sendNewComment = async (e) => {
    e.preventDefault()
    const apiUrl = process.env.REACT_APP_API_URL
    const resp = await fetch(apiUrl + "/books/" + this.state.newComment.bookID + "/comments", {
      method: "POST",
      body: JSON.stringify(this.state.newComment),
      headers: {
        "Content-Type": "application/json"
      }
    })
    if (resp.ok) {
      this.setState({
        addComment: false,
        newComment: {
          bookID: "",
          username: "",
          text: ""
        }
      });
    }
  }

  render() {
    return (
      <div className="App" >
        <Container className="mt-5">

          <Row sm={1} md={3}>
            {this.state.books.map(book =>
              <Col key={book.asin} className="mb-3">
                <Card style={{ width: '18rem' }}>
                  <Card.Img variant="top" onClick={() => this.fetchBookComments(book.asin)} src={book.img} />
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <Card.Text>
                      Category : {book.category}<br></br>
                         Price : {book.price} $
                   </Card.Text>
                    <Button
                      variant="info"
                      onClick={() => this.addComment(book.asin)}
                    >Add Comment</Button>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
          <Modal
            show={this.state.showModal}
            onHide={() => this.setState({
              showModal: false,
              comments: []
            })}>
            <Modal.Body>
              <ListGroup className="text-center">
                <h1>Comments</h1>
                {this.state.comments.length > 0 ?
                  this.state.comments.map((comment, index) =>
                    <ListGroup.Item key={index} className="d-flex justify-content-between">
                      <div>
                        {comment.username} : {comment.text}
                      </div>
                      <div>
                        <Button variant="danger" onClick={() => this.deleteComment(comment.commentID)} className="mr-3">Delete</Button>
                        <Button variant="warning">Edit</Button>
                      </div>
                    </ListGroup.Item>
                  )
                  :
                  <Alert variant="danger">
                    There are no comments for this book!
                  </Alert>
                }
              </ListGroup>
            </Modal.Body>
          </Modal>
          <Modal
            show={this.state.addComment}
            onHide={() => this.setState({
              addComment: false,
              newComment: {
                bookID: "",
                username: "",
                text: ""
              }
            })}>
            <Modal.Body>
              <Form onSubmit={this.sendNewComment}>
                <Row className="d-flex justify-content-center text-center">
                  <Col md={7}>
                    <Form.Group controlId="username">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={this.state.newComment.username}
                        placeholder="Write your name.."
                        onChange={this.handleChange}
                      >
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={7}>
                    <Form.Group controlId="text">
                      <Form.Label>Comment</Form.Label>
                      <Form.Control
                        type="text"
                        value={this.state.newComment.text}
                        placeholder="Write your comment.."
                        onChange={this.handleChange}
                      >
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={7}>
                    <Button
                      variant="success"
                      type="submit"
                    >Send comment</Button>
                  </Col>
                </Row>
              </Form>

            </Modal.Body>
          </Modal>
        </Container>
      </div>
    );
  }

  componentDidMount = async () => {
    const apiUrl = process.env.REACT_APP_API_URL
    const resp = await fetch(apiUrl + "/books")
    if (resp.ok) {
      const books = await resp.json()
      console.log(books)
      this.setState({
        books
      });
    }
  }

}

export default App;
