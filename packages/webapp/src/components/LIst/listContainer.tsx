import React from 'react'
import { Box, Text } from '@chakra-ui/react'
import ListColumn from './listColumn'

const data = ['To do', 'In Progress', 'Completed']

const ListContainer = () => {
  return (
    <Box
      height={{ md: '83vh' }}
      display={{ md: 'flex' }}
      flexDirection={{ md: 'column' }}
      alignItems={{ md: 'flex-start' }}
      justifyContent={{ md: 'flex-start' }}
      overflow={{ md: 'auto' }}
      minWidth="100%"
    >
      <Box
        backgroundColor="#fff"
        cursor="pointer"
        minWidth="100%"
        p={2}
        // onClick={() => setOpen(true)}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text color="grey" w="30%" fontSize="sm"></Text>
        <Text w="5%" fontSize="sm">
          Priority
        </Text>
        <Text w="10%" fontSize="sm">
          Due Date
        </Text>
      </Box>
      {data.map((list, i) => (
        <ListColumn text={list} key={i} index={i} id={list} />
      ))}
    </Box>
  )
}

export default ListContainer
