import { useState, useEffect } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { SIGNUP_ROUTE } from '../routes';
import axios from 'axios';
const backUrl = import.meta.env.VITE_BACKEND_URL;

function SigninPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
        fetch(backUrl + '/signin')
            .then(res => res.text())
            .then(data => {
              console.log('Resposta do back: ', data)
              setName(data);
            })
            .catch(err => {
                console.error('Erro na requisição: ', err)
            })
    }, []);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Login attempt with:', { email, password });
    const form = {email, password}
    try {
      const res = await axios.post(backUrl + '/signin', form)
      console.log('Login efetuado: ' + res.data.message);
      navigate(`/myvaults/${name}`);
    } catch (err) {
      setMessage('Erro ao logar: ' + err.message);
    }
    
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '25rem' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">Login</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
            <p>{message}</p>
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