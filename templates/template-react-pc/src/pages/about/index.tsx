import { Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/stores/hooks";

const About = () => {
  const navigate = useNavigate()
  const count = useAppSelector((state) => state.counter.value)

  return (
    <>
      <h1>About</h1>
      <h1>Redux: {count}</h1>

      <Space>
        <Button type="primary" onClick={() => navigate('/home')}>
          go Home
        </Button>
      </Space>
    </>
  )
}

export default About