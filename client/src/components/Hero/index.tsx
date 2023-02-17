import Accordion from 'react-bootstrap/Accordion'
import './styles/hero.scss'

const Hero = () => {
    return(
    <Accordion className="my-0 hero-header">
      <Accordion.Item eventKey="0" className='border-0'>
        <Accordion.Header className='hero-header'>Stream movies online</Accordion.Header>
        <Accordion.Body className="site-text-color">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
    )
}

export default Hero