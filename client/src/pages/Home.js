// pages/Home.js
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css';

export default function Home() {
    return (
        <Row> 
            <Col className="text-center mx-auto">
                <img 
                    className="homelogo img-fluid" 
                    src="/logo.png" 
                    alt="Welcome"
                />
                <div className="text-background"> 
                    <h1 className="welcome-title text-light">Welcome to Movies</h1>
                    <Link className="btn btn-warning btn-lg" to={"/movies"}>Check Movies</Link>
                </div>
            </Col>
        </Row>
    );
}
