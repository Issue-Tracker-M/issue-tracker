import React, { ReactNode } from 'react'
import { Box, Heading } from '@chakra-ui/react'

interface IProps {
  title: string
  children: ReactNode
}

const AuthFormWrapper = ({ title, children }: IProps) => {
  return (
    <Box margin="0 auto" pt={4} maxW={600}>
      <Heading color="teal.500" textAlign="center" size="2xl">
        {title}
      </Heading>
      <Box p={[4, 8]}>{children}</Box>
    </Box>
  )
}

export default AuthFormWrapper
