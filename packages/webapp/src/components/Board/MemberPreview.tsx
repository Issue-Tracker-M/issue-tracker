import { Avatar, AvatarGroup } from '@chakra-ui/react'
import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { userSelectors } from '../../store/entities/users'
import { Task } from '../../store/workspace/types'

interface IProps {
  members: Task['users']
}

const MemberPreview: FC<IProps> = ({ members }) => {
  const memberData = useSelector((state) =>
    members.map((id) => userSelectors.selectById(state, id))
  )
  return (
    <AvatarGroup size="sm" max={4}>
      {memberData.map((m) =>
        m ? (
          <Avatar
            name={m.first_name + ' ' + m.last_name}
            title={m.first_name + ' ' + m.last_name}
            key={m._id}
          />
        ) : null
      )}
    </AvatarGroup>
  )
}

export default MemberPreview
