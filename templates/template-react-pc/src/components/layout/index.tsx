import { Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import { Outlet, Link } from 'react-router-dom'
const {Header, Content, Sider} = Layout
import styles from './index.module.scss'
import { HomeFilled, UserOutlined } from '@ant-design/icons'

type MenuItem = Required<MenuProps>['items'][number]

const LayoutPage = () => {
  const items: MenuItem[] = [
    {
      key: 'home',
      label: <Link to='home'>Home</Link>,
      icon: <HomeFilled />
    },
    {
      key: 'about',
      label: <Link to='about'>About</Link>,
      icon: <UserOutlined />
    },
  ]

  return (
    <Layout className={styles.wrapper}>
      <Header className={styles.header}>
        <div className={styles.title}>标题</div>
      </Header>
      <Layout>
        <Sider collapsible>
          <Menu items={items} theme='dark'></Menu>
        </Sider>
        <Content className={styles.container}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default LayoutPage