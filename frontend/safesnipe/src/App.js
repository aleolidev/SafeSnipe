import './App.css';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

function App() {
  return <Container>
    <Sidebar />
    <MainContent />
  </Container>
}

const Container = styled.div`
display:flex;
height: 97vh;
background-color: #1D2242;
border-radius: 2rem;
`;

export default App;
