import React from 'react'
import { Box } from '@chakra-ui/react'
import NavBar from '../components/NavBar'
import Board from '../components/Board/board'

const Dashboard = () => {
  return (
    <Box display="flex" w="100vw">
      <NavBar />
      <Box minHeight="100vh" marginLeft="309px" w="100%">
        <Board />
      </Box>
    </Box>
  )
}

export default Dashboard
