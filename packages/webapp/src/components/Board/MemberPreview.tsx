import { Avatar, AvatarGroup, PropsOf } from "@chakra-ui/react";
import React, { FC } from "react";
import { useEntities } from "../../hooks/useEntity";
import { Task } from "../../store/display/types";

interface IProps extends PropsOf<typeof AvatarGroup> {
  members: Task["users"];
}

const MemberPreview: FC<IProps> = ({ members, ...rest }) => {
  const memberData = useEntities("users", members);
  return (
    <AvatarGroup size="sm" max={4} {...rest}>
      {memberData.map((m) =>
        m ? (
          <Avatar
            name={m.first_name + " " + m.last_name}
            title={m.first_name + " " + m.last_name}
            key={m._id}
          />
        ) : null
      )}
    </AvatarGroup>
  );
};

export default MemberPreview;
