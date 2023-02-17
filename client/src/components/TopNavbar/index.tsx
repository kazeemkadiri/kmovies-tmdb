import { FormEvent, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link, useNavigate } from 'react-router-dom';
import './styles/topnavbar.scss';

const TopNavbar = () => {
    const [searchString, setSearchString] = useState('');
    const navigate = useNavigate()

    const searchForMovie = (event: FormEvent) => {
      event.preventDefault();
      navigate(`/search/${searchString}`);
    }

    return (
        <>
        {['lg'].map((expand: any) => (
          <Navbar key={expand} bg="light" expand={expand} className="nav-bg-color py-0">
            <Container className='nav-bg-color px-3 py-2' fluid>
              <Navbar.Brand><Link to="/">KMovies</Link></Navbar.Brand>
              <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
             

                  <Form className="w-100" onSubmit={(e) => { searchForMovie(e) }}>
                    <Row className='w-100 justify-content-end text-end'>
                      <Col md={7} sm={6} className="mx-0 px-0 my-1">
                        <Form.Control
                          type="search"
                          placeholder="Search"
                          className=""
                          aria-label="Search"
                          value={ searchString }
                          onChange={ e => { setSearchString(e.target.value) } }
                        />
                      </Col> 
                      <Col md={2} sm={2} className="mx-0 px-0 my-1">
                        <Button 
                          className="w-100"
                          variant="outline-success" 
                          type='submit'>
                            Search
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                
            </Container>
          </Navbar>
        ))}
      </>
    )
}

export default TopNavbar;


