import { useState, useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import axios from 'axios';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { SIGNIN_ROUTE } from '../routes';

const backUrl = import.meta.env.VITE_BACKEND_URL;


function SignupPage() {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
        axios.get(backUrl + '/signup')
          .then(response => {
            console.log('Mensagem do back: ' + response)
          })
          .catch(err => {
            alert(err)
          })
    }, []);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password != confirmPassword) {
      alert('Passwords must be the same');
      return;
    }
    const form = {username: username, email: email, password: password};
    try {
      const res = await axios.post(backUrl + '/signup', form);
      const {token} = res.data
      localStorage.setItem('authToken', token)
      const payload = jwtDecode(token)
      const userData = payload.userData
      const username = userData.username
      navigate(`/dashboard/${username}`);
    } catch (err) {
      if (err.response) {
        const errorStatus = err.response.status
        const errorMessage = err.response.data.message
        setMessage(`Erro(${errorStatus}) ao tentar registro de usuário: ${errorMessage}`)
      } else if (err.request){
        alert('Unable to communicate with the server. Please check your connection.')
      } else {
        alert('Error sending request')
      }
    }
  };


  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '25rem' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4 fs-3">Register</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicNameRegister">
              <Form.Label className='fs-5'>Account Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={username}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmailRegister">
              <Form.Label className='fs-5'>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPasswordRegister">
              <Form.Label className='fs-5'>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicConfirmPasswordRegister">
              <Form.Label className='fs-5'>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100 fs-5">
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