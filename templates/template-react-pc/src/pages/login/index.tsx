import { Button } from "antd";

import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate()

  return (
    <>
      <h1>Login</h1>
      <Button type="primary" onClick={() => navigate('/home')}>
        go Home
      </Button>
    </>
  )
}

export default Login