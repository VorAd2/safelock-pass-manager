import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SIGNUP_ROUTE } from '../routes';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Form, Button, Container, Card } from 'react-bootstrap';
import backCodes from '../back_codes';

const backUrl = import.meta.env.VITE_BACKEND_URL;


function SigninPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(backUrl + '/signin')
      .then(response => {
        console.log('Mensagem do back: ' + response)
      })
      .catch(err => {
        alert(err)
      })
    }, []);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Login attempt with:', { email, password });
    setMessage()
    const form = {email, password}
    try {
      const res = await axios.post(backUrl + '/signin', form)
      const {token} = res.data
      localStorage.setItem('authToken', token)
      const payload = jwtDecode(token);      
      const userData = payload.userData
      const username = userData.username
      navigate(`/dashboard/${username}`);
    } catch (err) {
      if (err.response) {
        const errorMsg = err.response.data.message
        const errorCode = err.response.data.code
        errorCode === backCodes.INVALID_AUTH ? setMessage(errorMsg) : alert(backCodes.GENERIC_ERROR_FEEDBACK)
      } else if (err.request) {
        alert('Unable to communicate with the server. Please check your connection.')
      } else {
        alert('Error while attempting to send request. Please, try again.')
      }
    }
  };

  return (
    <Container 
    className="d-flex justify-content-center align-items-center" 
    style={{ minHeight: '100vh' }}>
      <Card style={{ width: '25rem' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4 fs-3">Login</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className='fs-5'>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!!message}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className='fs-5'>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!message}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 fs-5">
              Login
            </Button>
            <p style={{color: 'var(--red-color)'}}>{message}</p>
          </Form>
          <div className="mt-3 text-center">
            Don't have an account? <Link to={SIGNUP_ROUTE}>Register here</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default SigninPage;