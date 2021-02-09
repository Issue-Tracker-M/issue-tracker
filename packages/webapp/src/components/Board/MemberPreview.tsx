import { Avatar, AvatarGroup } from "@chakra-ui/react";
import React, { FC } from "react";
import { useEntities } from "../../hooks/useEntity";
import { Task } from "../../store/workspace/types";

interface IProps {
  members: Task["users"];
}

const MemberPreview: FC<IProps> = ({ members }) => {
  const memberData = useEntities("users", members);
  return (
    <AvatarGroup size="sm" max={4}>
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
