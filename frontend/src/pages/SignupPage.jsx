import { useState, useEffect } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { SIGNIN_ROUTE } from '../routes';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  useEffect(() => {
        fetch('http://localhost:3001/signup')
            .then(res => res.text())
            .then(data => {console.log('Resposta do back: ', data)})
            .catch(err => {
                console.error('Erro na requisição: ', err)
            })
    }, []);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Register attempt with:', { email, password });
    alert('Registration successful! (Simulated)');
    navigate('/login'); // Redirect to login after registration
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '25rem' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">Register</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmailRegister">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPasswordRegister">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicConfirmPasswordRegister">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100">
              Register
            </Button>
          </Form>
          <div className="mt-3 text-center">
            Already have an account? <Link to={SIGNIN_ROUTE}>Login here</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default SignupPage;