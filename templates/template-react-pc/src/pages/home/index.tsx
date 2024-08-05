import { useState } from "react";
import { Button, Space, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { decrement, increment } from "@/stores/counterSlice";
import {useRequest} from 'ahooks'

const Home = () => {
  const [value, setValue ] = useState(0)
  const navigate = useNavigate()
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()

  const promise = (): Promise<number> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(20)
      }, 2000);

      setTimeout(() => {
        reject('error')
      }, 2000);
    })
  }

  const {data, loading, error, run} = useRequest(promise, {manual: true})

  return (
    <div>
      <h1>Home</h1>
      <h1>Redux: {count}</h1>
      <h1>State: {value}</h1>

      <Spin spinning={loading}>
        <h1>mock data: {error ? String(error) : data}</h1>
      </Spin>
      <Space>
        <Button
          type="primary"
          onClick={() => {
            dispatch(increment())
            setValue(value + 1)
          }}
        >
          + 1
        </Button>
        <Button
          type="primary"
          onClick={() => {
            dispatch(decrement())
            setValue(value - 1)
          }}
        >
          - 1
        </Button>
        <Button type="primary" onClick={() => navigate('/login')}>
          go Login
        </Button>

        <Button type="primary" onClick={() => run()}>
          Fetch Data
        </Button>
      </Space>
    </div>
  )
}

export default Home