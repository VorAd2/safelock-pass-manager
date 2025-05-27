import { useState, useEffect } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { Link} from 'react-router-dom'; //useNavigate
import { SIGNIN_ROUTE } from '../routes';
import axios from 'axios';
const backUrl = import.meta.env.VITE_BACKEND_URL;

function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  //const navigate = useNavigate();

  useEffect(() => {
        fetch(backUrl + '/signup')
            .then(res => res.text())
            .then(data => {console.log('Resposta do back: ', data)})
            .catch(err => {
                console.error('Erro na requisição: ', err)
            })
    }, []);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password != confirmPassword) {
      alert('As senhas devem ser iguais');
      return;
    }
    const form = {name: name, email: email, password: password};
    try {
      const res = await axios.post(backUrl + '/signup', form);
      setMessage(res.data.message);
    } catch (err) {
      setMessage('Erro ao registrar usuário: ' + err);
    }
    //navigate('/'); // Redirect to login after registration
  };


  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '25rem' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">Register</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicNameRegister">
              <Form.Label>Account Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

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
            <p>{message}</p>
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