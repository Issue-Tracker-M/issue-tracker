import { WarningTwoIcon } from '@chakra-ui/icons'
import { Box, Heading } from '@chakra-ui/react'
import React, { FC } from 'react'

const TaskViewItem: FC<any> = ({ children, icon, title, size = 'sm' }) => {
  return (
    <Box pb=".5rem">
      <Box
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        pb=".5rem"
      >
        {icon ? icon : <WarningTwoIcon color="red.500" />}
        <Heading size={size} paddingLeft="1rem">
          {title}
        </Heading>
      </Box>
      <Box pl="2rem">{children}</Box>
    </Box>
  )
}

export default TaskViewItem
